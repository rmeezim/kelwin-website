import json, sys
for path in sys.argv[1:]:
    res = json.load(open(path))["result"]
    for sec in res["sections"]:
        crit = sec.get("crit") or {}
        titles = {o["opt"]: o["title"] for o in (sec.get("design") or {}).get("options", [])}
        for o in crit.get("options", []):
            b = sum(o["before"].values()) / 7; a = sum(o["after"].values()) / 7
            low = min(o["after"], key=o["after"].get)
            print(f"{sec['id']:<12} {o['opt']}  {titles.get(o['opt'], '')[:26]:<26} {b:4.1f} → {a:4.1f}  {o['final_status']:<4} lowest:{low}={o['after'][low]}  fixes:{len(o['fixes'])}  open:{len(o['remaining'])}")
