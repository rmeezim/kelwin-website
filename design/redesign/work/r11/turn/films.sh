#!/bin/sh
# The round-11 turn films (run from this folder): sh films.sh [today] [lockup] [letters] [once] [arrive]
# REAL TIME (tools/film.mjs: a CDP screencast), between APPROVED pages only (the homepage, the System Audit, Insights),
# the same session for every turn:
#   <id>-home-to-audit.mp4            1440: the homepage's red final call → the System Audit
#   <id>-audit-to-insights-390.mp4    a phone (390): the System Audit → Insights (the nav's Resources)
#   once-*: entering the site cold (the full lockup), then (a cut) the same click (the mark alone)
#   arrive: today-arrive-audit.mp4 and lockup-arrive-audit.mp4, entering the site cold on the System Audit
# THE TAKE (round-11 fix, second pass): up to 10 takes each. Every take is encoded as the film will be and that film is
# read frame by frame (tools/steps.py, at its 30 fps): the kept take holds no flicker step for 3+ frames, then misses
# the fewest steps, then has the smallest recorder stall over all the motion (the sweep, the flicker, the lift).
# --flicker / --cold say when the logo is whole: today 470 / 270 (the mark), the full logo 610 / 410, the letters
# 700 / 500. Then tools/steps.py checks every finished film again.
set -e
F=films; mkdir -p $F withheld
N=${TAKES:-10}
for v in ${@:-today lockup letters once arrive}; do
  case $v in
    today) FL=470 ;; letters) FL=700 ;; *) FL=610 ;;
  esac
  OUTD=$F; [ $v = letters ] && OUTD=withheld
  case $v in
    once)
      node tools/film.mjs chain once page-home.html --click ".km-cta-U__btn" --hold 2200 --prescroll 1600 --lead 500 --after 3000 --takes $N --flicker 470 --cold 410 --poster arrivelift-100 --out $F/once-home-to-audit.mp4 >/dev/null
      node tools/film.mjs chain once-390 page-audit.html --vp 390x844 --click /insights --hold 2200 --prescroll 600 --lead 400 --after 3000 --takes $N --flicker 470 --cold 410 --poster arrivelift-100 --out $F/once-audit-to-insights-390.mp4 >/dev/null ;;
    arrive)
      node tools/film.mjs arrive today page-audit.html --hold 3000 --takes $N --cold 270 --poster 700 --out $F/today-arrive-audit.mp4 >/dev/null
      node tools/film.mjs arrive lockup page-audit.html --hold 3000 --takes $N --cold 410 --poster 700 --out $F/lockup-arrive-audit.mp4 >/dev/null ;;
    *)
      node tools/film.mjs turn $v page-home.html --prescroll 3000 --click ".km-cta-U__btn" --lead 900 --after 3200 --takes $N --flicker $FL --poster lift-100 --out $OUTD/$v-home-to-audit.mp4 >/dev/null
      node tools/film.mjs turn $v-390 page-audit.html --vp 390x844 --click /insights --lead 900 --after 3200 --takes $N --flicker $FL --poster lift-100 --out $OUTD/$v-audit-to-insights-390.mp4 >/dev/null ;;
  esac
done
python3 tools/steps.py $F/*.json withheld/*.json || true
for f in $F/*.json withheld/*.json; do python3 -c "import json,sys; j=json.load(open(sys.argv[1])); s=j.get('steps',{}); print(sys.argv[1].split('/')[-1], 'held', s.get('held'), 'missed', s.get('missed'), 'step', s.get('longestStepMs'), 'stall', j['recorderStallMs'], j.get('stallsMs'), 'takes', j['takes'], 's', j['seconds'], 'kb', j['kb'], 'err', j['errors'])" $f; done
