/* ============================================================
   MUHTASIB COSMETICS — script.js
   GSAP animations, 3D parallax, carousels, reels, cursor
   ============================================================ */
(() => {
  "use strict";

  /* ==========================================================
     ✏️ EDIT HERE — the ONLY thing you must change:
     Replace with the real WhatsApp number.
     Format: country code + number, NO "+", NO spaces.
     Example Jordan: "962790123456"
     ========================================================== */
  const WHATSAPP_NUMBER = "9627XXXXXXXX";
  const WA_MESSAGE = "Hi Muhtasib Cosmetics! 👋 I have a question about your products.";
  const IG_URL = "https://www.instagram.com/muhtasib.cosmetics/";
  /* ========================================================== */

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  /* ---------- WhatsApp & Instagram links (single source of truth) ---------- */
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
  $$("[data-wa]").forEach(a => { a.href = waHref; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-ig]").forEach(a => { a.href = IG_URL; a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- No GSAP? (offline) — show everything, run basics ---------- */
  if (!hasGsap) {
    const p = $("#preloader"); if (p) p.style.display = "none";
  } else {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }

  /* =========================== NAV =========================== */
  const nav = $("#nav");
  const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  const burger = $("#burger");
  const menu = $("#menu");
  let menuOpen = false;

  function toggleMenu(force) {
    menuOpen = force !== undefined ? force : !menuOpen;
    menu.classList.toggle("open", menuOpen);
    burger.classList.toggle("open", menuOpen);
    burger.setAttribute("aria-expanded", menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (hasGsap && menuOpen && !reduced) {
      gsap.fromTo(".menu-links a",
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: .7, stagger: .07, ease: "power3.out", delay: .25, clearProps: "all" });
    }
  }
  burger.addEventListener("click", () => toggleMenu());

  /* Smooth anchor scrolling (works even with pinned sections) */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (menuOpen) toggleMenu(false);
      if (hasGsap && !reduced) {
        gsap.to(window, { scrollTo: { y: target, offsetY: 70 }, duration: 1.15, ease: "power3.inOut" });
      } else {
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      }
    });
  });

  /* =========================== PRELOADER =========================== */
  function heroIntro() {
    if (!hasGsap || reduced) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    tl.to("#nav", { y: 0, opacity: 1, duration: .8 })
      .to(".hero-title .line", { yPercent: 0, duration: 1.15, stagger: .12, ease: "power4.out" }, "-=.6")
      .to("[data-hero-fade]", { y: 0, opacity: 1, duration: .9, stagger: .08 }, "-=.8")
      .to(".frame", { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: .14, ease: "power4.out" }, "-=.9")
      .to(".seal, .sparkle, .stage-glow", { opacity: 1, scale: 1, duration: .8, stagger: .06 }, "-=.7")
      .add(() => startFloats(), "-=.9")
      .add(() => ScrollTrigger.refresh());
  }

  function preloader() {
    const pre = $("#preloader");
    const count = $("#preCount");
    if (!pre) { heroIntro(); return; }
    if (!hasGsap || reduced) { pre.style.display = "none"; heroIntro(); return; }

    const num = { v: 0 };
    gsap.timeline({ onComplete: () => { pre.style.display = "none"; } })
      .to(num, {
        v: 100, duration: 1.4, ease: "power2.inOut",
        onUpdate: () => count.textContent = Math.round(num.v)
      })
      .to(".pre-inner", { yPercent: -26, opacity: 0, duration: .5, ease: "power2.in" }, "+=.15")
      .to(pre, { yPercent: -100, duration: .95, ease: "expo.inOut" }, "-=.15")
      .add(heroIntro, "-=.55");
  }

  /* Initial hidden states (set via JS so the site degrades gracefully) */
  if (hasGsap && !reduced) {
    gsap.set("#nav", { y: -24, opacity: 0 });
    gsap.set(".hero-title .line", { yPercent: 115 });
    gsap.set("[data-hero-fade]", { y: 30, opacity: 0 });
    gsap.set(".frame", { opacity: 0, y: 70, scale: .88, rotate: i => parseFloat($$(".frame")[i].dataset.rotate || 0) });
    gsap.set(".seal, .sparkle", { opacity: 0, scale: .5 });
    gsap.set(".stage-glow", { opacity: 0, scale: .7 });
    $$(".frame").forEach(f => gsap.set(f, { rotate: parseFloat(f.dataset.rotate || 0) }));
  } else if (hasGsap) {
    $$(".frame").forEach(f => gsap.set(f, { rotate: parseFloat(f.dataset.rotate || 0) }));
  }

  /* Floating frames (gentle perpetual motion) */
  function startFloats() {
    if (!hasGsap || reduced) return;
    $$(".frame").forEach((f, i) => {
      gsap.to(f, {
        y: "+=14", duration: 2.6 + i * .5, ease: "sine.inOut",
        yoyo: true, repeat: -1
      });
    });
    $$(".sparkle").forEach((s, i) => {
      gsap.to(s, {
        scale: .35, opacity: .35, transformOrigin: "50% 50%",
        duration: 1.1 + i * .3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * .4
      });
    });
  }

  /* =========================== HERO 3D PARALLAX =========================== */
  const stage = $("#heroStage");
  if (stage && hasGsap && !reduced && finePointer) {
    gsap.set(stage, { transformPerspective: 1100 });
    const rotY = gsap.quickTo(stage, "rotationY", { duration: .9, ease: "power3.out" });
    const rotX = gsap.quickTo(stage, "rotationX", { duration: .9, ease: "power3.out" });
    const layers = $$("#heroStage .frame-wrap").map(w => ({
      x: gsap.quickTo(w, "x", { duration: .9, ease: "power3.out" }),
      y: gsap.quickTo(w, "y", { duration: .9, ease: "power3.out" }),
      depth: parseFloat(w.dataset.depth || 30)
    }));
    $(".hero").addEventListener("mousemove", e => {
      const nx = (e.clientX / innerWidth) - .5;
      const ny = (e.clientY / innerHeight) - .5;
      rotY(nx * 7); rotX(-ny * 5);
      layers.forEach(l => { l.x(nx * l.depth); l.y(ny * l.depth); });
    });
    $(".hero").addEventListener("mouseleave", () => {
      rotY(0); rotX(0);
      layers.forEach(l => { l.x(0); l.y(0); });
    });
  }

  /* =========================== 3D TILT CARDS =========================== */
  if (hasGsap && !reduced && finePointer) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", e => {
        const b = card.getBoundingClientRect();
        const rx = ((e.clientY - b.top) / b.height - .5) * -7;
        const ry = ((e.clientX - b.left) / b.width - .5) * 9;
        gsap.to(card, { rotationX: rx, rotationY: ry, transformPerspective: 850, duration: .5, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: .8, ease: "elastic.out(1,.55)" });
      });
    });
  }

  /* =========================== MAGNETIC BUTTONS =========================== */
  if (hasGsap && !reduced && finePointer) {
    $$(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const b = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - b.left - b.width / 2) * .28,
          y: (e.clientY - b.top - b.height / 2) * .34,
          duration: .5, ease: "power3.out"
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.5)" });
      });
    });
  }

  /* =========================== CUSTOM CURSOR =========================== */
  const dot = $("#cursorDot"), ring = $("#cursorRing"), label = $("#cursorLabel");
  if (hasGsap && !reduced && finePointer && dot && ring) {
    const dx = gsap.quickTo(dot, "x", { duration: .12, ease: "power2.out" });
    const dy = gsap.quickTo(dot, "y", { duration: .12, ease: "power2.out" });
    const rx = gsap.quickTo(ring, "x", { duration: .45, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: .45, ease: "power3.out" });
    window.addEventListener("mousemove", e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });

    document.addEventListener("mouseover", e => {
      const lbl = e.target.closest("[data-cursor]");
      const hov = e.target.closest("a, button");
      if (lbl) { label.textContent = lbl.dataset.cursor; ring.classList.add("is-label"); ring.classList.remove("is-hover"); }
      else if (hov) { ring.classList.add("is-hover"); ring.classList.remove("is-label"); }
      else { ring.classList.remove("is-hover", "is-label"); }
    });
  }

  /* =========================== SCROLL REVEALS =========================== */
  if (hasGsap && !reduced) {
    $$("[data-reveal]").forEach(el => {
      gsap.from(el, {
        y: 38, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
    $$("[data-mask] .line").forEach(line => {
      gsap.set(line, { yPercent: 115 });
      gsap.to(line, {
        yPercent: 0, duration: 1.15, ease: "power4.out",
        scrollTrigger: { trigger: line.closest("[data-mask]"), start: "top 86%", once: true }
      });
    });
  }

  /* =========================== COUNTERS =========================== */
  function runCounter(el) {
    const target = parseFloat(el.dataset.count || "0");
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (!hasGsap || reduced) { el.textContent = target.toFixed(dec).replace(/\.0$/, "") + suffix; return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: "power2.out",
      onUpdate: () => el.textContent = obj.v.toFixed(dec).replace(/\.0$/, "") + suffix
    });
  }
  $$("[data-count]").forEach(el => {
    if (hasGsap && !reduced) {
      ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => runCounter(el) });
    } else runCounter(el);
  });

  /* =========================== BESTSELLERS — pinned horizontal scroll =========================== */
  const track = $("#prodTrack");
  const prodBar = $("#prodProgress");
  if (track && hasGsap && !reduced) {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 60);
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ".products-pin",
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => { if (prodBar) prodBar.style.transform = `scaleX(${self.progress})`; }
        }
      });
    });
  }

  /* =========================== FRAGRANCE CAROUSEL (Instagram style) =========================== */
  (() => {
    const slides = $$(".car-slide");
    if (!slides.length) return;
    const dotsWrap = $("#carDots");
    const indexEl = $("#carIndex");
    const caption = $("#carCaption");
    const frame = $("#carFrame");
    let cur = 0, busy = false;

    const captions = slides.map((_, i) =>
      `N°0${i + 1} — Eau de Parfum · <span lang="ar" dir="rtl">عطر</span>`);

    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "car-dot";
      b.setAttribute("aria-label", `Go to fragrance ${i + 1}`);
      b.addEventListener("click", () => go(i, i > cur ? 1 : -1));
      dotsWrap.appendChild(b);
    });
    const dots = $$(".car-dot");

    function render() {
      dots.forEach((d, i) => d.classList.toggle("active", i === cur));
      indexEl.textContent = cur + 1;
      caption.innerHTML = captions[cur];
    }

    function go(n, dir = 1) {
      const next = (n + slides.length) % slides.length;
      if (busy || next === cur) return;
      busy = true;
      const prev = slides[cur];
      cur = next;
      const incoming = slides[cur];
      render();

      if (!hasGsap || reduced) {
        prev.classList.remove("is-active");
        incoming.classList.add("is-active");
        busy = false;
        return;
      }
      incoming.classList.add("is-active");
      gsap.to(prev, { xPercent: -26 * dir, opacity: 0, scale: .94, duration: .55, ease: "power3.inOut",
        onComplete: () => { prev.classList.remove("is-active"); gsap.set(prev, { xPercent: 0 }); } });
      gsap.fromTo(incoming,
        { xPercent: 26 * dir, opacity: 0, scale: .94 },
        { xPercent: 0, opacity: 1, scale: 1, duration: .68, ease: "power3.out", delay: .06,
          onComplete: () => { busy = false; } });
    }

    $("#carNext").addEventListener("click", () => go(cur + 1, 1));
    $("#carPrev").addEventListener("click", () => go(cur - 1, -1));

    /* Swipe — like Instagram */
    let sx = 0, sy = 0, down = false;
    frame.addEventListener("pointerdown", e => { down = true; sx = e.clientX; sy = e.clientY; });
    window.addEventListener("pointerup", e => {
      if (!down) return; down = false;
      const dxp = e.clientX - sx, dyp = e.clientY - sy;
      if (Math.abs(dxp) > 42 && Math.abs(dxp) > Math.abs(dyp)) go(cur + (dxp < 0 ? 1 : -1), dxp < 0 ? 1 : -1);
    });

    /* Keyboard */
    frame.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") go(cur + 1, 1);
      if (e.key === "ArrowLeft") go(cur - 1, -1);
    });

    render();
  })();

  /* =========================== REELS — autoplay + tap-for-sound =========================== */
  const reels = $$(".reel");
  if (reels.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const v = en.target.querySelector("video");
        if (!v) return;
        if (en.isIntersecting) {
          v.play().catch(() => en.target.classList.add("needs-tap"));
        } else {
          v.pause();
        }
      });
    }, { threshold: .35 });
    reels.forEach(r => {
      io.observe(r);
      const v = r.querySelector("video");
      v.addEventListener("play", () => r.classList.add("playing"));
      v.addEventListener("pause", () => r.classList.remove("playing"));
      r.addEventListener("click", () => {
        if (r.classList.contains("needs-tap")) {
          v.play().then(() => r.classList.remove("needs-tap")).catch(() => {});
          return;
        }
        v.muted = !v.muted;
        r.classList.toggle("muted", v.muted);
      });
    });
  }

  /* =========================== MISC =========================== */
  $("#year").textContent = new Date().getFullYear();

  if (hasGsap) {
    window.addEventListener("load", () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  preloader();
})();