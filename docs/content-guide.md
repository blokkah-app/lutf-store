# LUTF: suggested content for every section

The copy draws on what the brand already says: the product descriptions and the TikTok bio, *"بكل فخر صناعة سعودية · يطهر · يرطب · ويترك يدك برائحة جميلة"*. Replace anything marked **[ ]**.

## Home page, in the order it currently appears

| # | Section (Zid) | Field | Suggested content |
|---|---|---|---|
| 0 | Header › Announcement bar | Text | `شحن مجاني للطلبات فوق [200] ر.س`. Alternative for later: `جديد: مجموعة الاكتشاف · 3 روائح في علبة واحدة` |
| 1 | Hero video (automatic) | in `lutf.js` config | Eyebrow `LUTF Bloom` · Title `لطفٌ في كل لمسة.` · Subtitle `يطهّر، يرطّب، ويترك يدك برائحة جميلة.` · Button `تسوّق الآن` → `/products/` |
| 2 | Products (carousel) #1 | Title | `الأكثر مبيعاً`. Products: Bloom, Mist, Clear, then the 3- and 4-piece packs |
| 3 | Categories | Title | `تسوّق حسب الفئة` (the tiles are ready) |
| 4 | Hero (image banner) | Eyebrow | `مجموعة الاكتشاف` |
|   |  | Title | `ثلاث روائح. اختر لطفك.` |
|   |  | Text | `جرّب Bloom وMist وClear في مجموعة واحدة، وخلّ يدك تختار.` |
|   |  | Button | `اكتشف المجموعة` → `/products/مجموعة-الاكتشاف` |
| 5 | Benefits (4 items) | 1 | **70٪ كحول**: `يقضي على معظم الجراثيم والبكتيريا` |
|   |  | 2 | **يرطّب ولا يجفّف**: `تركيبة ترطّب اليدين وتحميها من الجفاف` |
|   |  | 3 | **بحجم الجيب**: `30 مل بحجم البطاقة، للحقيبة والجيب` |
|   |  | 4 | **صناعة سعودية**: `بكل فخر، صُنع في السعودية 🇸🇦` |
|   |  | Icons | 4 simple line icons, SVG or PNG on a transparent background (drop, hand, card, palm) |
| 6 | Products (carousel) #2 | Title | `بكجات وهدايا`. Products: packs of 3 / 4 / 5, Discovery set, Bedazzling kit |
| 7 | Gallery (stories) | Title | `you + lutf` (or `قصص عملائنا`) |
|   |  | Per image | Image = customer photo (4:5) · Image title = `@handle` · Primary button URL = their post, or an `.mp4` link for a video story |
| 7b | TikTok feed (automatic) | in `lutf.js` config | Title `LUTF على تيك توك` · button `تابعنا` · 8 curated videos (see below) |
| 8 | Testimonials | Title | `قالوا عن لطف` |
|   |  | Items | 3–6 **real** customer quotes, taken with permission from reviews, TikTok comments or DMs. Keep each under about 120 characters. |
| 9 | Carousel (slideshow, last) | Suggestion | Replace it with a **Call to action**: title `محتار أي رائحة تناسبك؟` · text `ابدأ بمجموعة الاكتشاف.` · button `جرّب الآن` |

## Product pages

| Element | How to write it |
|---|---|
| First paragraph of the description | One or two sentences about the scent and feeling. It is also used as the short description under the price. |
| Scent notes | A bold heading containing **العطرية** (e.g. `التركيبة العطرية:`), followed by a bullet list where every item starts with a bold label: `المقدمة:` / `القلب:` / `القاعدة:`. This becomes the notes carousel automatically. Bloom and Mist already follow this format. |
| Note images (optional) | To add photos to the notes cards, use the `[notes] … [/notes]` block from the README instead and insert the images inside it. |
| Features | A bold heading `المميزات:` followed by a bullet list. It becomes the check-mark grid. |
| Reviews | Ask the first customers to rate. When the product has a review with a comment, the big quote block appears automatically. |

## Mobile menu

These are all automatic. Edit them in the `lutf.js` config.

- **Promo pill:** the announcement text (or `menuPromo`).
- **Shop by category:** the Categories section from the home page.
- **اكتشف:** New arrivals · Best sellers · All categories · Cart.
- **مساعدة:** Track your order · Shipping & payment · FAQ · My account.
- **تابعنا:** every social account filled in under Zid › Settings › Contact (only TikTok today), plus WhatsApp if `whatsapp` is set.

## TikTok feed: the curated videos

The 8 default videos come from @lutfcare's reposts on TikTok: the shopping-spree, matcha-morning, contest and National Day videos, plus one Lutf post. They are listed in `tiktokVideos` (id, @user, short caption).

- **To change them:** copy a video's link (`tiktok.com/@user/video/<id>`) and paste the id.
- **For a fully automatic feed:** set `tiktokVideos: []`. The section then shows TikTok's official profile embed with the latest posts, which is less on-brand visually.
