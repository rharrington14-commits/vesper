# Vesper — peptide & medication log

Single-file web app: open `index.html` in any modern browser. No backend, no external dependencies.

## Features
- **Profiles:** two-button toggle `[Rodney][Caroline]`. Each profile is fully independent; the last active one is remembered.
- **Entries (peptides and medications):** Type (Peptide / Medication), name, vendor, status (active/paused/finished),
  dosing interval in days (required whole number for medications, optional for peptides), vial size, start date,
  reconstitution info. Main list shows both with a type badge, a thumbnail, and filter tabs All / Peptides / Medications.
  Older saved data without a type is treated as Peptide.
- **Due status** (active entries with an interval): last dose = latest date in the log; due = last + interval (calendar days,
  local time). Example interval 5, last dose day 1: days 2–4 "Next dose in N days (due …)"; day 5 "Due now (scheduled
  tomorrow, …)" (amber); day 6 "Due today" (amber); later "Overdue by N days" (red); no doses "No doses yet".
  Paused/finished entries are not flagged.
- **Entry photo:** Add / Change / Remove (with confirm) on the detail page; full image on detail, 96 px thumbnail in the list.
- Dose log (date, amount, mg/mcg/IU/mL, injection site, time of day and/or exact time), mixing records with
  auto-calculated concentration, notes, edit / status / delete with confirmation.
- **Reconstitution calculator** (mg/mL, mcg/mL, draw volume in mL and U-100 syringe units).
- **Progress:** photo entries (photo required; date; optional weight lb/kg, body fat %, waist, notes); timeline newest
  first with change vs previous; edit / delete; **Compare** exactly two entries side by side (days apart, weight change,
  body-fat change; stacks on mobile); weight trend chart.
- **Backup:** Export / Import JSON for the active profile, including photos.

## Storage
localStorage keys:
- `vesper:profile:rodney`, `vesper:profile:caroline` — log data (no image data)
- `vesper:img:<profile>:<imageId>` — each photo as `{full, thumb}` JPEG data URLs (full ≤ 800 px, q≈0.8; thumb 96 px)
- `vesper:active`, `vesper:filter` — UI state
- `vesper:seed:rodney:sample-medication-v1` — one-time flag for adding the sample medication to existing Rodney data

Browsers give localStorage about 5 MB per site, roughly a few dozen photos. If it fills up Vesper shows a "Storage full"
message and keeps your existing data unchanged.
On first load Rodney gets clearly labeled sample entries (3 peptides and 1 "Sample Medication"); Caroline starts empty.
No sample progress photos are shipped. To reset, use Backup → Clear or clear site data.

## Tests
- `node tests/due-date.test.js` — due-date logic (days 2, 4, 5, 6, 7, 8; DST changes; rollover).
- `tests/e2e.playwright.js` — headless Chrome end-to-end (needs `playwright-core` and Chrome at /usr/bin/google-chrome).

## Apple Health (HealthKit)
Apple Health sync is not available to web apps, so weight is entered manually. HealthKit is a native framework:
an app needs the HealthKit capability/entitlement and Info.plist usage strings, and it asks for permission with
`HKHealthStore.requestAuthorization` in Swift/Objective-C. Safari has no HealthKit JavaScript API.
Reading weight from Health (HKQuantityTypeIdentifierBodyMass) would require wrapping Vesper in a native iOS app,
for example Capacitor with a HealthKit plugin (those plugins don't work on the web platform).

Sources:
- https://developer.apple.com/documentation/healthkit
- https://developer.apple.com/documentation/healthkit/setting-up-healthkit
- https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data
- https://developer.apple.com/documentation/safari-release-notes/safari-26-release-notes (Web API list, no HealthKit)

Vesper is a personal log, not medical advice.
