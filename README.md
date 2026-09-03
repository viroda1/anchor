Anchor OS


Anchor OS is a focused desktop workspace created by Isaac Hughley. It includes
the Anchor Hub, browser, media, games, Calculator, and Arc AI,
an independent AI assistant powered through a server-side Groq connection.

## Run locally

```sh
npm start
```

Set `GROQ_API_KEY` in the server environment before using Arc AI. Copy
`.env.example` as a reference and provide the key through your hosting
provider's environment-variable settings. Never put the key in browser code
or commit it to the repository.

## Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/viroda1/anchor)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/viroda1/anchor)

For every provider, add `GROQ_API_KEY` as an environment variable. Render runs
`npm start`; Netlify uses the root-level `netlify-ask-arc.js`; Vercel uses
`ask-arc.js`.

Better Movies Site

Fix Proxy

Fix folders and AI

More Features (brain-storm)
Creator: Isaac Hughley.
Credits: MercuryWorkshop/Scramjet, MercuryWorkshop/Wisp, Zinc, StaticSJ,
Axis, Axis-V2, and T9OS.
