# LUTF × Zid — custom store skin

A custom CSS + JS skin for the LUTF store on Zid (**growth-theme**, Growth plan). It uses the feel of rhodeskin.com but LUTF's own colours.

## Install (paste the **dist** files, not `src`)

| File | Paste into |
|---|---|
| `dist/lutf.min.css` | Zid dashboard › Store design › **Custom CSS**. Select all, delete, paste. |
| `dist/lutf.min.js` | Zid dashboard › Store design › **Custom JS**. Select all, delete, paste. |

The `dist` files are minified, comment-free and ASCII-only (Arabic text is `\u`-escaped), so the dashboard editor can't mangle them.

**Check that the paste worked:**
- Open the store, view the page source, and open the `custom-scripts.js` and `styles.css` links under `static.zid.store/static/…`.
- They should be about **16 KB** (JS) and **20 KB** (CSS).
- Earlier saves were cut off at 92 bytes and 274 bytes, which is why nothing was showing.

Open the raw file on GitHub to copy it (**Raw** button → select all). Copying from the rendered page can drop text.

### Hero video
The default video URL is served by jsDelivr from this repo, and **jsDelivr only serves public repos**. While the repo is private the request returns 404. Pick one option:

- **A (recommended): Zid hosts it.** Add a **Video** section at the top of the home page, upload `assets/video/lutf-hero.mp4`, and turn Autoplay on. The script uses that video for the hero, hides the original section and stops it downloading twice.
- **B: make this repo public.** The default URLs then work immediately, including the separate mobile cut. The code is already public on the storefront anyway.

If the video can't load, the hero removes itself and the page falls back to the normal layout.

Build after editing `src/`: `./scripts/build.sh`, which needs Node.

---

## What it does

1. **Shipping note.** The theme's announcement bar becomes a rounded, floating greige pill. It fades out once you scroll.
2. **Video hero (home).** A full-height rounded video card sits at the top of the home page.
   - The nav sits *inside* the hero: it is transparent with white ink at the top of the page.
   - There is a pause button (needed for accessibility), and the video pauses when it is off-screen.
   - Mobile gets its own 3:4 cut of the video (0.4 MB). Desktop gets 1280×720 (0.8 MB).
3. **Smart nav.** It is a floating rounded bar on every page.
   - Scrolling down hides it; scrolling up brings it back.
   - Over the hero it shows the transparent version; elsewhere it shows the frosted greige version.
   - It always shows while the menu or search is open.
4. **Product carousel cards.** The cards are large, the photo fills the whole card, and the name, price, rating and CTA sit in a frosted panel at the bottom.
   - On mobile you can see the edge of the next card.
   - A "اسحب" (swipe) bubble shows until the visitor first swipes.
   - The progress line and the arrows are restyled.
5. **Sticky add-to-cart (product page).** A small, rounded, frosted-glass pill floating above the bottom edge.
6. **Breadcrumb.** Hidden on every page.
7. **Scent-notes carousel (product page).** Built from a block you write in the product description (see below).
8. **Client stories, "you + lutf".**
   - A greige panel with a rail of customer photo or video cards, `@handle` tags, a progress line, arrows and a "تابعنا على السوشيال" button.
   - **Home:** add a native **Gallery** section titled `you + lutf` or `قصص عملائنا`. Each image is a story; *image title* is the `@handle`; *primary button URL* is a link, or an `.mp4` URL to make it a video story.
   - **Product pages:** the same stories appear automatically, cached from the home page for 12 h.
   - The button links to the first Instagram/TikTok link in the footer, or to `storiesCtaUrl`.
9. **Ratings.**
   - A rating chip under the title (`5.0 ★★★★★ (12 تقييم)`).
   - The reviews summary becomes a card.
   - A large quote section shows the store's best real review.
10. **Extras.**
   - Brand colours and fonts applied site-wide.
   - Pill-shaped buttons and inputs.
   - Rounded image banners and footer.
   - Sections fade in as you scroll.
   - Animation is turned off for visitors who ask for reduced motion.

## Brand system

| Token | Value | Use |
|---|---|---|
| cream | `#FAF7F4` | page background |
| greige | `#F1ECE7` | surfaces: nav, pill, cards |
| blush | `#E9B8B2` | accent, from the Bloom bottle |
| rose | `#C98A84` | focus and highlights |
| ink | `#2E2623` | text, primary buttons, stars |

- **Headings and wordmark:** *Alexandria*, loaded by the CSS.
- **Body text:** *IBM Plex Sans Arabic*, which the theme already uses.

## Zid settings to change

1. **Header › Announcement bar.** Turn it on, choose Pages = All, and type the text, e.g. `شحن مجاني للطلبات فوق 200 ر.س`.
2. **Home page sections.** Remove the empty test sections (video, testimonials, benefits, CTA) or fill them in.
3. **Optional: use your own video.** Add a **Video** section on the home page, upload the video and turn on Autoplay. The script then uses that video for the hero and hides the original section.
4. **Product carousels.** Use the *Products* section in **carousel** mode. That mode gets the big-card style; grid mode keeps the normal style.

## Scent notes: how to write them in the product description

Put this anywhere in the product description:

```
[notes] ناعمة ورقيقة
النفحات العليا | فراولة، براعم الكشمش، فاوانيا وردية
النفحات الوسطى | ورد، ياسمين
النفحات الأساسية | مسك أبيض
[/notes]
```

- The first line is the section title.
- Each following line is one card: `name | text`. A colon `:` also works instead of `|`.
- **Optional images:** insert images inside the block in the editor. They are matched to the cards in order (image 1 → card 1, and so on). Cards without an image get a soft blush gradient.
- The raw block is removed from the visible description automatically.

## Config

The defaults are at the top of `src/lutf.js`. You can also override them by placing this before the script:

```html
<script>window.LUTF_CONFIG = { heroTitle: "…", heroCtaUrl: "/categories/…" };</script>
```

The keys are `heroVideo`, `heroVideoMobile`, `heroPoster`, `heroPosterMobile`, `heroEyebrow`, `heroTitle`, `heroSubtitle`, `heroCtaText`, `heroCtaUrl`, `swipeLabel`, `notesFallbackTitle`, `quoteLinkText`, `reviewsWord`, `reveal`, `storiesMatch`, `storiesTitle`, `storiesCtaText`, `storiesCtaUrl`, `storiesOnProduct` and `stories` (a manual list: `[{image, video, tag, url}]`).

Assets still needed, and the proposed home page layout: [`docs/assets-and-home-structure.md`](docs/assets-and-home-structure.md).

## Local preview

The preview downloads the live store pages and injects the skin. It also simulates the shipping bar and a sample notes block.

```bash
python3 scripts/build-preview.py https://fn8d6o.zid.store
```

```bash
python3 -m http.server 8080 --directory preview
```

Then open `http://localhost:8080/` and `http://localhost:8080/product.html`. The cart and account API calls fail on localhost; that is expected.

## Releasing a change to the video

jsDelivr caches `@main`, so asset URLs are pinned to a commit hash. If you change the files in `assets/video/`:

1. Commit the new files.
2. Put that commit's hash in the `CDN` constant in `src/lutf.js`, then run `./scripts/build.sh`.
