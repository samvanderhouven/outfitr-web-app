# OutfitR – Web app (Explore + gedeelde post)

Dit is een losstaande webversie van OutfitR, gebouwd met Next.js. Hij doet twee dingen:

1. **`/explore`** – toont de openbare explore-feed (zelfde data als in de app), met infinite scroll.
2. **`/post/[id]`** – toont één gedeelde post fullscreen, in dezelfde stijl als de post-detail in de app. Dit is de pagina waar `https://api.outfitr.nl/post/:id`-links naartoe moeten wijzen (zie "Koppelen aan gedeelde links" hieronder).

Op **elk scherm** staat een vaste balk onderaan met een knop die naar de App Store gaat:
`https://apps.apple.com/nl/app/outfitr/id6760657115`

## Hoe het werkt (techniek in het kort)

- Alle aanroepen naar `api.outfitr.nl` gebeuren **server-side** (vanaf de Next.js server, niet vanuit de browser). Dit is gedaan omdat nog niet zeker was of de API CORS toestaat voor een ander domein — zo is dat geen probleem, want de browser praat alleen met onze eigen webapp.
- `/explore` haalt eerst data op via `GET {{base_url}}/explore`. Bij scrollen wordt meer geladen via onze eigen `/api/explore` route, die op zijn beurt de echte API aanroept.
- `/post/[id]` haalt de post op via `GET {{base_url}}/post/get-post/:id`.
- Bij het openen van een post wordt automatisch één keer een klik geregistreerd via `POST {{base_url}}/post/click-post/:id`.
- Alle endpoints worden zonder inlog-token aangeroepen (bevestigd dat dit werkt voor `/explore` en `/post/get-post/:id`).

## Setup

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000/explore`.

## Omgevingsvariabelen

Zie `.env.local`:

```
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/nl/app/outfitr/id6760657115
OUTFITR_API_BASE_URL=https://api.outfitr.nl/api/v1
NEXT_PUBLIC_SITE_URL=https://outfitr.nl
```

Pas `NEXT_PUBLIC_SITE_URL` aan zodra het echte domein bekend is.

## Deployen

Dit is een standaard Next.js-app, dus deze kan direct op **Vercel** gezet worden (aanbevolen, geen extra config nodig), of op elke host die Node.js draait:

```bash
npm run build
npm run start
```

## Koppelen aan gedeelde links uit de app

In de app worden gedeelde links momenteel gegenereerd als:

```
https://api.outfitr.nl/post/{postId}
```

(zie `src/utils/sharePost.js`, met `APP_DOMAIN = 'https://api.outfitr.nl'`)

Zodra deze webapp live staat op een domein (bv. `outfitr.nl` of `app.outfitr.nl`), zijn er twee opties:

**Optie A (aanbevolen):** zet de `APP_DOMAIN`-constante in `sharePost.js` om naar het domein van déze webapp, zodat gedeelde links direct hierheen gaan: `https://outfitr.nl/post/{postId}`.

**Optie B:** laat een redirect instellen op `api.outfitr.nl/post/:id` die doorstuurt naar `https://outfitr.nl/post/:id`, zodat bestaande/al gedeelde links blijven werken.

De route in deze webapp is in beide gevallen al `/post/[id]`, dus `post/:id`.

## Mappenstructuur

```
app/
  explore/page.tsx              – Explore-pagina (server component, eerste data-fetch)
  post/[id]/page.tsx            – Gedeelde post-pagina + Open Graph metadata
  post/[id]/not-found.tsx       – Weergave als een post niet (meer) bestaat
  api/explore/route.ts          – Proxy voor infinite scroll op /explore
  api/post-click/[id]/route.ts  – Proxy voor klik-registratie
components/
  ExploreFeed.tsx                – Masonry grid + infinite scroll (client)
  PostCard.tsx                   – Eén tegel in de explore-grid
  PostDetailView.tsx             – Fullscreen post-weergave (client)
  AppStoreBar.tsx                – Vaste "Open app"-balk, op elk scherm
  SiteHeader.tsx                 – Header met logo op de explore-pagina
lib/
  outfitr-api.ts                 – Server-only API-client naar api.outfitr.nl
  types.ts                       – Gedeelde TypeScript-types
  post-utils.ts                  – Kleine helpers (initialen, getal-opmaak, etc.)
public/brand/                    – Logo-assets uit de app
```

## Bekend aandachtspunt

Like, reageren en opslaan zijn in deze webversie **niet functioneel** (er is geen login op het web) — een tik daarop toont een korte uitnodiging om de app te openen. Dit kan later uitgebreid worden met een web-login indien gewenst.
