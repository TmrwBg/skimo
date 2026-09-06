# Skimo — 8-week hybrid training app

An offline-capable web app for the ski-mountaineering block: two strength days, four
aerobic sessions, one muscular-endurance session, free weekends. It auto-progresses
from a single effort tap per exercise.

---

## Put it on your iPhone (about 10 minutes, once)

Everything below happens in a browser. No git, no command line, no Xcode.

1. **Make a GitHub account** at github.com if you don't have one.
2. **Create a repository.** Click **+** → *New repository*. Name it `skimo`.
   Set it to **Public** (GitHub Pages needs this on free accounts). Click *Create*.
3. **Upload the files.** On the repo page click *Add file* → *Upload files*, then drag in
   all five: `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`.
   Click *Commit changes*.
4. **Turn on Pages.** Go to *Settings* → *Pages* (left sidebar). Under **Source** pick
   *Deploy from a branch*, branch `main`, folder `/ (root)`. Click *Save*.
5. **Wait 1–2 minutes**, then reload that Settings page. It shows your URL —
   something like `https://yourname.github.io/skimo/`.
6. **On your iPhone**, open that URL in **Safari** (must be Safari, not Chrome).
   Tap the **Share** button → **Add to Home Screen** → *Add*.

You now have an app icon. Open it from there, not from Safari — that's what gives you
the full-screen view and reliable offline storage.

### Updating it later
Drag a replacement `index.html` into the repo (*Add file* → *Upload files*, same
filename, *Commit*). Reopen the app twice — once to fetch, once to run the new version.
Your logged data is untouched by updates.

---

## Using it

**Strength days.** Tap each set as you finish it; the rest timer starts automatically.
When the last set of an exercise is done, a row appears: *Had more / On target / Grindy /
Missed reps*. That one tap is the entire input the progression engine needs.

- **Had more** → adds a plate next session, and every session after
- **On target** → follows the planned increase
- **Grindy** → cancels next week's jump, repeats the load
- **Missed reps** → drops below what you just failed, then rebuilds

Adjustments carry forward for the rest of the block, so the plan bends to you rather
than the other way round. A `+2.5 adjusted` note under the weight shows when you've
drifted from baseline.

**Leg press** never shows a prescribed weight — machine leverages vary too much. Week 1,
find a load giving about 3 RIR at 10 reps and tap the weight to log it. It progresses
from there.

**Tap any weight** to overwrite it with what you actually lifted.

**Aerobic and ME days.** Log speed, incline and average heart rate. Speed-at-a-given-HR
is your real aerobic progress metric: more speed at the same heart rate across the block
means the base is improving. Average HR also gives you the two week-8 aerobic tests —
heart-rate drift, and HR at a fixed workload.

If your average comes in above the session's ceiling, the app says so. That isn't a
scolding — going over means the session did threshold work instead of base work, which
is the specific failure mode this plan is built to avoid.

**Weekends** carry no prescribed volume. Skipping costs nothing.

---

## Editing a session

Any strength day has **Edit this session** at the bottom. Inside, each exercise gets
reorder arrows, a remove button, a swap button, and editable Sets / Reps / RIR.

**Sets, reps and RIR change the current week only.** That's deliberate — dropping a set
because you're tired shouldn't silently rewrite the block. When you do want a change to
stick, the button at the bottom carries that week's numbers forward to week 7. Week 8 is
never touched, so the deload survives.

**Swapping.** Same-pattern swaps keep everything: the 8-week load schedule and your
accumulated autoregulation carry across, so trading leg press for hack squat doesn't
reset your progress. A different-pattern swap can't honestly inherit those numbers, so it
starts autoregulated and tells you it did.

**Adding.** Pick from the catalogue or tap *Something else…* to type your own, giving it
a pattern and a load increment. New exercises always start autoregulated — the app won't
invent a starting weight it has no basis for.

**Guards.** Removing your only squat, hinge, push, pull, unilateral, calf or trunk
exercise across the whole week asks first. A session can't go below two exercises.

You can edit any time. Mid-block, the editor says so, because a cross-pattern swap in
week 5 restarts that lift's progression.

---

## Week 8 — testing and the verdict

In week 8, Saturday becomes a **Test** tab. Eight fields; spread them across the week
rather than doing them in one sitting.

The AMRAP loads are computed from what you *actually* lifted in week 7, including any
autoregulated drift, and aimed at a 5–7 rep set where the 1RM estimate is most reliable.
If you get more than 12 reps the app says the estimate is unreliable rather than
pretending otherwise.

Once four tests are in, a verdict appears: which of the four next-block directions fits,
why, and the numbers behind it. Aerobic comparison is drawn automatically from your
logged sessions — weeks 1–2 versus 6–7, only comparing sessions run at similar incline,
and it says so plainly when there isn't enough data instead of guessing.

**You can override the branch.** Tap any of the four; the suggestion is marked but not
binding. Your choice is what block 2 gets built from.

One thing that is deliberately *not* treated as a warning sign: flat aerobic numbers.
Block 1 held aerobic at maintenance on purpose, so no change there is the plan working,
not a problem. Only genuine regression — declining speed, high drift, unexplained weight
loss, high fatigue — pushes toward a recovery block.

---

## Generating the next block

Below the verdict is **Build block N**, with two modes.

**Loads only** keeps your current weekly shape and just resets the numbers.
**Full replan** adds a day picker. Five training days is the floor — the app won't let
you go below it, so to swap a day you add the new one first, then remove the old.
Whatever you pick, it assigns two strength days spread apart, one ME day, and fills the
rest with aerobic work.

Loads carry forward two ways. Squat and bench rescale off your **tested maxes**.
Everything else rescales off whatever you actually autoregulated to, so a lift you drove
5 kg above plan starts the next block proportionally higher.

Each branch shapes the block differently:

| Branch | Strength | ME | Aerobic |
|---|---|---|---|
| Strength emphasis | full progression | 35 → 50 min | ~8 h |
| ME emphasis | flat maintenance, 3 sets, 2 RIR | 60 → 85 min | ~8 h |
| Specificity | progression at 95% | 55 → 90 min | ~8 h |
| Recovery | conservative restart at 82% | 30 → 45 min | ~6 h |

Aerobic holds at about 8 hours a week rather than climbing further — block 1 already took
you 6.0 → 7.9 h. The weekly budget is **divided across the aerobic days you choose**, so
picking six days makes each session shorter instead of adding hours to your week.

Generating archives the finished block into history and clears the log. **Back up first**
if you want session-by-session detail — the archive keeps your tests, adjustments and
cardio, not every logged set.

---

## Back up your data

Your log lives only on your phone. iOS can clear web-app storage under disk pressure,
so **tap "Back up my data" every couple of weeks** — it opens the share sheet, save the
JSON to Files or iCloud Drive. "Restore from backup" reads it back.

---

## Changing the plan

Open `index.html` and look for section 1, `SPEC`. It's plain data:

- `lib` — the exercise library. Each entry has a `pattern` (squat, hinge, push, pull,
  unilateral, calf, trunk), a load `inc`rement, and a list of `sub`stitutes.
- `sched` — the 8-week table for each exercise: `[load, sets, reps, targetRIR]` per week.
  `null` load means autoregulated.
- `days` — what happens each day. `dow: 0` is Monday. Add or remove entries in `slots`
  to change the session; `ss` attaches a superset that runs inside the rest period.
- `pm`, `tue`, `thu` — aerobic minutes per week for block 1. Generated blocks instead
  carry their own `mins` and `pm` arrays on each day entry, which take precedence.
- `me` — the ME sessions. `PROFILE` (section 2c) holds the four branch recipes.

A generated block is stored in your log as `LOG.spec` and merged over `SPEC` at startup,
so editing `SPEC` in the file only changes block 1 unless you reset progress.

To swap an exercise: add it to `lib`, add its 8-week row to `sched`, and point the slot
at it. Keep one exercise of each pattern so the session stays balanced.

---

## Known limits

- The rest timer only runs while the app is open and the screen is awake. iOS won't
  reliably fire it in the background.
- No sync between devices — this is deliberate. One device, one log, with backups.
- Aerobic and ME days aren't editable in-app — their structure comes from the branch
  profile. Change `SPEC.me` in the file if you want different session shapes.
- A generated block keeps whatever exercises you had. A specificity block suggests adding
  loaded carries and longer vertical; use the editor to put them in.
- Supersets can't be attached or detached in the editor yet, only in the file.
