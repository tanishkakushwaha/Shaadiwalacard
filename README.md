# Shaadi Reply

A wedding RSVP app with a dark charcoal, muted plum, and antique gold design, original palace and botanical SVG illustrations, and responsive layouts for hosts and relatives.

## Stack

- Next.js App Router with TypeScript and React. `next`, `react`, and `react-dom` use npm’s `latest` stable tag on the first installation; commit the resulting `package-lock.json` to lock those exact versions.
- Tailwind CSS 4 and locally owned shadcn/ui components, with Radix Dialog and Slot primitives.
- NextAuth / Auth.js v5 (`next-auth@beta`) with email/password credentials and JWT sessions. v5 is distributed under the beta tag.
- Prisma ORM 7, its PostgreSQL driver adapter, and PostgreSQL.
- Lucide icons, Sonner notifications, and Zod validation.

## Start locally

Requires Node.js 24.11 or newer and either Docker Compose or an existing PostgreSQL database.

The creation workspace includes an ignored `.env` with a freshly generated local authentication secret and the supplied Docker database URL. In a fresh checkout, prepare it with the two steps below. Keep `.env` private.

```bash
cp .env.example .env
```

Generate a secret and paste the output into `AUTH_SECRET` in `.env`:

```bash
openssl rand -base64 32
```

Start the supplied local database, install dependencies, apply the checked-in migration, and launch the app:

```bash
docker compose up -d
npm install
npm run db:deploy
npm run dev
```

On Linux Mint/Ubuntu, you can install PostgreSQL directly instead of Docker. Run this from your normal machine terminal:

```bash
bash scripts/install-local-postgres.sh
npm install
npm run db:deploy
npm run dev
```

The script installs the distribution's PostgreSQL packages, enables the service, and creates the local `shaadi` role and `shaadi_reply` database using the credentials in `.env.example`. It preserves existing roles and databases. If those names already exist with different credentials, update `DATABASE_URL` to match your existing setup.

Open **http://localhost:3000**. If using an existing PostgreSQL instance, skip Docker and set your own `DATABASE_URL`. `AUTH_URL` must match the URL you use to visit the app. The PostgreSQL password in Compose is a local development value; use your own credentials in production.

Prisma Client is generated automatically after installation. Generation does not require a running database; using authentication and saving data does.

## What you can do

1. Create an account at `/signup` and sign in at `/login`.
2. Create a wedding: couple’s names, wedding date and time, venue, city, personal note, and optional RSVP deadline. Times and deadlines use Indian Standard Time.
3. Copy the public invitation link or share it through WhatsApp. Relatives need no account.
4. Guests submit their name, yes/no attendance, total family size (up to 10), and an optional wish.
5. The private dashboard shows responses, attending/declining counts, expected guests, and messages. Search, filter, paginate, and export responses as CSV. It refreshes every 30 seconds while visible, and supports manual refresh.
6. Edit invitation details without changing the link, or pause and reopen guest replies. Deadlines must also be extended if they have passed.

## Design demo

- `/demo`: dashboard with clearly labelled sample data.
- `/rsvp/demo`: sample guest invitation. Demo replies are saved only in your browser’s local storage and appear on the demo dashboard in the same browser.

After installing dependencies, these demo pages require neither PostgreSQL nor a configured account. Real sign-in and weddings always use PostgreSQL; the demo never replaces actual persisted records.

## Project layout

```text
src/app/                 Pages, authentication route, and server actions
src/components/          Dashboard, forms, invitation UI, and original SVG art
src/components/ui/       Locally owned shadcn/ui components
src/lib/                 Prisma, validation, passwords, CSV, dates, and rate limiting
src/auth.ts              NextAuth credentials and session configuration
prisma/schema.prisma     Database models
prisma/migrations/       Initial PostgreSQL migration
tests/core.test.ts       Dependency-free security and date tests
```

Use `npx shadcn@latest add <component>` to add more shadcn components; `components.json` is configured for this project.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

The tests exercise password hashing and malformed-hash handling, CSV formula injection protection, calendar validity, and RSVP deadline boundaries. Type checking and building require installed dependencies. Real integration testing also requires PostgreSQL.

Manual acceptance check after setup:

1. Sign up, log in, create a wedding, and copy its link.
2. Open the link in a private window and submit a yes with 3 guests. Verify the host dashboard shows the guest and increases expected guests by 3.
3. Update the reply to no from that same private window. Verify it updates the existing row, increases the declining count, and removes those 3 expected guests.
4. Pause replies and confirm new guest submissions are rejected; reopen them and test a deadline.
5. Sign in with a second host and confirm the first host’s weddings and replies are inaccessible, including through a copied edit URL.
6. Export a guest reply containing `=1+1` and confirm the CSV treats it as text.

## Data and security behavior

- Passwords are salted and hashed using Node’s scrypt; only hashes are stored.
- Every dashboard query and wedding mutation checks the authenticated owner. Guest pages select only invitation fields, never the guest list or owner’s credentials.
- A random 256-bit HttpOnly cookie identifies a browser’s reply to each wedding; only its SHA-256 hash is stored. Guests can update their reply from that browser. No guest email, account, or verified identity is required. A shared link can be forwarded, so hosts should share it with their intended guests. Separate browsers can submit separate responses under the same name.
- Rate limiting is persisted in PostgreSQL: 10 login attempts per email per 15 minutes, 10 sign-ups per IP per hour, and 60 RSVP writes per invitation/IP per 15 minutes. Put production behind a reverse proxy that sanitizes `X-Forwarded-For`; otherwise IP rate limits are not reliable. This does not provide email verification or account recovery.
- Rate-limit windows expire logically. Periodically delete rows whose `expiresAt` is in the past to keep the table small.
- Auth.js handles authentication CSRF protection; Next.js Server Actions enforce their same-origin request checks. Deploy behind HTTPS so session and reply cookies are secure.
- CSV exports escape cell contents and neutralize spreadsheet formula prefixes.

## Production

Deploy to a Node-compatible Next.js host (for example Vercel or a Node server) with a PostgreSQL connection string, a unique `AUTH_SECRET`, and your production `AUTH_URL`. Run `npm run db:deploy` against the production database before starting the app, then `npm run build` and `npm start`. Use connection pooling appropriate to your host, and commit the installation-generated lockfile for reproducible deployments.

This project uses Next.js server actions and Prisma’s PostgreSQL adapter. It is not a static export or a Cloudflare Worker deployment.

## Verification in the creation environment

The source was created in a session where DNS resolution for `registry.npmjs.org` fails and PostgreSQL/Docker are unavailable. Dependency installation, the Next.js production build, and database/browser integration could not be run here. See the final handoff for the actual checks completed; run the commands above after enabling networking and provisioning PostgreSQL.
