# Skimo — an 8-week cycle engine for ski mountaineering

A phone-first training app for hybrid mountain athletes: two strength days, two aerobic
days, one muscular-endurance day, free weekends. It installs to your home screen, works
offline, and stores everything on your device.

The distinguishing idea is that **no kilogram is written into the program.** The app holds
an estimated one-rep max for each lift plus a fixed schedule of sets, reps and
reps-in-reserve. Every load you see is computed from those two things. One tap after your
last set updates the estimate, and every future load re-renders. That's what makes the same
8 weeks re-runnable indefinitely — you never hand-tune a spreadsheet between cycles, because
there are no numbers in the spreadsheet to tune.

Built around Uphill Athlete's sequencing (aerobic base, then general strength, then
sport-specific muscular endurance) with Renaissance Periodization's RIR-based
autoregulation driving the strength progression.

---

## Is this for you?

It fits if you're training for ski mountaineering, skimo racing, alpinism or long uphill
days; you train in a normal commercial gym; and you have a treadmill or stair machine for
when real terrain isn't practical.

It assumes you can distinguish 2 reps-in-reserve from 3 with reasonable honesty. If RIR is
new to you, the app schedules calibration sets in weeks 1 and 5 to show you how wrong you
are — most people overestimate what they have left by three to five reps at first.

It won't fit if you want a fixed, printable plan that never changes, or bodybuilding-style
hypertrophy programming. Hypertrophy here sits third behind strength and endurance and is
deliberately kept small.

**This is a personal training tool, not medical or coaching advice.** If you have an
injury, a heart condition, or you're returning from a long layoff, talk to someone
qualified before running it.

---

## Install it on your phone

1. Create a **public** GitHub repository (Pages requires public on free accounts).
2. *Add file → Upload files* and drag in all five files — `index.html`,
   `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` — at the **root**, not
   inside a folder. Commit.
3. *Settings → Pages* → Source **Deploy from a branch**, branch `main`, folder `/ (root)`.
   Save, wait a minute, copy the URL it shows.
4. Open that URL in **Safari** on iPhone (or Chrome on Android) and choose **Add to Home
   Screen**.

Launch it from the home-screen icon rather than the browser — that's what gives you the
full-screen view and durable offline storage.

To try it locally first, run `python3 -m http.server 8000` in the folder and open
`http://127.0.0.1:8000`. Opening `index.html` directly as a file works for a look around,
but service workers need HTTPS or localhost, so offline support won't register.

To update later, drag a replacement `index.html` into the repo and reopen the app twice —
once to fetch, once to run. Logged data survives updates.

---

## Setting your own numbers

Everything athlete-specific lives in one function at the top of `index.html`. Find
`seedAthlete()` and change these before your first session:

```js
bodyweightKg: 84,

e1RM: {
  squat: 60.0,        // a known 1RM, or estimate one (see below)
  bench: 52.0,
  benchVolume: 52.0,  // same lift as bench — keep these equal
  rdl: null,          // null = the app asks you to find the load
  legPress: null
},

aerobic: {
  currentWeeklyMinutes: 120,  // your ACTUAL recent volume, not a target
  capMinutes: 480,            // weekly ceiling, includes the Friday ME session
  aetBpm: 120                 // aerobic threshold
},

me: { peakPackKg: 15, peakDurationMin: 60 },   // week-7 targets for cycle 1

blockType: 'general_strength'
```

**Estimating a 1RM you don't know.** Take a recent set and use
`e1RM = load × (1 + (reps + RIR) / 30)`. A set of 40 kg × 8 with about one rep left gives
`40 × (1 + 9/30) = 52 kg`. Use sets in the 3–10 rep range; the formula drifts badly above
about 12.

**Leave anything you're unsure of as `null`.** The app then shows "Find your load" instead
of a number on first exposure — you work up until the set matches the target RIR, and
whatever you enter seeds the lift. This is the recommended route for RDL, leg press and all
machine accessories, because machine leverage varies too much between gyms for a formula to
mean anything.

**Be honest about `currentWeeklyMinutes`.** Week 1 seeds to
`min(current × 1.5, current + 90)`, so a real 120 min/week starts you at 180. Inflating this
is the most reliable way to hurt yourself with this program — connective tissue adapts far
slower than the cardiovascular system does.

**Get your aerobic threshold from a field test, not a formula.** Uphill Athlete's AeT
protocol is the one this app assumes. Retest at the end of week 7 each cycle: AeT rises with
training, and every zone is derived from it, so a stale number quietly turns easy sessions
into moderate ones.

If you'd rather not edit code, install with the defaults and then tap any weight in the app
to overwrite it with what you actually lifted — that reseeds the lift through the same
formula.

---

## The week

| Day | Session |
|---|---|
| Monday | Strength A — squat, bench, Bulgarian split squat, lat pulldown |
| Tuesday | Aerobic, Zone 1/2 |
| Wednesday | Strength B — RDL, leg press, volume bench, chest-supported row |
| Thursday | Aerobic, Zone 1/2 |
| Friday | Muscular endurance — uphill simulation |
| Saturday, Sunday | Nothing scheduled |

Calf raises, hanging knee raises, lateral raises and weighted trunk work are supersetted
into rest periods, so they cost no extra session time. Monday and Wednesday also carry a
short easy afternoon aerobic session on most weeks, at least six hours after the morning
lift.

Weekends carry no prescribed volume at all — not "optional but expected". The weekly
aerobic target is met on weekdays, so skipping the weekend costs nothing.

---

## How loads are decided

```
load = e1RM × (1 + growth)^loadingWeeksElapsed × pctOf1RM(reps, RIR)

pctOf1RM(reps, rir) = 1 / (1 + (reps + rir) / 30)
```

Loads round **down** on the first exposure of a cycle and to nearest afterwards, then snap
to the smallest plate you have — 2.5 kg on barbells and dumbbells, 5 kg on machines by
default. Change these in `LIB` if your gym differs.

### The one tap

After the last working set of each main lift:

| Tap | Meaning | Inferred RIR |
|---|---|---|
| Had more | two or more reps still in the tank | target + 2 |
| On target | landed where prescribed | target |
| Grindy | got the reps, about one harder than intended | target − 1 |
| Missed reps | prompts for what you actually completed | 0 |

That observation updates your estimate through a moving average — weighted 0.5 for a lift's
first three sessions, then 0.25. One bad session shouldn't move the whole schedule; three in
a row should. Changing your mind on a tap replaces the previous verdict rather than stacking
a second adjustment on top.

**Expect a small dip after the very first session of a cycle.** Because week 1 rounds down,
an honest "on target" set observes slightly below your seed and nudges the estimate down a
fraction. That's the model working, and it corrects from week 2 once loads round to nearest.

### Structure and deloads

Eight weeks in a 3:1 pattern — load through weeks 1–3, deload week 4, load through 5–7,
deload week 8.

On deload weeks the load stays near working weight (90% of the preceding loading week), sets
halve, and RIR is forced to 4. Only volume drops. **Deload sessions never update your
estimated maxes** — they aren't informative and would drag the estimate down.

---

## Aerobic progression

Rule-based rather than tabular. A loading week is the previous *loading* week × 1.10, every
fourth week steps back to 65%, and there's a hard weekly ceiling that includes the Friday ME
session.

From a 120 min/week starting point, cycle 1 runs
**180 → 200 → 220 → 145↓ → 240 → 265 → 290 → 190↓ minutes**.

No single session exceeds 40% of the week. Afternoon sessions stay below 108 bpm. At least
80% of weekly volume sits below your aerobic threshold.

Progress here is **more distance or vertical at the same heart rate** — never a higher heart
rate. Once you reach the weekly cap, volume freezes permanently and pace-at-HR becomes the
metric.

---

## Muscular endurance

Friday only, expressed as a percentage of your peak so it rescales automatically each cycle.
With a 60-minute, 15 kg peak, cycle 1 gives
**35 → 40 → 45 → 25↓ → 50 → 55 → 60 → 30↓ minutes** at
**0 → 5 → 7.5 → 0↓ → 10 → 12.5 → 15 → 5↓ kg**.

Progression comes from incline, duration, interval length and pack weight. **Speed is not a
progression variable** and deliberately isn't a field anywhere in the app.

After each session it asks what gave out first — legs or breathing. Legs is the answer you
want; this is muscular endurance, not a cardio test. If it's breathing, reduce incline
first, then speed, then pack. Poles enter at week 6, because skinning is a four-limb
activity and training the legs alone under-prepares the movement.

---

## Session tags

Every session has a collapsible notes panel: tags (24h shift, Poor sleep, Illness, Travel,
High stress, Underfed, Altitude), a morning resting HR field, and a free-text note. Flagged
days show a small marker on the day tab.

**Tags are annotation only.** They change no prescription and don't touch your estimated
maxes. The intent is that when you review a finished cycle you can see *why* a week looked
the way it did, rather than have the engine quietly make assumptions on your behalf.

Worth understanding what that means: a session logged after a bad night still feeds your
estimate at full weight and can contribute to the decline warning firing. Whether that
matters is something your own data will answer after a cycle or two.

---

## Guardrails

Enforced in code rather than left to judgement:

| Rule | Threshold | Action |
|---|---|---|
| Session-to-session load jump | 7.5% | clamped, measured off the last loading week |
| Estimated 1RM decline | more than 7% | warns, suggests an early deload |
| Missed reps on two lifts | same week | warns, suggests an early deload |
| Aerobic weekly growth | more than 10% | clamped |
| Aerobic weekly total | above the cap | clamped |
| Estimate update on a deload | — | skipped |
| Estimate update where reps + RIR > 15 | — | skipped |
| ME speed field | — | never exposed |

**RIR calibration.** Weeks 1 and 5 prompt one extra set to genuine failure on leg press so
you can compare your predicted stopping point against the real one. Never do this on squat,
bench or RDL.

**Nutrition.** Roughly 1.6–1.8 g of protein per kg of bodyweight. A meaningful calorie
deficit is incompatible with the strength gains this engine projects; if losing weight is a
goal, give it its own block rather than running it concurrently.

---

## Finishing a cycle

"Finish cycle → start next" carries your estimated maxes forward, reseeds aerobic volume
from week 7 (not week 8's deload), adds 3 kg to the ME peak pack and 5 minutes to peak
duration, archives the completed cycle with all its tags and notes, and advances the block
type.

Three block types change the rep schemes and how fast loads climb:

| | General strength | Max strength | ME emphasis |
|---|---|---|---|
| Squat/RDL, week 1 → 7 | 3×6 → 4×4 | 4×5 → 5×2 | 3×6 → 3×5 |
| RIR range | 3 → 1 | 3 → 1 | 3 → 2 |
| Growth per loading week | 2.0% | 1.5% | 1.0% |
| Accessory sets | full | one fewer | one fewer |

A reasonable default is general strength first, then max strength — if your squat is below
bodyweight there's more to gain from force production than from more endurance volume.

---

## Your data

Everything lives in IndexedDB on your device. No account, no server, no sync — which keeps
it private and free but means **the data exists in exactly one place.** Phones can evict
web-app storage under disk pressure.

Tap **Back up my data** every couple of weeks and save the JSON to Files or iCloud Drive.
"Restore from backup" reads it back, including which cycle and block type you were in.

The export contains your full estimated-1RM history with dates, every feedback tap, all
tags, notes and morning HR readings, and every aerobic and ME session — enough to chart
progression against the days you flagged, which is the point of the tagging system.

---

## Customising further

Everything is plain data near the top of `index.html`:

- `seedAthlete()` — all athlete-specific starting values.
- `BLOCKS` and `FIXED` — the rep schedules. Rows are `[sets, reps, targetRIR]`, with `'D'`
  marking a deload week.
- `LIB` — exercise names, load increments and rest times.
- `DAYS_DEF` — which exercises appear on which day, and which are supersetted.
- `ME_WK` — the muscular-endurance percentages and session structures.
- `TAGLIST` — the available session tags.

No kilogram appears anywhere in the file by design. If you find yourself wanting to
hard-code one, that usually means the seed is wrong instead.

---

## Known limits

- The rest timer only runs while the app is open and the screen is awake. Phones won't
  reliably fire it in the background.
- No sync between devices. One device, one log, with manual backups.
- Aerobic and ME session structures aren't editable in the app — change `ME_WK` in the file.
- Adding or removing exercises means editing `DAYS_DEF` and `LIB`.
