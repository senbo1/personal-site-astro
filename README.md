# Personal Site

## Why Astro ?

Because its a mostly static site except one thing which is the UI for the currently playing track from spotify.

## Is this fetching data client side with ACCESS TOKEN??!!

No, the data is fetched from Astro Endpoint('/spotifydata.json') which calls the spotify API on the server using access token if it is not expired otherwise will generate a new access token using the permanent token from environment.

On client side, No sensitive information is passed. The server sends only the data that is needed to render the UI for Spotify Component.

![Alt text](/public/data-fetching.png "Data Fetching")

## Tech Stack

- Astro
- React
- Typescript
- TailwindCSS
- Bun

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

