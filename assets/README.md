# Assets

## Icons

`icon.svg` — 1024×1024 placeholder Pip-on-cream app icon. **Source of truth for the icon**: edit this file, then re-export the PNGs.

### Required PNGs (not yet generated)

| Path | Size | Used by |
|---|---|---|
| `assets/icon.png` | 1024×1024 | iOS app icon (Apple auto-rounds to its corner mask) |
| `assets/icon-ios.png` | 1024×1024 | optional, overrides `icon` for iOS only |
| `assets/icon-fg.png` | 1024×1024 (66% safe area) | Android adaptive icon foreground layer |
| `assets/splash.png` | 1284×1284 inside 1284×2778 cream canvas | iPhone 14 Pro Max splash |

### How to convert

```bash
# Inkscape (Windows/Mac/Linux)
inkscape -w 1024 -h 1024 assets/icon.svg -o assets/icon.png

# rsvg-convert (Mac via brew, Linux via libsvg2)
rsvg-convert -w 1024 -h 1024 assets/icon.svg -o assets/icon.png

# Figma — open the SVG, frame to 1024×1024, Export → PNG @ 1x

# Online — https://cloudconvert.com/svg-to-png (paste contents, set 1024)
```

### Wire into `app.json`

After PNGs exist:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "ios": {
      "icon": "./assets/icon-ios.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-fg.png",
        "backgroundColor": "#F2EAD8"
      }
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#FAF6F0"
        }
      ]
    ]
  }
}
```

The `expo-splash-screen` plugin entry is already in `app.json` minus `image`; just add the field once `splash.png` exists.

## Why a placeholder

A real designer should replace this. The placeholder is the same Pip rendered by `components/Mascot.tsx` (mood = happy, idle pose) so the icon and the live mascot share visual DNA. It will read at small sizes — silhouette-first, cheek + leaf accents, no fine detail.
