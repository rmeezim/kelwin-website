import json, sys
for path in sys.argv[1:]:
    for sec in json.load(open(path))["result"]["sections"]:
        for o in (sec.get("crit") or {}).get("options", []):
            print(f"{sec['id']:<12} {o['slot']}  {o['score_before']:>4} → {o['score_after']:<4} notes:{'yes' if o['founder_notes_honoured'] else 'NO '} {o['final_status']:<4} open:{len(o['remaining'])}  {('· ' + o['remaining'][0][:120]) if o['remaining'] else ''}")
