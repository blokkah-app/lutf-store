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

Open the raw file on GitHub to copy it (**Raw** button → select all). Copying from the rendered page can drop text.

### Hero video
The repo is public, so the default video URLs (jsDelivr, pinned to a commit hash) work as they are, including the separate mobile cut. Nothing else is needed.

Optional: to host the video on Zid instead, add a **Video** section at the top of the home page, upload a video and turn Autoplay on. The script then uses that video for the hero and hides the original section.

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
10. **TikTok feed.** "LUTF على تيك توك" with a follow button and a swipeable rail of TikTok videos.
    - It uses TikTok's official player, which loads only as cards come into view.
    - Tap to play; swiping away pauses the video.
    - The videos are set in `tiktokVideos`. Leave the list empty for TikTok's automatic profile embed instead.
    - It shows on the home page after the stories; set `tiktokOnProduct: true` to add it to product pages.
11. **Mobile menu.** A floating rounded panel on the brand pattern, containing:
    - the promo pill;
    - **shop-by-category** photo tiles, read from the home page Categories section;
    - the store's links in large display type;
    - two "more" grids: **اكتشف** (new, best sellers, categories, cart) and **مساعدة** (track order, shipping, FAQ, account);
    - social buttons from Zid's contact settings, plus WhatsApp. Edit them with `menuMore` / `whatsapp`.
12. **Home sections.**
    - Categories become tall tiles with a frosted label and arrow.
    - The image banner becomes a rounded editorial card with white type.
    - Benefits become soft cards.
    - Testimonials become quote cards.
13. **Background pattern.** A very subtle blush blossom-and-dot pattern on the page and in the menu (`--lutf-pattern`; its strength is one site-wide setting, `--lutf-pattern-opacity: 0.22`).
14. **Product description polish.**
    - Scent notes written as a normal list under a heading containing "العطرية" become the notes carousel automatically.
    - "المميزات:" lists become a check-mark grid.
    - The short description becomes one clean sentence.
15. **Extras.**
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
- **Card artwork:** every note card uses the same background (`assets/img/lutf-note-bg.webp`, set in `notesBg`). The name and text sit inside its frosted frame.
- **Optional images:** insert images inside the block in the editor. They are matched to the cards in order (image 1 → card 1, and so on) and shown as a round ingredient photo inside the frame, above the name.
- The raw block is removed from the visible description automatically.

## Config

The defaults are at the top of `src/lutf.js`. You can also override them by placing this before the script:

```html
<script>window.LUTF_CONFIG = { heroTitle: "…", heroCtaUrl: "/categories/…" };</script>
```

The keys are `heroVideo`, `heroVideoMobile`, `heroPoster`, `heroPosterMobile`, `heroEyebrow`, `heroTitle`, `heroSubtitle`, `heroCtaText`, `heroCtaUrl`, `swipeLabel`, `notesFallbackTitle`, `notesBg`, `quoteLinkText`, `reviewsWord`, `reveal`, `storiesMatch`, `storiesTitle`, `storiesCtaText`, `storiesCtaUrl`, `storiesOnProduct` `stories` (a manual list: `[{image, video, tag, url}]`), `tiktokHandle`, `tiktokTitle`, `tiktokFollowText`, `tiktokOnHome`, `tiktokOnProduct`, `tiktokVideos` (`[{id, user, caption}]`), `whatsapp`, `menuPromo`, `menuCategoriesTitle`, `menuSocialTitle` and `menuMore` (`[{title, links:[{label, url, icon}]}]`; the icons are `sparkle star grid bag box truck help user gift chat`).

Suggested copy for every section is in [`docs/content-guide.md`](docs/content-guide.md).

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
