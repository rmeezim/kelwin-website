#!/bin/sh
# The second-pass films (run from R): sh qa/r10/art/turn/v2/films.sh [a] [b] [today]
# REAL TIME (v2/tools/film.mjs: tool/film9.mjs plus --prescroll, --takes and the recorder-stall measure over the lift),
# between APPROVED pages only (the homepage, the System Audit, Insights), so no rejected round-9 copy is filmed:
#   <V>-home-to-audit      the homepage's final call to action (red) → the System Audit
#   <V>-audit-to-insights  the System Audit → Insights (the nav's Resources)
#   <V>-insights-to-home   Insights → the homepage (the logo): no hand-off there; the hero plays as approved
#   <V>-arrive-audit       entering the site cold on the System Audit
#   <V>-audit-to-insights-390   the same click on a phone (the phone composition: v2/<v>-390)
# Each keeps the best of up to 4 takes (the CDP screencast sometimes stops delivering frames for ~250ms while the page
# keeps drawing: see v2/probe/ and the report); json: recorderStallOverLiftMs.
set -e
D=qa/r10/art/turn/v2; F=$D/films; mkdir -p $F
for v in ${@:-a b today}; do
  V=$(echo $v | tr a-z A-Z); [ $v = today ] && V=today
  node $D/tools/film.mjs turn $D/$v/page-home.html --prescroll 3000 --click ".km-cta-U__btn" --lead 900 --after 3300 --takes 4 --poster click+700 --out $F/$V-home-to-audit.mp4 >/dev/null
  node $D/tools/film.mjs turn $D/$v/page-audit.html --click /insights --lead 900 --after 3200 --takes 4 --poster click+700 --out $F/$V-audit-to-insights.mp4 >/dev/null
  node $D/tools/film.mjs turn $D/$v/page-insights.html --click "a.ac-nav__brand" --lead 900 --after 3600 --takes 4 --poster click+700 --out $F/$V-insights-to-home.mp4 >/dev/null
  node $D/tools/film.mjs arrive $D/$v/page-audit.html --hold 3600 --takes 4 --poster 500 --out $F/$V-arrive-audit.mp4 >/dev/null
  node $D/tools/film.mjs turn $D/$v-390/page-audit.html --vp 390x844 --width 390 --click /insights --lead 900 --after 3200 --takes 4 --poster click+700 --out $F/$V-audit-to-insights-390.mp4 >/dev/null
  for f in $F/$V-*.json; do python3 -c "import json,sys; j=json.load(open(sys.argv[1])); print(sys.argv[1].split('/')[-1], 'stall', j.get('recorderStallOverLiftMs'), 'takes', j.get('takes'), 's', j['seconds'], 'kb', j['kb'], 'err', j['errors'])" $f; done
done
