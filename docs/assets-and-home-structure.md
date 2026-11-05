# LUTF: needed assets and the proposed home page

## 1. Assets checklist

✅ = we already have it · ⭐ = has the biggest visual impact

| # | Asset | Spec | Used in | Status |
|---|---|---|---|---|
| 1 | Hero video | MP4, 8–12 s loop, muted, ≤ 1 MB | Home hero | ✅ (`assets/video/`) |
| 2 | Vertical hero cut (optional) | 9:16, 1080×1920, shot or framed for mobile | Mobile hero (today we crop the 16:9 video) | optional |
| 3 | ⭐ Product card photos | 4:5 portrait, 1200×1500 px, product on a soft coloured set. One colour per scent: Bloom = blush, Mist = lilac, Clear = cloud grey, etc. | Big carousel cards | needed: current photos are white-background packshots |
| 4 | Lifestyle product photos | 4:5, 1200×1500, a hand / bag / desk using the product | 2nd–3rd image in the product gallery | needed |
| 5 | ⭐ Scent-notes images | 3 per scent (top / heart / base), 1080×1240, ingredient close-ups (petals, citrus, musk…) | Notes carousel on product pages | needed |
| 6 | Scent-notes text | 3 lines per scent: `name \| ingredients` | Notes carousel | needed |
| 7 | ⭐ Customer stories (UGC) | 6–10 photos at 4:5, 1080×1350, plus optional short muted MP4s (≤ 2 MB, 5–10 s). Get each customer's handle and permission. | "you + lutf" section (home + product pages) | needed |
| 8 | Customer reviews with written comments | real text reviews (at least 3–5 per hero product) | Big quote block + rating chip | needed: the store has only 1 rating and it has no comment |
| 9 | Logo | SVG wordmark, dark and white versions | Header (today it is the text "Lutf") | needed |
| 10 | Favicon / app icon | 512×512 PNG | Browser tab | needed |
| 11 | Collection banners | Desktop 2400×1200, mobile 1080×1350. One each for Packs, Sanitizers, Discovery set, seasonal offers. | Image banners / categories | needed |
| 12 | Benefit icons | 4 line icons (SVG), e.g. 70 % alcohol · moisturising · pocket size · long-lasting scent | Benefits strip | needed |
| 13 | Social links | Instagram / TikTok URLs in Zid's footer settings | "تابعنا على السوشيال" button | needed |
| 14 | Free-shipping threshold | the exact amount | Announcement pill | needed |

Photo direction for 3, 5 and 7: soft daylight, cream/greige sets, one accent colour per scent, plenty of empty space. Avoid busy patterns behind the bottle.

## 2. Proposed home page, top to bottom

Every block is a **native Zid section** placed in the theme editor. The custom JS/CSS restyles it automatically.

| # | Zid section | Settings | What visitors see |
|---|---|---|---|
| 0 | Header › Announcement bar | Display on, Pages = All, text: `شحن مجاني للطلبات فوق ___ ر.س` | Rounded greige pill above the nav |
| 1 | **Video** | Upload the hero video, Autoplay on | Full-height rounded video hero with the transparent nav, headline and "تسوّق الآن" |
| 2 | **Products** (carousel) | Title "الأكثر مبيعاً", 4–8 products | Big immersive cards + swipe bubble |
| 3 | **Categories** | Packs · Sanitizers · Discovery set | Rounded collection tiles |
| 4 | **Hero** (image banner) | One scent story, e.g. *Bloom*, with a CTA | Rounded full-width banner |
| 5 | **Benefits** | 4 items with icons | Greige strip with the 4 product promises |
| 6 | **Products** (carousel) | Title "بكجات وهدايا" | Big cards |
| 7 | **Gallery** | **Title must be "you + lutf" or "قصص عملائنا"**. Per image: image = customer photo, image title = `@handle`, primary button URL = their post link, **or an .mp4 URL to show a video story** | "you + lutf" stories rail with progress line, arrows and the social button. Product pages reuse it automatically. |
| 8 | **Testimonials** | 3–6 written reviews | Text testimonial rail |
| 9 | **Call to action** | "اكتشف مجموعة الاكتشاف", link to the discovery set | Closing invitation |

Remove the empty test sections once the real ones are placed.

### Product page, automatic order

The theme renders the gallery, details and add-to-cart. The custom JS then adds, in this order:

1. Rating chip under the title
2. **Scent-notes carousel**, from the `[notes]` block in the description
3. **Big review quote**, from the best real review
4. **you + lutf stories**, the same items as the home Gallery
5. The theme's reviews and related products, plus the floating glass add-to-cart pill

### Still to style once the sections have content

Categories, Benefits, Testimonials and Call-to-action currently get only the global polish (colours, pill buttons, rounded corners). Once they are filled in Zid, send the store link again and they can get a dedicated design pass, because their markup only renders when they have content.
