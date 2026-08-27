(() => {
  "use strict";

  const designs = [
    "Ex-1.jpg", "Ex-2.jpg", "Ex-3.jpg", "Ex-4.jpg", "Ex-5.jpg",
    "Ex-6.jpg", "Ex-7.jpg", "Ex -8.jpg", "Ex-9.jpg", "Ex - 10.jpg",
    "Ex - 11.jpg", "Ex - 12.jpg", "Ex - 13.jpg", "Ex - 14.jpg", "ex -15.jpg",
    "ex - 16.jpg", "Ex - 17.jpg", "ex 18.jpg", "ex 19.jpg",
    "Portfolio Design Inspiration_ Browse Thousands of Images for Your Next Project.jpg"
  ].map((src, i) => ({ src, name: "Design " + String(i + 1).padStart(2, "0") }));

  const $ = (id) => document.getElementById(id);
  const gallery = $("gallery");
  const fab = $("fab"), fabCount = $("fabCount"), progressBar = $("progressBar");
  const favChip = $("favChip"), favChipLabel = $("favChipLabel");
  const lightbox = $("lightbox"), lbTrack = $("lbTrack"), lbDots = $("lbDots"),
    lbName = $("lbName"), lbPick = $("lbPick"), lbPickLabel = $("lbPickLabel"),
    lbWa = $("lbWa"), waSend = $("waSend");
  const backdrop = $("backdrop"), sheet = $("sheet"), sheetGrid = $("sheetGrid"),
    sheetSub = $("sheetSub"), sheetEmpty = $("sheetEmpty"), confirmBtn = $("confirmBtn"),
    confirmCount = $("confirmCount"), clearAllBtn = $("clearAll"), success = $("success");

  const selected = new Set();
  let showFavsOnly = false;
  let lbIndex = 0;
  let startX = 0, startY = 0;

  const checkSVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const plusSVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';

  /* ---------- WhatsApp ---------- */
  const WHATSAPP = "917577042390";
  const waLink = (msg) => "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);

  /* ---------- Render gallery ---------- */
  gallery.innerHTML = designs.map((d, i) => `
    <article class="card reveal" data-idx="${i}">
      <div class="media" data-preview="${i}">
        <img src="${d.src}" alt="${d.name}" loading="lazy">
        <span class="preview-hint">Tap to preview</span>
        <span class="shine"></span>
        <span class="check-badge">${checkSVG}</span>
      </div>
      <div class="card-body">
        <div>
          <span class="design-name">${d.name}</span>
          <span class="tag">Website concept</span>
        </div>
        <button class="pick-btn" data-idx="${i}" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </article>`).join("");

  /* ---------- Lightbox slides ---------- */
  lbTrack.innerHTML = designs.map((d, i) => `
    <div class="lb-slide">
      <img src="${d.src}" alt="${d.name}" draggable="false">
    </div>`).join("");

  /* ---------- Title letters ---------- */
  function initTitle() {
    let n = 0;
    document.querySelectorAll(".title .word").forEach(word => {
      const chars = word.textContent.split("");
      word.textContent = "";
      chars.forEach(ch => {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        s.style.setProperty("--d", (n++ * 42 + 150) + "ms");
        word.appendChild(s);
      });
    });
  }

  /* ---------- Ticker ---------- */
  function initTicker() {
    const moods = ["Bold", "Minimal", "Elegant", "Dynamic", "Modern", "Luxe", "Clean", "Edgy"];
    const html = moods.map(t => `<span class="ticker-item">&#10022; <b>${t}</b></span>`).join("");
    $("tickerTrack").innerHTML = html + html;
  }

  /* ---------- Floating sparks ---------- */
  function initSparks() {
    const bg = document.querySelector(".bg");
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const size = (2 + Math.random() * 4).toFixed(1);
      s.style.cssText =
        `left:${(Math.random() * 100).toFixed(1)}%;width:${size}px;height:${size}px;` +
        `--dx:${(Math.random() * 180 - 90).toFixed(0)}px;` +
        `animation-duration:${(7 + Math.random() * 9).toFixed(1)}s;` +
        `animation-delay:${(Math.random() * 8).toFixed(1)}s;`;
      bg.appendChild(s);
    }
  }

  /* ---------- 3D tilt (mouse only) ---------- */
  function initTilt() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gallery.querySelectorAll(".media").forEach(media => {
      const card = media.closest(".card");
      media.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        media.style.transform =
          `rotateY(${(px * 10).toFixed(2)}deg) rotateX(${(-py * 10).toFixed(2)}deg)`;
      });
      media.addEventListener("pointerleave", () => { media.style.transform = ""; });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, k) => {
      if (e.isIntersecting) {
        e.target.style.setProperty("--d", (k * 70) + "ms");
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
  document.querySelectorAll(".card").forEach(c => io.observe(c));

  /* ---------- Helpers ---------- */
  function sync() {
    const n = selected.size;
    fabCount.textContent = n;
    confirmCount.textContent = "(" + n + ")";
    progressBar.style.width = (n / designs.length * 100) + "%";
    sheetSub.textContent = n + (n === 1 ? " design picked" : " designs picked");
    waSend.href = n ? waLink("Hi! I've shortlisted these designs for our website: " +
      [...selected].sort((a, b) => a - b).map(i => designs[i].name).join(", ")) : "#";
    renderPickerSheet();
  }

  function renderPickerSheet() {
    if (selected.size) {
      sheetEmpty.style.display = "none";
      sheetGrid.style.display = "grid";
      sheetGrid.innerHTML = [...selected].map(i => `
        <div class="sheet-tile">
          <img src="${designs[i].src}" alt="${designs[i].name}">
          <button class="sheet-tile-x" data-rm="${i}" aria-label="Remove">&#10005;</button>
        </div>`).join("");
    } else {
      sheetGrid.style.display = "none";
      sheetEmpty.style.display = "block";
    }
    setConfirmHighlight();
  }

  function setConfirmHighlight() {
    const primary = selected.size > 0;
    confirmBtn.classList.toggle("off", !primary);
    confirmBtn.style.pointerEvents = primary ? "" : "none";
    confirmBtn.style.opacity = primary ? "" : "0.4";
  }

  function pop(el) {
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  function refreshGallery() {
    let anyVisible = false;
    document.querySelectorAll(".card").forEach(card => {
      const on = selected.has(+card.dataset.idx);
      const vis = !showFavsOnly || on;
      card.classList.toggle("selected", on);
      card.style.display = vis ? "" : "none";
      if (vis) anyVisible = true;
    });
    const emptyNote = document.getElementById("favsEmpty") ||
      (() => {
        const el = document.createElement("div");
        el.id = "favsEmpty";
        el.className = "sheet-empty";
        el.style.cssText = "padding:40px 20px;";
        el.innerHTML = '<div class="empty-heart">&#9825;</div><p>No favorites yet — tap the <b>+</b> on designs you love.</p>';
        gallery.insertAdjacentElement("afterend", el);
        return el;
      })();
    emptyNote.style.display = (showFavsOnly && !anyVisible) ? "block" : "none";
  }

  /* ---------- Toggle selection ---------- */
  function toggle(i, animateFromEl) {
    i = +i;
    if (selected.has(i)) selected.delete(i);
    else selected.add(i);

    const card = document.querySelector(`.card[data-idx="${i}"]`);
    const btn = card && card.querySelector(".pick-btn");
    if (btn) {
      btn.setAttribute("aria-pressed", selected.has(i));
      btn.innerHTML = selected.has(i) ? checkSVG : plusSVG;
    }
    refreshGallery();
    sync();
    if (selected.has(i)) pop(fabCount);
    if (i === lbIndex) updateLightboxPick();
    void animateFromEl;
  }

  gallery.addEventListener("click", (e) => {
    const btn = e.target.closest(".pick-btn");
    if (btn) { toggle(btn.dataset.idx); return; }
    const media = e.target.closest(".media");
    if (media) openLightbox(+media.dataset.preview);
  });

  /* ---------- Lightbox ---------- */
  function updateLightboxPick() {
    const isPicked = selected.has(lbIndex);
    lbPick.classList.toggle("picked", isPicked);
    lbPickLabel.textContent = isPicked ? "Selected — tap to undo" : "Select this design — " + designs[lbIndex].name;
    lbWa.href = waLink("Hi! I'm interested in " + designs[lbIndex].name +
      " for our website. Can we discuss it further?");
    lbDots.innerHTML = designs.map((_, i) =>
      `<span class="lb-dot${i === lbIndex ? " active" : ""}"></span>`).join("");
  }

  function moveSlide(to) {
    lbIndex = (to + designs.length) % designs.length;
    lbTrack.style.transform = `translateX(-${lbIndex * 100}%)`;
    lbName.textContent = designs[lbIndex].name;
    updateLightboxPick();
  }

  function openLightbox(i) {
    lbIndex = i;
    lbTrack.style.transition = "none";
    moveSlide(i);
    void lbTrack.offsetWidth;
    lbTrack.style.transition = "";
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }

  $("lbClose").addEventListener("click", closeLightbox);
  $("lbPrev").addEventListener("click", () => { lbTrack.style.transition = ""; moveSlide(lbIndex - 1); });
  $("lbNext").addEventListener("click", () => { lbTrack.style.transition = ""; moveSlide(lbIndex + 1); });

  lbPick.addEventListener("click", () => {
    const el = lbPick;
    el.style.transition = "transform .3s var(--ease)";
    el.style.transform = "scale(.93)";
    toggle(lbIndex);
    setTimeout(() => { el.style.transform = ""; }, 180);
  });

  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  /* swipe gestures */
  const vp = $("lbViewport");
  vp.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  vp.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      moveSlide(lbIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  vp.addEventListener("mousedown", (e) => { startX = e.clientX; startY = e.clientY; });
  vp.addEventListener("mouseup", (e) => {
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) moveSlide(lbIndex + (dx < 0 ? 1 : -1));
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") { lbTrack.style.transition = ""; moveSlide(lbIndex - 1); }
    if (e.key === "ArrowRight") { lbTrack.style.transition = ""; moveSlide(lbIndex + 1); }
  });

  /* ---------- Sheet / FAB ---------- */
  function toggleSheet(force) {
    const willShow = typeof force === "boolean" ? force : !sheet.classList.contains("show");
    if (willShow) {
      renderPickerSheet();
      clearAllBtn.style.display = "";
      confirmBtn.style.display = "";
      sheet.classList.add("show");
      backdrop.classList.add("show");
    }
    else { sheet.classList.remove("show"); backdrop.classList.remove("show"); }
    document.body.style.overflow = willShow ? "hidden" : "";
    if (willShow) success.classList.remove("show");
  }

  fab.addEventListener("click", () => toggleSheet(true));
  backdrop.addEventListener("click", () => toggleSheet(false));
  sheet.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-rm]");
    if (rm) {
      const tile = rm.parentElement;
      tile.classList.add("removing");
      setTimeout(() => toggle(+rm.dataset.rm), 200);
    }
  });

  clearAllBtn.addEventListener("click", () => {
    [...selected].forEach(i => toggle(i));
    pop(sheetGrid);
  });

  $("doneBtn").addEventListener("click", () => {
    success.classList.remove("show");
    toggleSheet(false);
  });

  /* ---------- Confirm + confetti ---------- */
  confirmBtn.addEventListener("click", () => {
    if (!selected.size) return;
    success.classList.add("show");
    $("sheetGrid").style.display = "none";
    $("sheetEmpty").style.display = "none";
    clearAllBtn.style.display = "none";
    confirmBtn.style.display = "none";
    burst();
  });

  const colors = ["#f97316", "#ec4899", "#8b5cf6", "#34d399", "#facc15", "#38bdf8"];
  function burst() {
    for (let i = 0; i < 80; i++) {
      const p = document.createElement("span");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.width = 6 + Math.random() * 8 + "px";
      p.style.height = 10 + Math.random() * 8 + "px";
      p.style.animationDuration = (1.6 + Math.random() * 1.6) + "s";
      p.style.animationDelay = (Math.random() * 0.5) + "s";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3600);
    }
  }

  $("copyList").addEventListener("click", async () => {
    const text = [...selected].sort((a, b) => a - b)
      .map(i => designs[i].name).join("\n");
    const btn = $("copyList");
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
    } catch {
      btn.textContent = "Copy not available";
    }
    setTimeout(() => { btn.textContent = "Copy design list"; }, 1600);
  });

  /* ---------- Favorites filter ---------- */
  favChip.addEventListener("click", () => {
    showFavsOnly = !showFavsOnly;
    favChip.classList.toggle("on", showFavsOnly);
    favChipLabel.textContent = showFavsOnly ? "Favorites only" : "All designs";
    refreshGallery();
    const firstVis = document.querySelector('.card:not([style*="display: none"]) .media');
    if (showFavsOnly && firstVis) firstVis.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* init */
  initTitle();
  initTicker();
  initSparks();
  initTilt();
  refreshGallery();
  sync();
  updateLightboxPick();
})();