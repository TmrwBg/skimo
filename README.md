# Skimo — a configurable 8-week cycle engine for ski mountaineering

A phone-first training app for hybrid mountain athletes. You rank up to three training
goals; the app builds the week around them, computes every load from your estimated
maxes, and adjusts from one tap per exercise.

Two ideas do most of the work:

**No kilogram is written into the program.** The app holds an estimated one-rep max per
lift plus a schedule of sets, reps and reps-in-reserve. Every weight you see is computed.
That's what makes the same 8 weeks re-runnable indefinitely — there are no numbers in a
spreadsheet to hand-tune between cycles.

**You can only progress one thing hard.** Rank three goals and the app weights them
1.00 / 0.60 / 0.30: the first progresses to target volume, the second progresses but
capped, the third is held at minimum effective volume. That constraint comes from
Renaissance Periodization's position on concurrent training, and it's enforced rather
than suggested.

Built on Uphill Athlete's sequencing (aerobic base → general strength → max strength →
sport-specific muscular endurance) with RP's RIR-based autoregulation driving load.

---

## Is this for you?

It fits if you're training for ski mountaineering, skimo racing, alpinism or long uphill
days; you train in a normal commercial gym; and you have a treadmill or stair machine for
when terrain isn't practical.

It assumes you can tell 2 reps-in-reserve from 3 with reasonable honesty. If RIR is new,
the app schedules calibration sets in weeks 1 and 5 to show you how wrong you are — most
people overestimate what's left by three to five reps at first.

It won't fit if you want a fixed printable plan, or bodybuilding-style programming with no
endurance component.

**This is a personal training tool, not medical or coaching advice.** If you have an
injury, a heart condition, or you're coming back from a long layoff, talk to someone
qualified first.

---

## Install

1. Create a **public** GitHub repository (Pages needs public on free accounts).
2. *Add file → Upload files*, drag in all five — `index.html`, `manifest.webmanifest`,
   `sw.js`, `icon-192.png`, `icon-512.png` — at the **root**, not in a folder. Commit.
3. *Settings → Pages* → **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. Open the URL it gives you in **Safari** on iPhone (or Chrome on Android) and choose
   **Add to Home Screen**.

Launch from the home-screen icon, not the browser — that's what gives you full screen and
durable offline storage.

To try locally: `python3 -m http.server 8000`, then `http://127.0.0.1:8000`. Opening the
file directly works for a look around, but service workers need HTTPS or localhost, so
offline won't register.

Updating: drag a replacement `index.html` into the repo, reopen the app twice. Logged data
survives updates.

---

## First run: three things to set

### 1. Your starting numbers

Open `index.html`, find `seedAthlete()` near the top:

```js
bodyweightKg: 84,
e1RM: {
  squat: 60.0,        // known 1RM, or estimate one
  bench: 52.0,
  benchVolume: 52.0,  // same lift as bench — keep equal
  rdl: null,          // null = the app asks you to find the load
  legPress: null, bss: null, pullup: null, row: null
},
aerobic: {
  currentWeeklyMinutes: 120,  // your ACTUAL recent volume, not a target
  capMinutes: 480,            // weekly ceiling, includes the ME session
  aetBpm: 120, antBpm: null
},
me: { peakPackKg: 15, peakDurationMin: 60 }
```

Estimate an unknown 1RM with `load × (1 + (reps + RIR) / 30)`. A set of 40 kg × 8 with one
rep left gives 52 kg. Use sets of 3–10 reps; the formula drifts badly above 12.

**Leave anything uncertain as `null`** — the app shows "Find your load" on first exposure,
you work up to the target RIR, and what you enter seeds the lift. This is the right route
for machines, where leverage varies too much between gyms for a formula to mean anything.

**Be honest about `currentWeeklyMinutes`.** Week 1 seeds to
`min(current × 1.5, current + 90)`. Inflating it is the most reliable way to hurt yourself
here — connective tissue adapts far slower than the cardiovascular system.

You can also skip the file entirely: install with defaults, then tap any weight in the app
to overwrite it with what you actually lifted, which reseeds that lift.

### 2. Your thresholds

**Thresholds & tests** holds both protocols in full.

**Aerobic threshold (AeT)** — the heart-rate drift test. Warm up 15 minutes, hold a steady
heart rate for 60 minutes on constant terrain, then compare pace-to-heart-rate between the
two halves. Under 5% drift means you were at or below AeT; over 5% means above. Your AeT
is the highest heart rate you can hold for an hour under 5% drift.

**Anaerobic threshold (AnT)** — a 30-minute time trial. Warm up, go as hard as you can
hold evenly for 30 minutes, and take the average heart rate of the **final 20 minutes**.

Zones derive from both:

| Zone | Range | Use |
|---|---|---|
| 1 | below AeT − 10 | recovery and easy volume |
| 2 | AeT − 10 to AeT | aerobic base, most of the week |
| 3 | AeT to AnT | tempo |
| 4 | AnT to AnT + 5 | at threshold |
| 5 | above AnT + 5 | above threshold |

**AnT is optional.** Without it, zones 3–5 stay undefined and interval sessions fall back
to duration and perceived effort with heart rate as a guardrail. Base, endurance and
hypertrophy focuses need only AeT. Retest AeT at the end of week 7 every cycle — it rises
with training, and a stale value quietly turns easy sessions into moderate ones.

The app warns if AnT lands at or below AeT, or within 10 bpm of it. Both normally mean the
AeT test drifted high.

### 3. Your focus

**Training focus** lets you rank up to three of twelve:

| Focus | What it drives |
|---|---|
| General strength | broad force development; the sensible first cycle |
| Max strength | heavy low reps, 1.5% growth, accessories trimmed |
| General hypertrophy | balanced upper and lower volume |
| Upper-body hypertrophy | pressing and pulling to MRV; low interference with uphill work |
| Lower-body hypertrophy | leg mass; competes with uphill endurance for the same tissue |
| Uphill muscular endurance | adds the Friday ME session, loaded and steep |
| Long uphill aerobic | adds a long day; duration and fat oxidation |
| Aerobic base | weekly volume below threshold |
| Peak aerobic capacity | adds interval sessions; wants AnT tested |
| Durability | eccentrics, ankles and knees; the tissue that fails on descents |
| Maintenance / in-season | hold everything at MEV; cannot be ranked first |
| Resensitization | 2–3 weeks at low volume; runs alone |

The screen shows exactly what your combination produces — weekly set targets, the strength
scheme, load growth, and which session types get added.

Some combinations are refused, not just warned about: maintenance ranked first (it's
defined as holding, not building) and resensitization alongside anything else (its purpose
is removing stimulus). Others warn and let you proceed — intervals plus hypertrophy in the
top two, or muscular endurance ranked first in your very first cycle before you have a
force ceiling to build it on.

---

## How the week is built

### Choosing your training days

**Training focus → Training days** lets you pick which days you train. Five is the minimum;
anything you don't select is a rest day with nothing prescribed at all.

Roles are assigned by position rather than by weekday, so the shape holds whatever days you
choose: strength goes on the first and middle training days, the ME session on the last,
intervals on the earliest free day, and the long day next. With Monday to Friday selected
that produces the classic layout; with Monday, Wednesday, Thursday, Saturday, Sunday it
produces the same structure shifted onto those days.

If no ME session is scheduled, the long day takes the final training slot so two rest days
follow your biggest session.

### What each focus adds

| Focus includes | Effect |
|---|---|
| Uphill muscular endurance | Friday becomes the ME session |
| Peak aerobic capacity | Tuesday becomes intervals |
| Long uphill aerobic | Thursday becomes the long day |
| Durability | a tissue block is added to a strength day |
| Two or more endurance goals only | drops to a single strength day |

Rest days carry no prescribed volume at all — not "optional but expected". The weekly
aerobic target is met across whichever days you selected.

Calf raises, knee raises, lateral raises and trunk work are supersetted into rest periods,
so they cost no extra session time. Lifting days also carry a short easy afternoon session
on most weeks, at least six hours after the morning lift.

---

## How loads are decided

```
load = e1RM × (1 + growth)^loadingWeeksElapsed × pctOf1RM(reps, RIR)
pctOf1RM(reps, rir) = 1 / (1 + (reps + rir) / 30)
```

Loads round **down** on the first exposure of a cycle and to nearest after, then snap to
your smallest plate — 2.5 kg free weights, 5 kg machines by default, editable in `LIB`.

### The one tap

After the last working set of each main lift:

| Tap | Meaning | Inferred RIR |
|---|---|---|
| Had more | two or more reps still there | target + 2 |
| On target | landed where prescribed | target |
| Grindy | got the reps, about one harder than meant | target − 1 |
| Missed reps | prompts for what you actually did | 0 |

That updates your estimate through a moving average, weighted 0.5 for a lift's first three
sessions then 0.25. One bad session shouldn't move the schedule; three in a row should.
Changing your mind replaces the previous verdict rather than stacking on it.

**Expect a small dip after your first session of a cycle.** Week 1 rounds down, so an
honest "on target" set observes slightly below your seed and nudges the estimate down. That
corrects from week 2 once loads round to nearest.

### Assisted pull-ups work backwards, and the app knows

More weight on an assistance machine makes the movement *easier*. The app tracks your
pulling strength — total weight moved — and shows what the machine needs to give you. So
you see "−30 kg assist" falling toward zero, then flipping to "+15 kg added" once you're
past bodyweight. When it asks you to find your load, enter the **assistance** you used.

### Structure and deloads

Eight weeks in a 3:1 pattern: load 1–3, deload 4, load 5–7, deload 8.

On deloads, load stays near working weight (90% of the preceding loading week), sets halve,
RIR forces to 4. Only volume drops. **Deload sessions never update your estimated maxes** —
they aren't informative and would drag the estimate down.

---

## Aerobic and endurance

Rule-based, not tabular. A loading week is the previous *loading* week × 1.10; every fourth
week steps back to 65%; a hard weekly ceiling includes the ME session. From 120 min/week,
cycle 1 runs **180 → 200 → 220 → 145↓ → 240 → 265 → 290 → 190↓ minutes**.

Progress is **more vertical at the same heart rate** — never a higher heart rate. Once you
hit the cap, volume freezes and vert-per-hour at a fixed heart rate becomes the only metric.

**On a treadmill**, log distance and incline and the app works out vertical for you
(`distance × incline × 10`). Overwrite the vertical figure if your treadmill reports its own.
Keep base-session incline moderate, around 6–10%, and let speed do the work — steep at your
Zone 2 ceiling turns base work into muscular endurance, which Friday already covers.

**Muscular endurance** (Friday, when selected) is a percentage of your peak, so it rescales
each cycle: **35 → 40 → 45 → 25↓ → 50 → 55 → 60 → 30↓ minutes** at **0 → 5 → 7.5 → 0↓ →
10 → 12.5 → 15 → 5↓ kg**. Progression is incline, duration and pack — never speed, which
isn't a field anywhere in the app. Afterwards it asks what gave out first. Legs is the
answer you want. If it's breathing, cut incline, then speed, then pack. Poles enter week 6,
because skinning is a four-limb activity.

**Intervals** (when peak aerobic capacity is selected) run 4×3 min up to 6×4 min across the
cycle, targeting Z3 then Z4. Without AnT they're prescribed by effort instead.

**Long days** are one unbroken effort at or below AeT, up to half the week's volume. Eat
from the start rather than when you feel empty.

---

## Editing sessions

Any strength day has **Edit this session**: reorder, remove, swap, add, and per-week sets,
reps and RIR.

Sets/reps/RIR changes apply to the **current week only** — dropping a set because you're
tired shouldn't rewrite the cycle. A button carries that week's numbers forward to week 7.
Week 8 is never touched, so the deload survives.

**Same-pattern swaps keep your progression** — trading leg press for hack squat carries the
estimated max across. A different-pattern swap can't honestly inherit those numbers, so it
starts from a find-the-load set and says so. You can add from a catalogue of 25 movements or
type your own with a pattern tag and load increment.

Guards: removing your only squat, hinge, push, pull, unilateral, calf or trunk exercise
asks first; a session can't drop below two exercises.

Your edits are layered on top of the generated week rather than replacing it, so changing
focus later regenerates the layout around the exercises you chose. Each day has a reset to
go back to the generated version.

---

## Session tags

Every session has a collapsible notes panel: tags (24h shift, Poor sleep, Illness, Travel,
High stress, Underfed, Altitude), a morning resting HR field, and a free-text note. Flagged
days show a marker on the day tab.

**Tags are annotation only.** They change no prescription and don't touch your estimated
maxes. The intent is that when you review a finished cycle you can see *why* a week looked
the way it did, rather than have the engine make assumptions for you.

What that means in practice: a session after a bad night still feeds your estimate at full
weight and can contribute to the decline warning firing. Whether that matters is something
your own logged data will answer.

---

## Guardrails

| Rule | Threshold | Action |
|---|---|---|
| Load jump, same rep scheme | 7.5% | clamped, measured off the last loading week |
| Estimated 1RM decline | over 7% | warns, suggests an early deload |
| Missed reps on two lifts | same week | warns, suggests an early deload |
| Aerobic weekly growth | over 10% | clamped |
| Aerobic weekly total | above the cap | clamped |
| Estimate update on a deload | — | skipped |
| Estimate update where reps + RIR > 15 | — | skipped |
| Three hard sessions in one week | ME + intervals + long day | warns |
| ME speed field | — | never exposed |
| Maintenance ranked first | — | refused |
| Resensitization with other goals | — | refused |

The load clamp deliberately doesn't apply when the rep scheme changes. Moving from 6 reps to
4 legitimately needs a big load step — that's intensity, not overload, and clamping it would
stop you ever reaching the heavy work a max-strength block exists for.

**RIR calibration** in weeks 1 and 5: one extra set to genuine failure on leg press, to
compare your predicted stopping point against the real one. Never on squat, bench or RDL.

**Nutrition:** roughly 1.6–1.8 g protein per kg. A meaningful calorie deficit is
incompatible with the strength gains this engine projects.

---

## Changing your mind mid-cycle

Focus and training days can be changed at any time, but the clean moment is at **cycle
rollover**. Changing either part-way through rebuilds all eight weeks, including the ones
you've already trained: your logged sets, estimated maxes, tags and history all survive
untouched, but the prescriptions you look back on won't match what you actually did.

The app warns you about this once you're past week 1 with sessions logged — a standing note
on the focus screen and a confirmation before the change commits. There are legitimate
reasons to override it, an injury being the obvious one, so it asks rather than refuses.

---

## Finishing a cycle

"Finish cycle → start next" carries your estimated maxes forward, reseeds aerobic volume
from week 7 (not week 8's deload), adds 3 kg to the ME peak pack and 5 minutes to peak
duration, and archives the cycle with all its tags, notes, dates and threshold history.

Then pick a new focus. General strength → max strength is a sensible default: if your squat
is below bodyweight there's more to gain from force production than from more endurance
volume.

---

## Your data

Everything lives in IndexedDB on your device. No account, no server, no sync — private and
free, but **the data exists in exactly one place** and phones can evict web-app storage
under pressure. Tap **Back up my data** every couple of weeks and save the JSON to Files or
iCloud Drive.

The export contains your estimated-1RM history with dates and the tap that caused each
change, every session date, all tags, notes and morning HR readings, threshold history, all
aerobic/interval/ME sessions, and any custom exercises or schedule edits. That's enough to
chart progression against the days you flagged — which is the point of the tagging system.

---

## Customising further

Plain data near the top of `index.html`:

- `seedAthlete()` — all athlete-specific starting values
- `FOCUS` — the twelve focus definitions and what each drives
- `LANDMARK` / `RANK_W` — volume landmarks and the priority weights
- `BLOCKS` / `FIXED` — rep schedules; rows are `[sets, reps, targetRIR]`, `'D'` marks deload
- `LIB` — exercise names, patterns, load increments, rest times
- `CATALOG` — what the editor offers when adding exercises
- `ME_WK`, `INTERVAL_WK`, `DURABILITY` — session structures
- `TAGLIST` — available session tags

No kilogram appears anywhere in the file by design. Wanting to hard-code one usually means a
seed is wrong instead.

---

## Known limits

- The rest timer only runs while the app is open and awake. Phones won't fire it in the
  background.
- No sync between devices. One device, one log, manual backups.
- Aerobic, interval and ME session *structures* aren't editable in-app — change `ME_WK` or
  `INTERVAL_WK` in the file.
- The editor covers strength days only.
- Training days are a weekly pattern, not a calendar. If your shift rota rotates week to
  week, you'll be re-picking days rather than the app following a roster.
- Selecting muscular endurance, intervals and a long day together is allowed but warned
  about — that is five quality sessions a week once the two strength days are counted.
- Resensitization is described as 2–3 weeks but still runs as an 8-week container; finish it
  early and roll the cycle over when you're ready.
