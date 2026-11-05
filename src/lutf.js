/* ==========================================================================
   LUTF × Zid (growth-theme) — behaviour layer
   SOURCE file. Paste dist/lutf.min.js into Zid (Custom JS), not this one.
   Build: scripts/build.sh. No dependencies; safe in <head> or <body>.
   ========================================================================== */
(function () {
  "use strict";

  var CDN = "https://cdn.jsdelivr.net/gh/blokkah-app/lutf-store@780d0ae60678e0fc061c774a9182ee2987dcc4c5/assets/video/";

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
      heroSubtitle: "",
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
      var hb = hero.getBoundingClientRect().bottom;
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
  }

  // Parse a [notes] … [/notes] block written in the product description
  function extractNotes() {
    var prose = $("#additional-info .prose") || $("#product-main-section .prose");
    if (!prose) return null;
    var text = prose.innerText || prose.textContent || "";
    var start = text.search(/\[notes[^\]]*\]/i);
    if (start < 0) return null;

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
  var STORIES_KEY = "lutf:stories:v1";
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

  function saveStories(data) {
    try {
      localStorage.setItem(STORIES_KEY, JSON.stringify({ t: Date.now(), title: data.title, items: data.items }));
    } catch (e) {}
  }

  function loadStories(cb) {
    if (CFG.stories && CFG.stories.length) return cb({ title: CFG.storiesTitle, items: CFG.stories });
    try {
      var c = JSON.parse(localStorage.getItem(STORIES_KEY) || "null");
      if (c && c.items && Date.now() - c.t < 12 * 3600 * 1000) return cb(c);
    } catch (e) {}
    // not cached yet: read the home page once, in the background
    if (!window.fetch || !window.DOMParser) return;
    fetch("/", { credentials: "same-origin" })
      .then(function (r) {
        return r.ok ? r.text() : "";
      })
      .then(function (html) {
        if (!html) return;
        var d = new DOMParser().parseFromString(html, "text/html");
        var data = storiesFromGallery(d);
        if (data) {
          saveStories(data);
          cb(data);
        }
      })
      .catch(function () {});
  }

  function initStoriesHome() {
    if (body.getAttribute("data-template") !== "home") return;
    var data = storiesFromGallery(doc);
    if (!data) {
      try {
        localStorage.setItem(STORIES_KEY, JSON.stringify({ t: Date.now(), items: [] }));
      } catch (e) {}
      if (CFG.stories && CFG.stories.length) {
        var main = $("main");
        if (main) main.appendChild(buildStories({ title: CFG.storiesTitle, items: CFG.stories }));
      }
      return;
    }
    saveStories(data);
    var sec = buildStories(data);
    data.section.parentNode.insertBefore(sec, data.section);
    data.section.classList.add("lutf-stories-source");
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
    var steps = [initHero, initHeader, initCarousels, initStoriesHome, initProduct, initReveal];
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
