# Mike & Julia — Wedding Website (mikejulia.com)

Static site for GitHub Pages. Password-gated, mobile friendly.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `mikejulia-wedding`) and push these files to the root of the `main` branch.
2. Repo → Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
3. Under "Custom domain," enter `mikejulia.com` (the CNAME file in this repo keeps it set). Check "Enforce HTTPS" once the certificate provisions (can take up to an hour).

## Point mikejulia.com at GitHub (GoDaddy DNS)

In GoDaddy → My Products → mikejulia.com → DNS:

1. Delete any existing A record for `@` (usually "Parked").
2. Add four A records, name `@`, pointing to:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
3. Add/edit a CNAME record: name `www`, value `YOUR-GITHUB-USERNAME.github.io`
4. DNS can take a few minutes to a few hours to propagate.

## Activate the RSVP form (2 minutes)

The form posts to Formspree (free tier: 50 submissions/month; paid tiers for more).

1. Sign up at https://formspree.io and create a new form.
2. Copy your form endpoint (looks like `https://formspree.io/f/abcd1234`).
3. In `rsvp.html`, replace `YOUR_FORM_ID` with your ID.
4. Submissions arrive in your email; the Formspree dashboard also exports to CSV.

Alternative: embed a Google Form instead — replace the `<form>` block in rsvp.html with the Google Form iframe embed code.

## Changing the password

The password never appears in the code — only its SHA-256 hash, in `js/site.js` (`PASS_HASH`).
To change it, generate a new hash of the lowercase password:

    echo -n "newpassword" | shasum -a 256        # Mac
    echo -n "newpassword" | sha256sum            # Linux

...or use any online SHA-256 tool, then paste the hash into `PASS_HASH`.

Note: this is client-side gating — friendly privacy, not bank-vault security. It keeps
casual visitors and search engines out (pages are also tagged noindex), which is the
standard approach for wedding sites.

## Things to confirm / edit

- **Wedding date**: I assumed the wedding is **Saturday, Sept 18, 2027** (the welcome
  party is Friday, Sept 17, 7–9pm — the ceremony at 5pm can't be the same evening).
  If that's wrong, edit the dates in `index.html` and `rsvp.html`.
- RSVP deadline (currently "August 1, 2027") in `rsvp.html`.
- Attire dress code (currently "Garden formal") and colors in `attire.html`.
- Accommodations page is a "coming soon" placeholder with a commented-out card
  template ready to fill in.
