# 📘 hover-effect-symbols

> A cursor-reactive grid overlay that reveals animated symbol clusters on top of an image as you move your mouse.

---

## 🖼 Preview

![App Preview](media/hover-effect-symbols.gif)

---

## ⚙️ Getting Started

These instructions will get your project running locally.

```bash
# 1. Clone the repo
git clone https://github.com/suzubu/hover-effect-symbols.git

# 2. Navigate into the project folder
cd hover-effect-symbols

# 3. Install dependencies
npm install

# 4. Run the dev server
npm run dev
```

> Built with:
> - Vanilla HTML / CSS / JS
> - [Vite](https://vitejs.dev/)
> - [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (Google Fonts)

---

## ✨ Features

- 🖱 Mouse-tracking grid overlay rendered dynamically over an image
- 🔲 Randomised symbol clusters activate on hover using proximity detection
- 🔀 Per-block symbol scrambling at configurable intervals
- ⏱ Blocks auto-deactivate after a set lifetime via `requestAnimationFrame`
- ⚙️ Fully configurable via a single `config` object (symbols, block size, cluster size, timing, etc.)

---

## 💡 Dev Notes

- The grid is built entirely in JS — no markup in the HTML, blocks are injected dynamically on `DOMContentLoaded`
- `detectionRadius` controls how close the cursor needs to be before triggering activation; tweak this for tighter or looser feel
- `emptyRatio` and `scrambleRatio` add visual noise — some blocks are blank, others scramble continuously while active
- Cluster spreading uses adjacent grid neighbours (dx/dy ≤ 1), so clusters feel organic rather than radial
- The `updateHighlights` loop runs continuously via rAF; blocks clean themselves up once their `highlightEndTime` has passed

---

## 📚 Inspiration / Credits

- This was inspired by/sourced from Codegrid!!❤️
- Inspired by symbol/glitch hover effects seen in editorial and portfolio sites
- Typography: [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)

---

## 🧪 Known Issues

- 🔍 Grid is fixed to the size of `.hover-img` at load time — no resize observer, so resizing the window may misalign blocks
- ❌ Pointer events are disabled on the overlay (`pointer-events: none`), which means the mousemove listener is on the image wrapper — verify behaviour on touch devices

---

## 🔭 Roadmap / TODO

- [ ] Add resize observer to rebuild grid on window resize
- [ ] Support multiple `.hover-img` instances on one page (already scaffolded with `querySelectorAll`)
- [ ] Explore touch/pointer event support for mobile
- [ ] Config option for colour themes per instance

---

## 📂 Folder Structure

```bash
hover-effect-symbols/
├── index.html
├── style.css
├── script.js
├── media/
│   └── preview.gif
│   └── img.jpg
└── README.md
```

---

## 🙋‍♀️ Author

Made with ☕ + 🎧 by [suzubu](https://github.com/suzubu)
