# Nithya Appannagaari Photography

Portfolio site for Nithya Appannagaari, plus private client albums she can share with a link on her own domain.

```bash
npm install
npm run dev
```

The portfolio is at [http://localhost:5173](http://localhost:5173). Production on Vercel serves the built site. Album photographs still use the Cloudflare Worker and R2 when that deploy is used.

## Contact form

The say-hi form posts to `POST /api/contact`. On Vercel that file is a serverless function. It checks the fields, ignores a hidden honeypot, and limits each address to 5 notes in 15 minutes. A valid note is sent with the Resend API. The reply-to is the person who wrote in. Their address is not shown anywhere on the site.

Set these in Vercel (Project Settings, Environment Variables). Do not commit them, and do not prefix them with `VITE_`.

| Name | What it is |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where inquiries are delivered |
| `CONTACT_FROM_EMAIL` | Sender. Use `onboarding@resend.dev` until a domain is verified |

For `npm run dev`, put the same names in `.env`. The dev server reads that file and does not ship it to the browser. `npm test` covers validation, the honeypot, the rate limit, and the Resend payload.

## Client albums

An album lives at a stable address such as `https://your-domain/share/spring-formal-k4m2`. The link does not expire. It stays up until the album is deleted. Albums are unlisted: nothing on the public site points at them, and there is no public index. The link name is the access.

The desk for creating albums is at `/share/admin`. It is not in the navigation. It asks for `SHARE_ADMIN_PASSWORD`.

Photographs are prepared in the browser before upload:

- JPEG, PNG, and WebP are accepted. HEIC is not.
- Files already within 30 MB and 4096 pixels on the long edge are stored as uploaded.
- Larger files are re-encoded to JPEG.
- Visitors see a lighter display copy. Thumbnails are smaller still.
- **Download all** packages the stored originals into a zip in the visitor's browser.

### Try it on this computer

Albums created here stay in `.data/share` on this machine. They are not the live site.

1. `cp .env.example .env`
2. Put a password in `.env` as `SHARE_ADMIN_PASSWORD`. `openssl rand -base64 24` is a good way to make one.
3. Restart `npm run dev` after changing `.env`.
4. Open [http://localhost:5173/share/admin](http://localhost:5173/share/admin).

Leave `SHARE_ADMIN_PASSWORD` empty and the desk refuses logins. Never commit `.env`. The name must not start with `VITE_`, or the password would be baked into the public JavaScript.

### Publish albums on the live site

The live desk and the public album links only work after the site is deployed to Cloudflare. R2 holds the photographs. The Worker serves both the portfolio and `/api/share`.

You need a free Cloudflare account. R2's free allowance is about 10 GB of storage per month, a monthly bundle of reads and writes, and no egress fees. Cloudflare usually asks for a payment method before R2 can be turned on; standard storage inside that allowance is not billed. The Workers free plan includes about 100,000 requests per day.

The bucket name in `wrangler.jsonc` is `nithya-share`. If you change it, change it in both places.

1. Create a Cloudflare account and turn on R2.
2. `npx wrangler login`
3. `npx wrangler r2 bucket create nithya-share`
4. `openssl rand -base64 24`, then `npx wrangler secret put SHARE_ADMIN_PASSWORD` and paste the password. This is the production password. It is stored as a Worker secret, not in the repo.
5. `npm run deploy`. This builds the site and publishes the Worker named `nithya-photography`.
6. In the Cloudflare dashboard, open **Workers & Pages → nithya-photography → Settings → Domains & Routes** and attach the portfolio domain.
7. Open `https://your-domain/share/admin`, unlock it, and create the album there. Upload on the live desk. A local album is not copied up by deploy.

`npx wrangler dev` reads `.dev.vars` (copy `.dev.vars.example`) and still needs the R2 bucket. Day-to-day local work can stay on `npm run dev` and `.env`.

| Name | Where it lives | What it is |
| --- | --- | --- |
| `SHARE_ADMIN_PASSWORD` | `.env` locally, Worker secret in production | Password for `/share/admin` |
| `SHARE_BUCKET` | `wrangler.jsonc` binding | R2 bucket `nithya-share` |
| `RESEND_API_KEY` | `.env` locally, Vercel env in production | Resend API key for the inquiry form |
| `CONTACT_TO_EMAIL` | `.env` locally, Vercel env in production | Inbox that receives inquiries |
| `CONTACT_FROM_EMAIL` | `.env` locally, Vercel env in production | Sender address, `onboarding@resend.dev` until a domain is verified |

Do not commit `.env`, `.dev.vars`, `.data/`, or `.wrangler/`.
