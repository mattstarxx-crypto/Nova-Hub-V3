# 🎮 Nova Hub — Unblocked Games

A sci-fi themed unblocked games hub with search, categories, and in-page iframe player.

## File Structure

```
novahub/
├── index.html   ← The webpage (structure only)
├── style.css    ← All styling and animations
├── main.js      ← All JavaScript / interactivity
├── games.json   ← Game data (only file you need to edit)
└── README.md    ← This file
```

## How to Add a Game

Open `games.json` and add entries to the array.
Each game needs a `src` — the direct URL to the game's HTML file (the iframe embed URL).

```json
[
  {
    "id": "basket-hoop",
    "title": "Basket Hoop",
    "desc": "Shoot hoops!",
    "icon": "🏀",
    "badge": "NEW",
    "src": "https://d11jzht7mj96rr.cloudfront.net/games/2024/construct/311/basket-hoop/index-gg.html",
    "category": "sports"
  },
  {
    "id": "my-other-game",
    "title": "My Other Game",
    "desc": "Short description here",
    "icon": "🎮",
    "badge": "",
    "src": "https://example.com/games/mygame/index.html",
    "category": "arcade"
  }
]
```

### Fields

| Field      | Required | Description |
|------------|----------|-------------|
| `id`       | ✅       | Unique ID, no spaces (e.g. `"my-game"`) |
| `title`    | ✅       | Display name |
| `desc`     | ✅       | Short description |
| `icon`     | ✅       | Emoji icon |
| `src`      | ✅       | Direct iframe URL to the game |
| `badge`    | ✅       | `"HOT"`, `"NEW"`, `"FAST"`, or `""` for none |
| `category` | ✅       | Any word — `"arcade"`, `"puzzle"`, `"shooter"`, etc. |

## How to Find the `src` URL

Right-click any embedded game on a site → **Inspect** → find the `<iframe>` tag → copy its `src` attribute. That's your `src` value.

## How to Host (GitHub Pages)

1. Upload all 5 files to a GitHub repo
2. Go to **Settings → Pages → Branch: main → Save**
3. Live at `https://yourusername.github.io/reponame`
