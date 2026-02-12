import os
import requests
import time
from datetime import datetime, timedelta
from supabase import create_client, Client

# --- KONFIGURATION ---
# GitHub Actions zieht sich diese Werte aus den "Secrets"
URL = os.environ.get("SUPABASE_URL")
KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
API_KEY = os.environ.get("THE_SPORTS_DB_API_KEY") # Neu: Auch als Secret!

if not URL or not KEY or not API_KEY:
    print("Fehler: Umgebungsvariablen (SUPABASE oder API_KEY) fehlen!")
    exit(1)

supabase = create_client(URL, KEY)

LEAGUES = [
    {"name": "German Bundesliga", "id": "4331", "short": "BL1"}, # IDs sind oft Zahlen in der API
    {"name": "German 2. Bundesliga", "id": "4332", "short": "BL2"},
    {"name": "UEFA Champions League", "id": "4480", "short": "UCL"},
    {"name": "UEFA Europa League", "id": "4481", "short": "UEL"},
    {"name": "UEFA Conference League", "id": "4751", "short": "CONFL"},
    {"name": "DFB-Pokal", "id": "4693", "short": "DFB"}
]

def get_broadcaster(dt, league_short):
    weekday = dt.weekday() # 4=Fr, 5=Sa, 6=So
    time_str = dt.strftime('%H:%M')

    if league_short == "BL1":
        if weekday == 4: return "DAZN" # Freitag ist DAZN
        if weekday == 5:
            if time_str == "18:30": return "Sky (Topspiel)"
            return "Sky (Konferenz & Einzel)"
        if weekday == 6: return "DAZN" # Sonntag ist DAZN
    
    if league_short == "BL2":
        if weekday == 5 and time_str == "20:30": return "Sky & Sport1"
        return "Sky"
    
    if league_short == "UCL":
        if weekday == 1: return "Amazon Prime / DAZN"
        return "DAZN"
        
    return "Sky / DAZN / Free-TV"

def run_sync():
    today = datetime.now()
    all_matches = []

    print(f"--- Starte Match-Sync: {today.strftime('%d.%m. %H:%M')} ---")

    for league in LEAGUES:
        print(f"Lade {league['name']}...")
        
        # Wir schauen 10 Tage in die Zukunft
        for i in range(10):
            target_date = (today + timedelta(days=i)).strftime('%Y-%m-%d')
            # API URL korrigiert (Events per League on Day)
            url = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/eventsday.php?d={target_date}&l={league['id']}"
            
            try:
                response = requests.get(url)
                time.sleep(2.5) # Etwas schnelleres Polling ist meist okay
                
                data = response.json()
                events = data.get('events', [])
                
                if events:
                    for event in events:
                        # Zeitumrechnung
                        raw_time = event.get('strTime', '00:00:00')
                        dt_str = f"{target_date} {raw_time}"
                        try:
                            dt_gmt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
                            dt_de = dt_gmt + timedelta(hours=1) # Winterzeit-Korrektur
                        except:
                            dt_de = datetime.now() # Fallback

                        match_obj = {
                            "id": event.get('idEvent'), # WICHTIG: Supabase braucht die ID für 'upsert'
                            "match_name": f"{event.get('strHomeTeam')} vs. {event.get('strAwayTeam')}",
                            "home_team": event.get('strHomeTeam'), 
                            "away_team": event.get('strAwayTeam'),
                            "start_time": dt_de.isoformat(),
                            "league": league['short'],
                            "broadcaster": get_broadcaster(dt_de, league['short']),
                            "updated_at": datetime.now().isoformat()
                        }
                        all_matches.append(match_obj)
            except Exception as e:
                print(f"Fehler bei {league['short']} am {target_date}: {e}")

    if all_matches:
        print(f"Speichere {len(all_matches)} Spiele in Supabase...")
        # 'upsert' bedeutet: Wenn ID existiert -> Update, wenn nicht -> Neu anlegen
        supabase.table("matches").upsert(all_matches).execute()
        print("✅ Sync erfolgreich.")

if __name__ == "__main__":
    run_sync()
