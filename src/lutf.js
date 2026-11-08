/* ==========================================================================
   LUTF × Zid (growth-theme) — behaviour layer
   SOURCE file. Paste dist/lutf.min.js into Zid (Custom JS), not this one.
   Build: scripts/build.sh. No dependencies; safe in <head> or <body>.
   ========================================================================== */
(function () {
  "use strict";

  var CDN = "https://cdn.jsdelivr.net/gh/blokkah-app/lutf-store@6c91a73f2d7cf113348d1607a564be2a15e0008b/assets/video/";

  /* ------------------------------------------------------------------
     CONFIG — edit here. Anything set in window.LUTF_CONFIG before this
     script runs overrides these defaults.
     ------------------------------------------------------------------ */
  var CFG = Object.assign(
    {
      // Hero video. If you add a native "Video" section on the home page in
      // Zid and upload a video there, that video is used instead of these.
      heroVideo: CDN + "lutf-hero.mp4",
      heroVideoMobile: CDN + "lutf-hero-mobile.mp4",
      heroPoster: CDN + "lutf-hero-poster.jpg",
      heroPosterMobile: CDN + "lutf-hero-poster-mobile.jpg",
      heroEyebrow: "LUTF Bloom",
      heroTitle: "لطفٌ في كل لمسة.",
      heroSubtitle: "يطهّر، يرطّب، ويترك يدك برائحة جميلة.",
      heroCtaText: "تسوّق الآن",
      heroCtaUrl: "/products/",
      swipeLabel: "اسحب",
      notesFallbackTitle: "النفحات العطرية",
      quoteLinkText: "عرض كل التقييمات",
      reviewsWord: "تقييم",
      reveal: true,

      // Client stories ("you + lutf"). Fed by a native Zid *Gallery* section
      // whose title matches storiesMatch (e.g. "قصص عملائنا"): each gallery
      // image becomes a story card, "image title" becomes the tag (@name),
      // "primary button URL" becomes the link — or a video if it ends in .mp4.
      // Product pages reuse the same stories (cached from the home page).
      storiesMatch: "قصص|stories|you \\+|lutf \\+",
      storiesTitle: "", // empty = keep the gallery title
      storiesCtaText: "تابعنا على السوشيال",
      storiesCtaUrl: "", // empty = first Instagram/TikTok link found in the footer
      storiesOnProduct: true,
      stories: [], // optional manual list: [{ image, video, tag, url }]

      // TikTok feed. Each entry is one TikTok video (id from its URL:
      // tiktok.com/@user/video/<id>). Leave the list empty to show TikTok's
      // official profile embed (latest videos, automatic) instead.
      tiktokHandle: "lutfcare",
      tiktokTitle: "LUTF على تيك توك",
      tiktokFollowText: "تابعنا",
      tiktokOnHome: true,
      tiktokOnProduct: false,
      tiktokVideos: [
        { id: "7699094819057995015", user: "mahatrying", caption: "جولة تسوّق مع لطف" },
        { id: "7700902756088941832", user: "sara.moh26", caption: "صباح الماتشا ولطف" },
        { id: "7702146919203638548", user: "wala2.k", caption: "مشاركة في مسابقة لُطف" },
        { id: "7685040757635304712", user: "mahatrying", caption: "لحظات العائلة" },
        { id: "7700919688485768466", user: "zaqwx6", caption: "رسمة بثيم رمضاني" },
        { id: "7689477769964637446", user: "hanoufzone", caption: "فعالية اليوم الوطني" },
        { id: "7700281964166745350", user: "ada_m.11", caption: "لمسابقة لطف: رائحة الورد" },
        { id: "7705508985151016193", user: "lutfcare", caption: "من لطف" },
      ],

      // Mobile menu extras. Promo = the announcement text when left empty.
      whatsapp: "", // international format without +, e.g. "9665XXXXXXXX"
      menuPromo: "",
      menuCategoriesTitle: "تسوّق حسب الفئة",
      menuSocialTitle: "تابعنا",
      menuMore: [
        {
          title: "اكتشف",
          links: [
            { label: "وصل حديثاً", url: "/products?sort_by=created_at&order=desc", icon: "sparkle" },
            { label: "الأكثر مبيعاً", url: "/products?sort_by=popularity_order&order=asc", icon: "star" },
            { label: "كل التصنيفات", url: "/categories/", icon: "grid" },
            { label: "السلة", url: "/cart", icon: "bag" },
          ],
        },
        {
          title: "مساعدة",
          links: [
            { label: "تتبّع طلبك", url: "/account/orders", icon: "box" },
            { label: "الشحن والدفع", url: "/shipping-and-payment", icon: "truck" },
            { label: "الأسئلة الشائعة", url: "/faqs", icon: "help" },
            { label: "حسابي", url: "/account", icon: "user" },
          ],
        },
      ],
    },
    window.LUTF_CONFIG || {}
  );

  var doc = document;
  var body;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = function () {
    return window.matchMedia("(max-width: 767.98px)").matches;
  };
  var $ = function (sel, root) {
    return (root || doc).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  };
  var el = function (tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var STAR =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 1.2l2.06 4.27 4.69.6-3.44 3.25.86 4.65L8 11.72l-4.17 2.25.86-4.65L1.25 6.07l4.69-.6L8 1.2z"/></svg>';
  var ICONS = {
    sparkle: '<path d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6L10 2.5zM15.5 13l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z"/>',
    star: '<path d="M10 2.8l2.2 4.6 5 .6-3.7 3.5.9 5-4.4-2.4-4.4 2.4.9-5L2.8 8l5-.6L10 2.8z"/>',
    grid: '<rect x="3" y="3" width="5.5" height="5.5" rx="1.5"/><rect x="11.5" y="3" width="5.5" height="5.5" rx="1.5"/><rect x="3" y="11.5" width="5.5" height="5.5" rx="1.5"/><rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.5"/>',
    bag: '<path d="M4.5 6.5h11l-.8 10H5.3l-.8-10z"/><path d="M7.5 6.5V5.5a2.5 2.5 0 015 0v1"/>',
    box: '<path d="M3 6.5L10 3l7 3.5v7L10 17l-7-3.5v-7z"/><path d="M3 6.5L10 10l7-3.5M10 10v7"/>',
    truck: '<path d="M2.5 5.5h9v8h-9zM11.5 8.5h3l3 3v2h-6"/><circle cx="6" cy="14.5" r="1.5"/><circle cx="14.5" cy="14.5" r="1.5"/>',
    help: '<circle cx="10" cy="10" r="7.5"/><path d="M7.8 7.8a2.3 2.3 0 114 1.6c-.8.6-1.8 1-1.8 2.3M10 14.2v.1"/>',
    user: '<circle cx="10" cy="7" r="3.2"/><path d="M3.8 17c.8-3 3.2-4.6 6.2-4.6s5.4 1.6 6.2 4.6"/>',
    gift: '<rect x="3" y="7.5" width="14" height="3" rx="1"/><path d="M4.5 10.5v6.5h11v-6.5M10 7.5V17M10 7.5S8.8 3.5 6.8 4.2C5.3 4.8 6.6 7.5 10 7.5zM10 7.5s1.2-4 3.2-3.3c1.5.6.2 3.3-3.2 3.3z"/>',
    truckFree: '<path d="M2.5 5.5h9v8h-9zM11.5 8.5h3l3 3v2h-6"/><circle cx="6" cy="14.5" r="1.5"/><circle cx="14.5" cy="14.5" r="1.5"/>',
    chat: '<path d="M10 3a7 7 0 00-6.1 10.4L3 17l3.7-.9A7 7 0 1010 3z"/>',
  };
  var icon = function (name) {
    return (
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.sparkle) +
      "</svg>"
    );
  };
  var BRAND = {
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 00-.8-.1 5.8 5.8 0 105.8 5.8V9.1a7.4 7.4 0 004.3 1.4V7.4a4.3 4.3 0 01-3.3-1.6z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5c2.9 0 4.8 2.2 4.8 4.9v2.1l1.7-.4c.6 0 .8.7.3 1l-1.8 1c.6 1.6 1.8 2.8 3.4 3.3-.4.8-1.5 1-2.6 1.2-.2.6-.2 1.2-.7 1.2-.8 0-1.6-.4-2.7 0-1 .4-1.6 1.4-2.4 1.4s-1.4-1-2.4-1.4c-1.1-.4-1.9 0-2.7 0-.5 0-.5-.6-.7-1.2-1.1-.2-2.2-.4-2.6-1.2 1.6-.5 2.8-1.7 3.4-3.3l-1.8-1c-.5-.3-.3-1 .3-1l1.7.4V8.4c0-2.7 1.9-4.9 4.8-4.9z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 00-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1012 3.5z"/><path d="M9 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .2 0 .5-.4.7-.5.3-1.4.6-2.6.1A9 9 0 018.7 11c-.5-1.2-.2-2 .3-2.4z" fill="currentColor" stroke="none"/></svg>',
  };
  var ARROW =
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ==================================================================
     1. HEADER: fixed floating bar, hide on scroll-down / show on scroll-up,
        transparent "over hero" state on the home page.
     ================================================================== */
  var wrap, header, ann, hero;
  var lastY = 0;
  var ticking = false;

  function measure() {
    if (!wrap) return;
    var scrolled = body.classList.contains("lutf-scrolled");
    // measure the natural (top-of-page) height so the offset never jumps
    if (scrolled) body.classList.remove("lutf-scrolled");
    var annH = ann ? ann.offsetHeight + parseFloat(getComputedStyle(ann).marginBottom || 0) : 0;
    var total = wrap.offsetHeight + 12;
    if (scrolled) body.classList.add("lutf-scrolled");
    doc.documentElement.style.setProperty("--lutf-ann-h", annH + 10 + "px");
    doc.documentElement.style.setProperty("--lutf-head-h", total + "px");
    syncHeaderH();
  }

  function syncHeaderH() {
    if (!wrap) return;
    // mobile drawer is positioned at top: var(--header-h)
    var r = wrap.getBoundingClientRect();
    doc.documentElement.style.setProperty("--header-h", Math.max(0, Math.round(r.bottom)) + "px");
  }

  function overlayOpen() {
    return !!$("#mobile-drawer[open], #search-dialog[open], dialog[open]");
  }

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var dy = y - lastY;
    var headH = header ? header.offsetHeight : 64;

    body.classList.toggle("lutf-scrolled", y > 8);

    if (overlayOpen() || y < headH) {
      wrap.classList.remove("lutf-header-hidden");
    } else if (dy > 6) {
      wrap.classList.add("lutf-header-hidden");
    } else if (dy < -6) {
      wrap.classList.remove("lutf-header-hidden");
    }

    if (hero) {
      var hb = overlayOpen() ? 0 : hero.getBoundingClientRect().bottom; // menu/search open: solid bar
      // switch to glass before the bar reaches the hero title/CTA area
      body.classList.toggle("lutf-on-hero", hb > headH + 240);
    }
    if (Math.abs(dy) > 0) lastY = y;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function initHeader() {
    header = $("body > div.sticky > header") || $("header");
    if (!header) return;
    wrap = header.parentElement;
    if (!wrap || wrap === body) return;
    wrap.classList.add("lutf-header-wrap");
    ann = $("[data-announcement-bar]", wrap);

    measure();
    lastY = window.scrollY || 0;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      measure();
      update();
    });
    wrap.addEventListener("transitionend", syncHeaderH);
    // re-evaluate the bar style whenever the menu or search opens/closes
    if ("MutationObserver" in window) {
      var mo = new MutationObserver(function () {
        update();
      });
      $$("#mobile-drawer, #search-dialog").forEach(function (d) {
        mo.observe(d, { attributes: true, attributeFilter: ["open"] });
      });
    }
    // keep the bar in view (and the drawer anchored) when the menu opens
    doc.addEventListener(
      "click",
      function (e) {
        if (e.target.closest && e.target.closest('[onclick*="mobile-drawer"], [data-search-trigger]')) {
          wrap.classList.remove("lutf-header-hidden");
          setTimeout(syncHeaderH, 0);
        }
      },
      true
    );
  }

  /* ==================================================================
     2. HOME: video hero
     ================================================================== */
  function initHero() {
    if (body.getAttribute("data-template") !== "home") return;
    var main = $("main#main") || $("main");
    if (!main) return;

    // Prefer a video uploaded through Zid's native "Video" section
    var src = "";
    var poster = "";
    var sourceSection = null;
    $$("main section.section-video").some(function (s) {
      var v = $("video", s);
      var u = v && (($("source", v) || {}).src || v.currentSrc || v.src);
      if (u) {
        src = u;
        poster = v.getAttribute("poster") || "";
        sourceSection = s;
        // stop the hidden original from downloading/playing a second copy
        try {
          v.pause();
          v.removeAttribute("autoplay");
          v.preload = "none";
          $$("source", v).forEach(function (n) {
            v.removeChild(n);
          });
          v.removeAttribute("src");
          v.load();
        } catch (e) {}
        return true;
      }
      return false;
    });
    var mobile = isMobile();
    if (!src) {
      src = (mobile && CFG.heroVideoMobile) || CFG.heroVideo;
      poster = (mobile && CFG.heroPosterMobile) || CFG.heroPoster;
    }
    if (!src) return;
    if (sourceSection) sourceSection.classList.add("lutf-hero-source");

    hero = el("section", "lutf-hero");
    hero.setAttribute("aria-label", CFG.heroTitle || "LUTF");
    if (poster) hero.style.backgroundImage = "url('" + poster + "')";

    var video = el("video", "lutf-hero__media");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "auto");
    video.setAttribute("aria-hidden", "true");
    if (poster) video.poster = poster;
    video.src = src;
    if (!reduceMotion) video.autoplay = true;

    var content = el("div", "lutf-hero__content");
    var html = "";
    if (CFG.heroEyebrow) html += '<span class="lutf-hero__eyebrow">' + esc(CFG.heroEyebrow) + "</span>";
    if (CFG.heroTitle) html += '<h2 class="lutf-hero__title">' + esc(CFG.heroTitle) + "</h2>";
    if (CFG.heroSubtitle) html += '<p class="lutf-hero__subtitle">' + esc(CFG.heroSubtitle) + "</p>";
    if (CFG.heroCtaText)
      html += '<a class="lutf-hero__cta" href="' + esc(CFG.heroCtaUrl || "/products/") + '">' + esc(CFG.heroCtaText) + "</a>";
    content.innerHTML = html;

    // pause / play control (autoplaying video > 5s needs one — WCAG 2.2.2)
    var PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2" width="2.6" height="10" rx="1" fill="currentColor"/><rect x="8.4" y="2" width="2.6" height="10" rx="1" fill="currentColor"/></svg>';
    var PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z" fill="currentColor"/></svg>';
    var toggle = el("button", "lutf-hero__toggle");
    toggle.type = "button";
    var setToggle = function () {
      var paused = video.paused;
      toggle.innerHTML = paused ? PLAY : PAUSE;
      toggle.setAttribute("aria-label", paused ? "تشغيل الفيديو" : "إيقاف الفيديو");
    };
    toggle.addEventListener("click", function () {
      if (video.paused) video.play();
      else video.pause();
    });
    video.addEventListener("play", setToggle);
    video.addEventListener("pause", setToggle);

    hero.appendChild(video);
    hero.appendChild(content);
    hero.appendChild(toggle);
    main.insertBefore(hero, main.firstChild);
    setToggle();

    // if the video can't load (bad URL, CDN down) fall back to the normal page
    video.addEventListener("error", function () {
      if (!hero) return;
      hero.remove();
      hero = null;
      if (sourceSection) sourceSection.classList.remove("lutf-hero-source");
      body.classList.remove("lutf-has-hero", "lutf-on-hero");
      try {
        measure();
      } catch (e) {}
    });

    if (!reduceMotion) {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
    // pause when off-screen (battery + CPU)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!reduceMotion && video.dataset.userPaused !== "1") video.play().catch(function () {});
          } else video.pause();
        });
      }).observe(hero);
      toggle.addEventListener("click", function () {
        video.dataset.userPaused = video.paused ? "1" : "0";
      });
    }

    body.classList.add("lutf-has-hero", "lutf-on-hero");
  }

  /* ==================================================================
     3. PRODUCT CAROUSELS: "swipe" bubble on the first card
     ================================================================== */
  function initCarousels() {
    $$("[data-products-carousel]").forEach(function (car) {
      var first = $("[data-product-card]", car);
      var viewport = $("[data-carousel-viewport]", car);
      if (!first || !viewport) return;
      var slides = $$(".products-embla__slide", car);
      if (slides.length < 2) return;
      var bubble = el("span", "lutf-swipe", esc(CFG.swipeLabel));
      bubble.setAttribute("aria-hidden", "true");
      first.appendChild(bubble);
      var gone = function () {
        bubble.classList.add("is-gone");
        viewport.removeEventListener("pointerdown", gone);
        viewport.removeEventListener("touchstart", gone);
      };
      viewport.addEventListener("pointerdown", gone, { passive: true });
      viewport.addEventListener("touchstart", gone, { passive: true });
      $$("[data-carousel-next], [data-carousel-prev]", car).forEach(function (b) {
        b.addEventListener("click", gone);
      });
    });
  }

  /* ==================================================================
     4. PRODUCT PAGE
     ================================================================== */
  function readReviews() {
    var box = $("#reviews");
    var out = { avg: null, count: 0, items: [] };
    if (!box) return out;
    var avgEl = $(".h-8 p.text-lg", box);
    if (avgEl) out.avg = parseFloat(avgEl.textContent.replace(",", "."));
    // summary rows: "5 نجوم ▭▭▭ 12"
    $$(".w-10.shrink-0", box).forEach(function (n) {
      var v = parseInt(n.textContent.replace(/[^\d]/g, ""), 10);
      if (!isNaN(v)) out.count += v;
    });
    // individual review cards (they carry a [data-time-ago-date])
    $$("[data-time-ago-date]", box).forEach(function (d) {
      var card = d.closest(".flex.w-full.flex-col");
      if (!card) return;
      var name = $("p.font-semibold", card);
      var comment = null;
      $$(":scope > p", card).forEach(function (p) {
        if (!comment) comment = p;
      });
      var stars = $$("svg.text-warning", card).length;
      if (comment && comment.textContent.trim()) {
        out.items.push({
          text: comment.textContent.trim(),
          name: name ? name.textContent.trim() : "",
          stars: stars || 5,
        });
      }
    });
    return out;
  }

  function enhanceRatingChip(rv) {
    var link = $('#product-main-section a[href="#reviews"]');
    if (!link) return;
    var row = link.parentElement;
    row.classList.add("lutf-rating-chip");
    if (rv.avg) {
      var score = el("span", "lutf-rating-chip__score", rv.avg.toFixed(1));
      row.insertBefore(score, row.firstChild);
    }
    if (rv.count) link.textContent = "(" + rv.count + " " + CFG.reviewsWord + ")";
    else link.textContent = CFG.firstReviewText || "كن أول من يقيّم";
  }

  // Notes written the "normal" way in the description:
  //   <p><strong>التركيبة العطرية:</strong></p>
  //   <ul><li><strong>المقدمة:</strong> …</li> … </ul>
  function autoNotes(prose) {
    var found = null;
    $$("p, h2, h3, h4", prose).some(function (hd) {
      var t = (hd.textContent || "").trim();
      if (t.length > 40 || !new RegExp("(عطري|النفحات|notes)", "i").test(t)) return false;
      var ul = hd.nextElementSibling;
      if (!ul || ul.tagName !== "UL") return false;
      var notes = [];
      $$(":scope > li", ul).forEach(function (li) {
        var st = $("strong, b", li);
        var label = st ? st.textContent : "";
        var text = (li.textContent || "").replace(label, "");
        label = label.replace(/[:\uFF1A\s]+$/, "").trim();
        text = text.replace(/^[:\uFF1A\s]+/, "").trim();
        if (label && text) notes.push({ label: label, text: text });
      });
      if (notes.length >= 2) {
        found = { title: t.replace(/[:\uFF1A\s]+$/, ""), notes: notes };
        hd.classList.add("lutf-moved");
        ul.classList.add("lutf-moved");
        return true;
      }
      return false;
    });
    return found;
  }

  // "المميزات:" list → check-mark grid; short description → first sentence
  function polishDescription() {
    var prose = $("#additional-info .prose");
    if (prose) {
      $$("p, h2, h3, h4", prose).forEach(function (hd) {
        var t = (hd.textContent || "").trim();
        var ul = hd.nextElementSibling;
        if (t.length < 30 && new RegExp("(المميزات|مميزات|features)", "i").test(t) && ul && ul.tagName === "UL") ul.classList.add("lutf-features");
      });
    }
    var short = $(".product-details-column .prose-theme");
    var firstP = prose && $("p", prose);
    if (short && firstP && firstP.textContent.trim().length > 20) short.textContent = firstP.textContent.trim();
  }

  // Parse a [notes] … [/notes] block written in the product description
  function extractNotes() {
    var prose = $("#additional-info .prose") || $("#product-main-section .prose");
    if (!prose) return null;
    var text = prose.innerText || prose.textContent || "";
    var start = text.search(/\[notes[^\]]*\]/i);
    if (start < 0) return autoNotes(prose);

    var kids = Array.prototype.slice.call(prose.children);
    var inBlock = false;
    var blockEls = [];
    var lines = [];
    kids.forEach(function (k) {
      var t = k.innerText || k.textContent || "";
      if (!inBlock && /\[notes[^\]]*\]/i.test(t)) inBlock = true;
      if (inBlock) {
        blockEls.push(k);
        lines = lines.concat(t.split(/\n+/));
        if (/\[\/notes\]/i.test(t)) inBlock = false;
      }
    });
    if (!blockEls.length) {
      // description is a single text node / no wrapping elements
      lines = text.slice(start).split(/\n+/);
    }

    var title = "";
    var notes = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var open = line.match(/\[notes([^\]]*)\]\s*(.*)$/i);
      if (open) {
        title = (open[1].replace(/^[:\s]+/, "") || open[2] || "").trim();
        continue;
      }
      if (/\[\/notes\]/i.test(line)) break;
      var parts = line.split(/\s*[|\uFF5C:]\s*/);
      if (parts.length >= 2 && parts[0]) {
        notes.push({ label: parts.shift(), text: parts.join(" · ") });
      }
    }
    var imgs = [];
    blockEls.forEach(function (b) {
      imgs = imgs.concat($$("img", b));
      if (b.tagName === "IMG") imgs.push(b);
    });
    notes.forEach(function (n, idx) {
      if (imgs[idx]) n.image = imgs[idx].currentSrc || imgs[idx].src;
    });
    // remove the raw block from the visible description
    blockEls.forEach(function (b) {
      b.remove();
    });
    return notes.length ? { title: title || CFG.notesFallbackTitle, notes: notes } : null;
  }

  function railNav(rail) {
    var nav = el("div", "lutf-rail-nav");
    var prev = el("button", "", ARROW);
    var next = el("button", "", ARROW);
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", "السابق");
    next.setAttribute("aria-label", "التالي");
    prev.querySelector("svg").style.transform = "scaleX(-1)";
    // physical direction: RTL "next" moves left
    var rtl = getComputedStyle(rail).direction === "rtl";
    if (rtl) {
      prev.querySelector("svg").style.transform = "none";
      next.querySelector("svg").style.transform = "scaleX(-1)";
    }
    var step = function () {
      var c = rail.firstElementChild;
      return c ? c.getBoundingClientRect().width + 12 : rail.clientWidth * 0.8;
    };
    var dir = rtl ? -1 : 1;
    prev.addEventListener("click", function () {
      rail.scrollBy({ left: -dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    next.addEventListener("click", function () {
      rail.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      var pos = Math.abs(rail.scrollLeft);
      prev.disabled = pos <= 2;
      next.disabled = pos >= max;
    };
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    setTimeout(sync, 50);
    nav.appendChild(prev);
    nav.appendChild(next);
    return nav;
  }

  function railProgress(rail) {
    var bar = el("div", "lutf-rail-progress", "<span></span>");
    var fill = bar.firstChild;
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var ratio = max > 0 ? Math.abs(rail.scrollLeft) / max : 1;
      var vis = rail.scrollWidth ? rail.clientWidth / rail.scrollWidth : 1;
      fill.style.width = Math.min(100, (vis + (1 - vis) * ratio) * 100) + "%";
    };
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    setTimeout(sync, 60);
    return bar;
  }

  /* ---------- Client stories ---------------------------------------- */
  var MP4 = /\.mp4(\?|#|$)/i;

  function storiesFromGallery(root) {
    var re = new RegExp(CFG.storiesMatch, "i");
    var found = null;
    $$("section.section-gallery", root).some(function (sec) {
      var h = $("h2", sec);
      var title = h ? h.textContent.trim() : "";
      if (!re.test(title)) return false;
      var items = [];
      $$(".media-wrap", sec).forEach(function (mw) {
        var card = mw.parentElement;
        var img = $("img", mw);
        var tag = $("h3", card);
        var link = $("a[href]", card);
        var href = link ? link.getAttribute("href") : "";
        var isVid = !!href && MP4.test(href);
        var it = {
          image: img ? img.getAttribute("src") || "" : "",
          tag: tag ? tag.textContent.trim() : "",
          url: href && !isVid ? href : "",
          video: isVid ? href : "",
        };
        if (it.image || it.video) items.push(it);
      });
      if (items.length) found = { title: title, items: items, section: sec };
      return true;
    });
    return found;
  }

  function socialUrl() {
    if (CFG.storiesCtaUrl) return CFG.storiesCtaUrl;
    var a = $('#footer a[href*="instagram.com"], #footer a[href*="tiktok.com"], a[href*="instagram.com"]');
    return a ? a.href : "";
  }

  function buildStories(data) {
    var sec = el("section", "lutf-stories");
    var panel = el("div", "lutf-stories__panel");
    panel.appendChild(el("h2", "lutf-stories__title", esc(CFG.storiesTitle || data.title || "you + lutf")));
    var rail = el("div", "lutf-rail");
    rail.setAttribute("role", "list");
    var PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1.2v7.6L8.6 5z" fill="currentColor"/></svg>';
    data.items.forEach(function (it) {
      var card = el(it.url ? "a" : "div", "lutf-story");
      card.setAttribute("role", "listitem");
      if (it.url) {
        card.href = it.url;
        if (/^https?:/i.test(it.url) && it.url.indexOf(location.host) < 0) {
          card.target = "_blank";
          card.rel = "noopener";
        }
      }
      var h = "";
      if (it.video) {
        h +=
          '<video muted loop playsinline preload="none" data-lutf-story-video' +
          (it.image ? ' poster="' + esc(it.image) + '"' : "") +
          ' src="' + esc(it.video) + '"></video><span class="lutf-story__play">' + PLAY + "</span>";
      } else {
        h += '<img src="' + esc(it.image) + '" alt="' + esc(it.tag || "") + '" loading="lazy">';
      }
      if (it.tag) h += '<span class="lutf-story__tag" dir="auto">' + esc(it.tag) + "</span>";
      card.innerHTML = h;
      rail.appendChild(card);
    });
    panel.appendChild(rail);
    if (data.items.length > 1) {
      var foot = el("div", "lutf-rail-foot");
      foot.appendChild(railProgress(rail));
      foot.appendChild(railNav(rail));
      panel.appendChild(foot);
    }
    var url = socialUrl();
    if (url && CFG.storiesCtaText) {
      var cta = el("div", "lutf-stories__cta");
      cta.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(CFG.storiesCtaText) + "</a>";
      panel.appendChild(cta);
    }
    sec.appendChild(panel);

    // story videos play only while visible
    var vids = $$("video[data-lutf-story-video]", sec);
    if (vids.length && "IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              var pr = en.target.play();
              if (pr && pr.catch) pr.catch(function () {});
            } else en.target.pause();
          });
        },
        { threshold: 0.4 }
      );
      vids.forEach(function (v) {
        io.observe(v);
      });
    }
    return sec;
  }

  /* ---------- Data shared across pages (read on the home page, cached) ---------- */
  var HOME_KEY = "lutf:home:v2";

  function catsFromHome(root) {
    var out = [];
    $$(".section-categories .embla__slide a[href]", root).forEach(function (a) {
      var img = $("img", a);
      var h = $("h3", a);
      out.push({
        url: a.getAttribute("href"),
        label: h ? h.textContent.trim() : img ? img.getAttribute("alt") || "" : "",
        image: img ? img.getAttribute("src") || "" : "",
      });
    });
    return out;
  }

  function readHome(root) {
    var st = storiesFromGallery(root);
    return {
      stories: st ? { title: st.title, items: st.items } : null,
      cats: catsFromHome(root),
    };
  }

  function saveHome(data) {
    try {
      localStorage.setItem(HOME_KEY, JSON.stringify({ t: Date.now(), stories: data.stories, cats: data.cats }));
    } catch (e) {}
  }

  var homePending = null;
  function loadHome(cb) {
    try {
      var c = JSON.parse(localStorage.getItem(HOME_KEY) || "null");
      if (c && Date.now() - c.t < 12 * 3600 * 1000) return cb(c);
    } catch (e) {}
    if (!window.fetch || !window.DOMParser) return cb({ stories: null, cats: [] });
    // not cached yet: read the home page once, in the background
    if (!homePending) {
      homePending = fetch("/", { credentials: "same-origin" })
        .then(function (r) {
          return r.ok ? r.text() : "";
        })
        .then(function (html) {
          var data = html ? readHome(new DOMParser().parseFromString(html, "text/html")) : { stories: null, cats: [] };
          saveHome(data);
          return data;
        })
        .catch(function () {
          return { stories: null, cats: [] };
        });
    }
    homePending.then(cb);
  }

  function loadStories(cb) {
    if (CFG.stories && CFG.stories.length) return cb({ title: CFG.storiesTitle, items: CFG.stories });
    loadHome(function (d) {
      if (d && d.stories && d.stories.items && d.stories.items.length) cb(d.stories);
    });
  }

  function initStoriesHome() {
    if (body.getAttribute("data-template") !== "home") return;
    saveHome(readHome(doc));
    var data = storiesFromGallery(doc);
    if (!data) {
      if (CFG.stories && CFG.stories.length) {
        var main = $("main");
        if (main) main.appendChild(buildStories({ title: CFG.storiesTitle, items: CFG.stories }));
      }
      return;
    }
    var sec = buildStories(data);
    data.section.parentNode.insertBefore(sec, data.section);
    data.section.classList.add("lutf-stories-source");
  }

  /* ---------- TikTok feed ------------------------------------------- */
  var PLAY_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a.7.7 0 001.1.6l8.6-5.5a.7.7 0 000-1.2L5.1 1.9A.7.7 0 004 2.5z" fill="currentColor"/></svg>';

  function ttPost(frame, type) {
    try {
      frame.contentWindow.postMessage({ type: type, value: null, "x-tiktok-player": true }, "*");
    } catch (e) {}
  }

  function buildTikTok() {
    var handle = CFG.tiktokHandle;
    if (!handle) return null;
    var profile = "https://www.tiktok.com/@" + encodeURIComponent(handle);
    var sec = el("section", "lutf-tiktok");
    var panel = el("div", "lutf-tiktok__panel");
    panel.innerHTML =
      '<div class="lutf-tiktok__head"><div class="lutf-tiktok__who"><span class="lutf-tiktok__logo">' + BRAND.tiktok + "</span>" +
      '<div><h2 class="lutf-tiktok__title">' + esc(CFG.tiktokTitle) + '</h2><span class="lutf-tiktok__handle">@' + esc(handle) + "</span></div></div>" +
      '<a class="lutf-tiktok__follow" href="' + profile + '" target="_blank" rel="noopener">' + esc(CFG.tiktokFollowText) + "</a></div>";

    var vids = (CFG.tiktokVideos || []).filter(function (v) {
      return v && /^\d{8,25}$/.test(String(v.id));
    });

    if (!vids.length) {
      // official TikTok creator embed: always shows the latest videos
      var box = el("div", "lutf-tiktok__embed");
      box.innerHTML =
        '<blockquote class="tiktok-embed" cite="' + profile + '" data-unique-id="' + esc(handle) +
        '" data-embed-type="creator" style="max-width:780px;min-width:288px;"><section><a target="_blank" href="' + profile + '">@' + esc(handle) + "</a></section></blockquote>";
      panel.appendChild(box);
      sec.appendChild(panel);
      var js = el("script");
      js.async = true;
      js.src = "https://www.tiktok.com/embed.js";
      sec.appendChild(js);
      return sec;
    }

    var rail = el("div", "lutf-rail");
    rail.setAttribute("role", "list");
    var cards = [];
    vids.forEach(function (v) {
      var card = el("div", "lutf-tt");
      card.setAttribute("role", "listitem");
      card.dataset.id = String(v.id);
      card.innerHTML =
        '<button type="button" class="lutf-tt__cover" aria-label="' + esc("تشغيل فيديو @" + (v.user || handle)) + '">' +
        '<span class="lutf-tt__play">' + PLAY_ICON + "</span>" +
        '<span><span class="lutf-tt__user">@' + esc(v.user || handle) + "</span>" +
        (v.caption ? '<span class="lutf-tt__caption" dir="auto">' + esc(v.caption) + "</span>" : "") +
        "</span></button>";
      rail.appendChild(card);
      cards.push(card);
    });

    var load = function (card) {
      if (card.querySelector("iframe")) return card.querySelector("iframe");
      var f = el("iframe");
      f.src =
        "https://www.tiktok.com/player/v1/" + card.dataset.id +
        "?controls=1&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=1&timestamp=0&loop=1&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0";
      f.title = "TikTok";
      f.loading = "lazy";
      f.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      f.addEventListener("load", function () {
        card.classList.add("is-loaded");
      });
      card.insertBefore(f, card.firstChild);
      return f;
    };
    var deactivate = function (card) {
      if (!card.classList.contains("is-active")) return;
      card.classList.remove("is-active");
      var f = card.querySelector("iframe");
      if (f) ttPost(f, "pause");
    };
    cards.forEach(function (card) {
      $(".lutf-tt__cover", card).addEventListener("click", function () {
        cards.forEach(function (c) {
          if (c !== card) deactivate(c);
        });
        var f = load(card);
        card.classList.add("is-active");
        ttPost(f, "play");
      });
    });
    // load players (which show the real cover) only as cards come near view
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              load(en.target);
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: "200px 400px" }
      );
      cards.forEach(function (c) {
        io.observe(c);
      });
    } else cards.forEach(load);
    // swiping away pauses the playing video
    rail.addEventListener(
      "scroll",
      function () {
        cards.forEach(function (c) {
          if (!c.classList.contains("is-active")) return;
          var r = c.getBoundingClientRect();
          var rr = rail.getBoundingClientRect();
          if (r.right < rr.left + 20 || r.left > rr.right - 20) deactivate(c);
        });
      },
      { passive: true }
    );

    panel.appendChild(rail);
    if (vids.length > 1) {
      var foot = el("div", "lutf-rail-foot");
      foot.appendChild(railProgress(rail));
      foot.appendChild(railNav(rail));
      panel.appendChild(foot);
    }
    sec.appendChild(panel);
    return sec;
  }

  function initTikTokHome() {
    if (body.getAttribute("data-template") !== "home" || !CFG.tiktokOnHome) return;
    var sec = buildTikTok();
    if (!sec) return;
    var after = $(".lutf-stories");
    var main = $("main#main") || $("main");
    if (after) after.parentNode.insertBefore(sec, after.nextSibling);
    else if (main) main.appendChild(sec);
  }

  /* ---------- Mobile menu ------------------------------------------- */
  function socialLinks() {
    var out = [];
    var c = {};
    try {
      c = (window.__vitrinStoreSettings && window.__vitrinStoreSettings.settings.contact) || {};
    } catch (e) {}
    var base = {
      tiktok: "https://www.tiktok.com/@",
      instagram: "https://www.instagram.com/",
      snapchat: "https://www.snapchat.com/add/",
      twitter: "https://x.com/",
      facebook: "https://www.facebook.com/",
    };
    var names = { tiktok: "TikTok", instagram: "Instagram", snapchat: "Snapchat", twitter: "X", facebook: "Facebook" };
    Object.keys(base).forEach(function (k) {
      var v = c[k];
      if (k === "tiktok" && !v) v = CFG.tiktokHandle;
      if (!v) return;
      v = String(v).trim().replace(/^@/, "");
      out.push({ key: k, label: names[k], url: /^https?:/i.test(v) ? v : base[k] + v });
    });
    var wa = String(CFG.whatsapp || c.phone || "").replace(/[^\d]/g, "");
    if (wa) out.push({ key: "whatsapp", label: "واتساب", url: "https://wa.me/" + wa });
    return out;
  }

  function initDrawer() {
    var scroller = $("#mobile-drawer el-dialog-panel > div.bg-background > div");
    if (!scroller || scroller.dataset.lutf) return;
    scroller.dataset.lutf = "1";

    // promo pill (announcement text) + categories, at the top
    var top = el("div", "lutf-drawer-block");
    var annText = CFG.menuPromo || ($("[data-announcement-bar]") ? $("[data-announcement-bar]").textContent.trim() : "");
    if (annText) top.innerHTML = '<div class="lutf-drawer-promo">' + icon("truckFree") + "<span>" + esc(annText) + "</span></div>";
    scroller.insertBefore(top, scroller.firstChild);

    var catsBlock = el("div", "lutf-drawer-block");
    top.parentNode.insertBefore(catsBlock, top.nextSibling);
    var fillCats = function (cats) {
      if (!cats || !cats.length || catsBlock.childNodes.length) return;
      var h = '<p class="lutf-drawer-label">' + esc(CFG.menuCategoriesTitle) + '</p><div class="lutf-drawer-cats">';
      cats.forEach(function (c) {
        h += '<a class="lutf-drawer-cat" href="' + esc(c.url) + '">' +
          (c.image ? '<img src="' + esc(c.image) + '" alt="" loading="lazy">' : "") +
          "<span>" + esc(c.label) + "</span></a>";
      });
      catsBlock.innerHTML = h + "</div>";
    };
    if (body.getAttribute("data-template") === "home") fillCats(catsFromHome(doc));
    else {
      var ask = function () {
        loadHome(function (d) {
          fillCats(d && d.cats);
        });
      };
      // read the cache now; fetch the home page only when the menu is opened
      try {
        var c = JSON.parse(localStorage.getItem(HOME_KEY) || "null");
        if (c && c.cats) fillCats(c.cats);
      } catch (e) {}
      var btn = $('[onclick*="mobile-drawer"]');
      if (btn) btn.addEventListener("click", ask, { once: true });
    }

    // "more": grouped quick links + social, after the theme's own links
    var account = $(".border-t.pt-4", scroller);
    (CFG.menuMore || []).forEach(function (g) {
      if (!g || !g.links || !g.links.length) return;
      var b = el("div", "lutf-drawer-block");
      var h = '<p class="lutf-drawer-label">' + esc(g.title || "") + '</p><div class="lutf-drawer-grid">';
      g.links.forEach(function (l) {
        h += '<a class="lutf-drawer-link" href="' + esc(l.url) + '">' + icon(l.icon) + "<span>" + esc(l.label) + "</span></a>";
      });
      b.innerHTML = h + "</div>";
      scroller.insertBefore(b, account || null);
    });
    var soc = socialLinks();
    if (soc.length) {
      var sb = el("div", "lutf-drawer-block");
      var sh = '<p class="lutf-drawer-label">' + esc(CFG.menuSocialTitle) + '</p><div class="lutf-drawer-social">';
      soc.forEach(function (x) {
        sh += '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + (BRAND[x.key] || "") + "<span>" + esc(x.label) + "</span></a>";
      });
      sb.innerHTML = sh + "</div>";
      scroller.insertBefore(sb, account || null);
    }
  }

  function buildNotes(data) {
    var sec = el("section", "lutf-block lutf-notes");
    var inner = el("div", "lutf-block__inner");
    inner.appendChild(el("h2", "lutf-block__title", esc(data.title)));
    var rail = el("div", "lutf-rail");
    rail.setAttribute("role", "list");
    data.notes.forEach(function (n, i) {
      var card = el("article", "lutf-note" + (n.image ? "" : " lutf-note--plain"));
      card.setAttribute("role", "listitem");
      var h = "";
      if (n.image) h += '<img src="' + esc(n.image) + '" alt="" loading="lazy">';
      h += '<span class="lutf-note__index">0' + (i + 1) + "</span>";
      h += '<h3 class="lutf-note__label">' + esc(n.label) + "</h3>";
      h += '<p class="lutf-note__text">' + esc(n.text) + "</p>";
      card.innerHTML = h;
      rail.appendChild(card);
    });
    inner.appendChild(rail);
    if (data.notes.length > 1) inner.appendChild(railNav(rail));
    sec.appendChild(inner);
    return sec;
  }

  function buildQuote(rv) {
    if (!rv.items.length) return null;
    // best review: highest stars, then a comfortable length for a headline
    var pick = rv.items
      .slice()
      .sort(function (a, b) {
        var la = Math.abs(a.text.length - 70);
        var lb = Math.abs(b.text.length - 70);
        return b.stars - a.stars || la - lb;
      })[0];
    if (!pick || pick.text.length > 220) return null;
    var sec = el("section", "lutf-block lutf-quote");
    var stars = "";
    for (var i = 0; i < 5; i++) stars += STAR;
    var meta = '<span class="lutf-quote__stars">' + stars + "</span>";
    if (rv.count) meta += "<span>(" + rv.count + " " + CFG.reviewsWord + ")</span>";
    sec.innerHTML =
      '<div class="lutf-block__inner">' +
      '<div class="lutf-quote__meta">' + meta + "</div>" +
      '<blockquote class="lutf-quote__text">“' + esc(pick.text) + "”</blockquote>" +
      (pick.name ? '<span class="lutf-quote__author">— ' + esc(pick.name) + "</span>" : "") +
      '<a class="lutf-quote__link" href="#reviews">' + esc(CFG.quoteLinkText) + "</a>" +
      "</div>";
    return sec;
  }

  function initProduct() {
    if (body.getAttribute("data-template") !== "product_details") return;
    var mainSec = $("#product-main-section");
    if (!mainSec) return;
    var section = mainSec.closest("section");
    var rv = readReviews();
    enhanceRatingChip(rv);
    try {
      polishDescription();
    } catch (e) {}

    var anchor = section;
    var notes = extractNotes();
    if (notes) {
      var n = buildNotes(notes);
      anchor.parentNode.insertBefore(n, anchor.nextSibling);
      anchor = n;
    }
    var q = buildQuote(rv);
    if (q) {
      anchor.parentNode.insertBefore(q, anchor.nextSibling);
      anchor = q;
    }
    if (CFG.tiktokOnProduct) {
      var tt = buildTikTok();
      if (tt) {
        anchor.parentNode.insertBefore(tt, anchor.nextSibling);
        anchor = tt;
      }
    }
    if (CFG.storiesOnProduct) {
      var after = anchor;
      loadStories(function (data) {
        if (!data.items || !data.items.length || $(".lutf-stories")) return;
        after.parentNode.insertBefore(buildStories(data), after.nextSibling);
      });
    }
  }

  /* ==================================================================
     5. Reveal on scroll
     ================================================================== */
  function initReveal() {
    if (!CFG.reveal || reduceMotion || !("IntersectionObserver" in window)) return;
    var targets = $$("main > section:not(.lutf-hero):not(.lutf-hero-source)");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach(function (t) {
      var r = t.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // already on screen: never hide it
      t.classList.add("lutf-reveal");
      io.observe(t);
    });
  }

  /* ================================================================== */
  function boot() {
    body = doc.body;
    if (!body || body.classList.contains("lutf-js")) return;
    body.classList.add("lutf-js");
    // brand display font (kept out of the CSS: Zid may drop @import)
    if (!$('link[href*="family=Alexandria"]')) {
      var f = el("link");
      f.rel = "stylesheet";
      f.href = "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700&display=swap";
      doc.head.appendChild(f);
    }
    var steps = [initHero, initHeader, initCarousels, initStoriesHome, initTikTokHome, initDrawer, initProduct, initReveal];
    steps.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        if (window.console) console.warn("[lutf]", fn.name, e);
      }
    });
    // late layout changes (fonts, announcement height)
    window.addEventListener("load", function () {
      try {
        measure();
        update();
      } catch (e) {}
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
