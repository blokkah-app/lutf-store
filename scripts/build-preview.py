#!/usr/bin/env python3
"""Build a local preview of the live Zid store with the LUTF skin injected.

Usage:
    python3 scripts/build-preview.py [store_url] [product_slug]
    python3 -m http.server 8080 --directory preview
    open http://localhost:8080/index.html  (home) and /product.html

The preview:
  * downloads the live home + one product page,
  * removes the store's current custom stylesheet and injects src/lutf.css + src/lutf.js,
  * simulates the native announcement bar (free-shipping text) and a sample
    [notes] block in the product description, so every feature can be checked
    before the code is pasted into Zid.
"""
import pathlib
import re
import shutil
import sys
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "preview"
STORE = (sys.argv[1] if len(sys.argv) > 1 else "https://fn8d6o.zid.store").rstrip("/")
SLUG = sys.argv[2] if len(sys.argv) > 2 else "بكج-4-حبات-lutf-care"

UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"

ANNOUNCEMENT = (
    '<div class="bg-primary text-primary-foreground overflow-hidden" data-announcement-bar>'
    '<div class="theme-container flex items-center justify-center p-2">'
    '<p class="text-sm text-center">شحن مجاني للطلبات فوق 200 ر.س</p></div></div>'
)

SAMPLE_NOTES = (
    "<p>[notes] ناعمة ورقيقة</p>"
    "<p>النفحات العليا | فراولة، براعم الكشمش، فاوانيا وردية</p>"
    "<p>النفحات الوسطى | ورد، ياسمين، زهر البرتقال</p>"
    "<p>النفحات الأساسية | مسك أبيض، فانيليا ناعمة</p>"
    "<p>[/notes]</p>"
)


def sample_gallery(html: str) -> str:
    """A native-looking Gallery section titled "you + lutf" (preview only),
    using product photos already on the page as stand-ins for UGC."""
    imgs = []
    for m in re.finditer(r'src="(https://media\.zid\.store/cdn-cgi/image/w=600[^"]+)"', html):
        if m.group(1) not in imgs:
            imgs.append(m.group(1))
    tags = ["@sara.k", "@noura", "@lama.beauty", "@hind", "@reem"]
    items = ""
    for i, src in enumerate(imgs[:5]):
        href = "video/lutf-hero-mobile.mp4" if i == 1 else "https://www.instagram.com/"
        items += (
            '<div class="group relative overflow-hidden rounded"><div class="media-wrap">'
            f'<img class="h-full w-full object-cover" src="{src}" alt=""></div>'
            '<div class="absolute inset-0 flex flex-col items-center justify-center space-y-6">'
            f'<h3 class="text-foreground text-lg font-semibold text-center">{tags[i]}</h3>'
            f'<div class="flex flex-wrap items-center justify-center gap-4"><a href="{href}" class="btn btn-filled btn-lg">عرض</a></div>'
            "</div></div>"
        )
    return (
        '<section section-id="preview-gallery" class="section-gallery bg-background px-4 py-6 md:p-16">'
        '<div class="theme-container"><h2 class="text-foreground text-xl font-semibold tracking-tight mb-6">you + lutf</h2>'
        f'<div class="grid grid-cols-2 gap-4">{items}</div></div></section>'
    )


def fetch(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    url = urllib.parse.urlunsplit(parts._replace(path=urllib.parse.quote(parts.path)))
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8")


def inject(html: str, page: str) -> str:
    # drop the store's existing custom stylesheet (static.zid.store/static/<uuid>/styles.css)
    html = re.sub(r'<link[^>]+static\.zid\.store/static/[^"]+/styles\.css[^>]*>', "", html)
    # drop the store's current custom JS too (we inject ours below)
    html = re.sub(r"<script[^>]+static\.zid\.store/static/[^'\"]+/custom-scripts\.js[^>]*></script>", "", html)
    # make relative store links absolute so the preview keeps working assets
    html = html.replace('href="/', f'href="{STORE}/').replace('src="/', f'src="{STORE}/')
    html = html.replace("</head>", '<link rel="stylesheet" href="lutf.css"></head>', 1)
    config = (
        "<script>window.LUTF_CONFIG={heroVideo:'video/lutf-hero.mp4',"
        "heroVideoMobile:'video/lutf-hero-mobile.mp4',heroPoster:'video/lutf-hero-poster.jpg',"
        "heroPosterMobile:'video/lutf-hero-poster-mobile.jpg'};</script>"
    )
    html = html.replace("</body>", config + '<script src="lutf.js"></script></body>', 1)
    # simulate the announcement bar exactly as growth-theme renders it
    if "data-announcement-bar" not in html:
        html = html.replace('<div class="sticky top-0 z-50">', '<div class="sticky top-0 z-50">' + ANNOUNCEMENT, 1)
    if page == "home" and "section-gallery" not in html:
        html = html.replace("</main>", sample_gallery(html) + "</main>", 1)
    if page == "product" and "[notes" not in html:
        html = re.sub(
            r'(<div class="text-foreground prose prose-sm max-w-none">)',
            r"\1" + SAMPLE_NOTES,
            html,
            count=1,
        )
    return html


def main() -> None:
    OUT.mkdir(exist_ok=True)
    (OUT / "video").mkdir(exist_ok=True)
    for f in (ROOT / "assets" / "video").iterdir():
        shutil.copy(f, OUT / "video" / f.name)
    shutil.copy(ROOT / "dist" / "lutf.min.css", OUT / "lutf.css")
    shutil.copy(ROOT / "dist" / "lutf.min.js", OUT / "lutf.js")
    (OUT / "index.html").write_text(inject(fetch(STORE + "/"), "home"), encoding="utf-8")
    (OUT / "product.html").write_text(
        inject(fetch(f"{STORE}/products/{SLUG}"), "product"), encoding="utf-8"
    )
    print("preview ready in", OUT)


if __name__ == "__main__":
    main()
