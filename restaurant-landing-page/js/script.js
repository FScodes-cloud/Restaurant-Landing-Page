/* ==========================================================================
   LUMIÈRE — Restaurant & Dining  |  RST-001
   --------------------------------------------------------------------------
   Vanilla JavaScript, no libraries. Each feature lives in its own function
   and is started at the bottom, inside init().

   FEATURES
   1.  Mobile navigation (hamburger menu)
   2.  Header style + back-to-top button (IntersectionObserver, no scroll events)
   3.  Smooth scrolling & active nav link
   4.  Scroll reveal animations
   5.  Menu category filter
   6.  WhatsApp link
   7.  Reservation form validation (frontend-only demo)
   8.  Gallery lightbox
   9.  Image fallback & small helpers
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   CONFIG — change demo settings here instead of hunting through the code
   -------------------------------------------------------------------------- */
const CONFIG = {
  restaurantName: "LUMIÈRE",
  // Fictional demo number (555 numbers are reserved for fiction). Digits only, with country code.
  whatsappNumber: "15555550123",
  whatsappMessage: "Hello LUMIÈRE, I'd like to ask about a table reservation.",
  fallbackImage: "assets/images/image-fallback.svg",
  reservation: {
    minGuests: 1,
    maxGuests: 12,
    maxDaysAhead: 90,      // how far in advance a table can be requested
    minLeadMinutes: 60,    // a same-day request must be at least this far in the future
    simulatedDelayMs: 900  // fake "sending" delay so the loading state is visible
  }
};

/* --------------------------------------------------------------------------
   Shared helpers
   -------------------------------------------------------------------------- */

// Reads the user's "reduce motion" operating-system setting.
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shorthand for document.querySelector / querySelectorAll
const $  = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Creates an invisible 1px marker. IntersectionObserver watches it, so we can know
// "has the user scrolled past Y pixels?" without listening to scroll events.
function createScrollSentinel(topPx) {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText =
    `position:absolute;top:${topPx}px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;`;
  document.body.appendChild(sentinel);
  return sentinel;
}


/* ==========================================================================
   1. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggle = $("#navToggle");
  const nav = $("#primaryNav");
  if (!toggle || !nav) return;

  const desktopQuery = window.matchMedia("(min-width: 769px)");

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));        // tells screen readers the state
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close when any link inside the menu is chosen
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  // Close with the Escape key and return focus to the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close when tapping outside the header
  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !event.target.closest("#siteHeader")) setOpen(false);
  });

  // If the window grows to desktop size, reset the mobile state
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}


/* ==========================================================================
   2. HEADER STYLE + BACK-TO-TOP
   ========================================================================== */
function initScrollState() {
  const header = $("#siteHeader");
  const backToTop = $("#backToTop");

  if ("IntersectionObserver" in window) {
    // When the top marker leaves the screen, the page has been scrolled.
    if (header) {
      const headerSentinel = createScrollSentinel(24);
      new IntersectionObserver(([entry]) => {
        header.classList.toggle("is-scrolled", !entry.isIntersecting);
      }).observe(headerSentinel);
    }

    if (backToTop) {
      const topSentinel = createScrollSentinel(700);
      new IntersectionObserver(([entry]) => {
        backToTop.classList.toggle("is-visible", !entry.isIntersecting);
      }).observe(topSentinel);
    }
  } else {
    // Very old browsers: keep things usable
    if (header) header.classList.add("is-scrolled");
    if (backToTop) backToTop.classList.add("is-visible");
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      // Move keyboard focus to the top of the page so it doesn't get lost
      const logo = $(".logo");
      if (logo) logo.focus({ preventScroll: true });
    });
  }
}


/* ==========================================================================
   3. SMOOTH SCROLLING & ACTIVE NAV LINK
   --------------------------------------------------------------------------
   The smooth effect itself is CSS (scroll-behavior: smooth), which is turned
   off by the reduced-motion media query. JS only adds two helpful details:
   moving keyboard focus to the target section, and highlighting the nav link
   for the section currently on screen.
   ========================================================================== */
function initAnchorLinks() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (hash === "#" || hash.length < 2) { event.preventDefault(); return; } // demo social links

    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", hash);

    // Sections aren't focusable by default; this lets keyboard/screen-reader users continue from here
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
}

function initActiveNavLink() {
  if (!("IntersectionObserver" in window)) return;

  const links = $$(".nav-link");
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  // A thin band around the middle of the screen decides which section is "current"
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((section) => observer.observe(section));
}


/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initReveal() {
  const items = $$("[data-reveal]");
  if (!items.length) return;

  // No observer support or reduced motion: just show everything
  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target); // animate once, then stop watching (saves work)
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach((item, index) => {
    // Tiny stagger for items that share a row (testimonials). Capped so it never feels slow.
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
    observer.observe(item);
  });
}


/* ==========================================================================
   5. MENU CATEGORY FILTER
   ========================================================================== */
function initMenuFilter() {
  const buttons = $$(".filter-btn");
  const cards = $$(".menu-card");
  const status = $("#menuStatus");
  if (!buttons.length || !cards.length) return;

  function applyFilter(category, label) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = category === "all" || card.dataset.category === category;
      card.hidden = !matches;                      // hidden items are removed from layout AND from screen readers

      card.classList.remove("is-entering");
      if (matches) {
        // Force the browser to restart the entrance animation for each newly shown card
        card.style.animationDelay = `${visibleCount * 50}ms`;
        void card.offsetWidth;                     // reading offsetWidth restarts the animation
        card.classList.add("is-entering");
        visibleCount += 1;
      }
    });

    if (status) {
      status.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "dish" : "dishes"}: ${label}.`;
    }
  }

  // One listener for the whole filter bar (event delegation) instead of one per button
  $(".filter-bar").addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    buttons.forEach((btn) => {
      const isSelected = btn === button;
      btn.classList.toggle("is-active", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
    });

    applyFilter(button.dataset.filter, button.textContent.trim());
  });

  // Clean up the animation class when it finishes so hover transforms work normally
  $("#menuGrid").addEventListener("animationend", (event) => {
    const card = event.target.closest(".menu-card");
    if (card) { card.classList.remove("is-entering"); card.style.animationDelay = ""; }
  });
}


/* ==========================================================================
   6. WHATSAPP LINK
   ========================================================================== */
function initWhatsApp() {
  const button = $("#whatsappBtn");
  if (!button) return;
  // encodeURIComponent turns spaces and special characters into URL-safe text
  button.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
}


/* ==========================================================================
   7. RESERVATION FORM (FRONTEND-ONLY DEMO)
   --------------------------------------------------------------------------
   IMPORTANT: nothing is sent or saved. A real version needs a backend (or a
   booking service) to receive the data.
   ========================================================================== */
function initReservationForm() {
  const form = $("#reservationForm");
  if (!form) return;

  const summary = $("#formSummary");
  const success = $("#formSuccess");
  const submitBtn = $("#submitBtn");
  const dateInput = $("#date");
  const requests = $("#requests");
  const counter = $("#requests-count");
  const rules = CONFIG.reservation;

  let isSubmitting = false; // guards against double clicks / double Enter presses

  /* ---- Date helpers (all in the visitor's LOCAL time) ---- */
  const pad = (n) => String(n).padStart(2, "0");
  const toDateValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // Turns "2026-11-20" + "19:30" into a real Date object (local time)
  function buildDateTime(dateValue, timeValue) {
    const [y, m, d] = dateValue.split("-").map(Number);
    const [hh, mm] = (timeValue || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm);
  }

  // Set the earliest/latest selectable dates (greys out past days in the date picker)
  function setDateLimits() {
    const today = new Date();
    const latest = new Date();
    latest.setDate(today.getDate() + rules.maxDaysAhead);
    dateInput.min = toDateValue(today);
    dateInput.max = toDateValue(latest);
  }

  /* ---- Validators: each returns an error message, or "" when the value is fine ---- */
  const validators = {
    name(value) {
      const v = value.trim();
      if (!v) return "Please enter your full name.";
      if (v.length < 2) return "Your name needs at least 2 characters.";
      if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(v)) return "Names can only contain letters, spaces, apostrophes, dots and hyphens.";
      return "";
    },
    email(value) {
      const v = value.trim();
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email, like name@example.com.";
      return "";
    },
    phone(value) {
      const v = value.trim();
      if (!v) return "Please enter your phone number.";
      if (!/^\+?[\d\s().-]+$/.test(v)) return "Phone numbers can only contain digits, spaces, + ( ) - and dots.";
      const digits = v.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) return "Enter a phone number with 7 to 15 digits.";
      return "";
    },
    date(value) {
      if (!value) return "Please choose a reservation date.";
      const chosen = buildDateTime(value, "00:00");
      if (Number.isNaN(chosen.getTime())) return "Enter a valid date.";
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (chosen < today) return "That date has already passed. Please choose today or a future date.";
      const latest = new Date(today); latest.setDate(today.getDate() + rules.maxDaysAhead);
      if (chosen > latest) return `We take online requests up to ${rules.maxDaysAhead} days ahead.`;
      return "";
    },
    time(value) {
      if (!value) return "Please choose a reservation time.";
      const dateValue = dateInput.value;
      if (dateValue && !validators.date(dateValue)) {
        const requested = buildDateTime(dateValue, value);
        const earliest = new Date(Date.now() + rules.minLeadMinutes * 60000);
        if (requested < earliest) return "That time is too soon. Please choose a later time or call us.";
      }
      return "";
    },
    guests(value) {
      if (value === "") return "Please enter the number of guests.";
      const n = Number(value);
      if (!Number.isInteger(n)) return "Guests must be a whole number.";
      if (n < rules.minGuests) return `At least ${rules.minGuests} guest is needed.`;
      if (n > rules.maxGuests) return `Online requests are limited to ${rules.maxGuests} guests. For larger parties, please call or message us.`;
      return "";
    }
  };

  const fieldNames = Object.keys(validators);
  const labelFor = (name) => $(`label[for="${name}"]`).childNodes[0].textContent.trim();

  /* ---- Show / clear one field's error ---- */
  function setFieldError(name, message) {
    const input = $(`#${name}`);
    const errorEl = $(`#${name}-error`);
    errorEl.textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validateField(name) {
    const message = validators[name](form.elements[name].value);
    setFieldError(name, message);
    return message;
  }

  /* ---- Error summary at the top of the form (with links to each problem field) ---- */
  function renderSummary(errors) {
    summary.replaceChildren(); // clear old content safely
    if (!errors.length) { summary.hidden = true; return; }

    const heading = document.createElement("p");
    heading.textContent = `Please fix ${errors.length} ${errors.length === 1 ? "problem" : "problems"} below:`;

    const list = document.createElement("ul");
    errors.forEach(({ name, message }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${name}`;
      link.dataset.field = name;
      link.textContent = `${labelFor(name)}: ${message}`;
      item.appendChild(link);
      list.appendChild(item);
    });

    summary.append(heading, list);
    summary.hidden = false;
  }

  // Clicking a summary link focuses the matching field instead of just jumping
  summary.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-field]");
    if (!link) return;
    event.preventDefault();
    form.elements[link.dataset.field].focus();
  });

  /* ---- Live feedback: validate a field when the user leaves it, then keep it updated while typing ---- */
  const touched = new Set();

  fieldNames.forEach((name) => {
    const input = form.elements[name];
    input.addEventListener("blur", () => { touched.add(name); validateField(name); });
    const revalidate = () => { if (touched.has(name)) validateField(name); };
    input.addEventListener("input", revalidate);
    input.addEventListener("change", () => {
      revalidate();
      // The time rule depends on the date, so re-check time when the date changes
      if (name === "date" && touched.has("time")) validateField("time");
    });
  });

  // Character counter for the optional textarea
  requests.addEventListener("input", () => {
    counter.textContent = `${requests.value.length} / ${requests.maxLength}`;
  });

  /* ---- Submit ---- */
  form.addEventListener("submit", (event) => {
    event.preventDefault();                // stop the page from reloading
    if (isSubmitting) return;              // ignore duplicate submissions

    const errors = [];
    fieldNames.forEach((name) => {
      touched.add(name);
      const message = validateField(name);
      if (message) errors.push({ name, message });
    });

    renderSummary(errors);

    if (errors.length) {
      summary.focus();                     // screen readers announce the summary; keyboard users land on it
      summary.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
      return;
    }

    // --- All valid: simulate "sending" ---
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending request…";

    // Copy the values NOW, in case the form changes during the delay
    const data = {
      name: form.elements.name.value.trim(),
      date: form.elements.date.value,
      time: form.elements.time.value,
      guests: Number(form.elements.guests.value)
    };

    // A real site would send `data` to a server here (fetch POST). We only simulate it.
    window.setTimeout(() => showSuccess(data), rules.simulatedDelayMs);
  });

  function showSuccess(data) {
    const prettyDate = buildDateTime(data.date, data.time).toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    // textContent (not innerHTML) so anything typed by the visitor can never be run as code
    $("#successName").textContent = data.name.split(" ")[0];
    $("#successDetails").textContent =
      `Your request for ${data.guests} ${data.guests === 1 ? "guest" : "guests"} on ${prettyDate} at ${data.time} has been checked.`;

    form.hidden = true;
    success.hidden = false;
    success.focus();
    isSubmitting = false;
  }

  /* ---- "Make another request" resets everything ---- */
  $("#newReservationBtn").addEventListener("click", () => {
    form.reset();
    touched.clear();
    fieldNames.forEach((name) => setFieldError(name, ""));
    renderSummary([]);
    counter.textContent = `0 / ${requests.maxLength}`;
    submitBtn.disabled = false;
    submitBtn.textContent = "Request Reservation";
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  setDateLimits();
}


/* ==========================================================================
   8. GALLERY LIGHTBOX (native <dialog>)
   ========================================================================== */
function initLightbox() {
  const dialog = $("#lightbox");
  const grid = $("#galleryGrid");
  if (!dialog || !grid) return;

  const image = $("#lbImage");
  const caption = $("#lbCaption");
  const triggers = $$(".gallery-btn", grid);

  let currentIndex = 0;
  let lastTrigger = null;

  function show(index) {
    currentIndex = (index + triggers.length) % triggers.length; // wraps around at both ends
    const trigger = triggers[currentIndex];
    image.src = trigger.dataset.full;
    image.alt = $("img", trigger).alt;
    caption.textContent = trigger.dataset.caption || "";
  }

  function open(index) {
    lastTrigger = triggers[index];
    show(index);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden"; // stop the page scrolling behind the viewer
  }

  function close() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".gallery-btn");
    if (trigger) open(triggers.indexOf(trigger));
  });

  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(currentIndex - 1));
  $("#lbNext").addEventListener("click", () => show(currentIndex + 1));

  // Click on the dark backdrop (the dialog itself, not its contents) closes the viewer
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });

  // Arrow keys move between images while the viewer is open (Esc is handled by <dialog>)
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(currentIndex - 1);
    if (event.key === "ArrowRight") show(currentIndex + 1);
  });

  dialog.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
    image.removeAttribute("src");                       // an empty src would trigger a pointless request
    if (lastTrigger) lastTrigger.focus();               // give focus back to the photo the user opened
  });
}


/* ==========================================================================
   9. IMAGE FALLBACK & SMALL HELPERS
   ========================================================================== */

// If any photo fails to load (bad URL, offline), swap in a branded local placeholder
// so the layout never shows a broken-image icon. `error` events don't bubble, so we
// listen in the "capture" phase on the document.
function initImageFallback() {
  document.addEventListener("error", (event) => {
    const el = event.target;
    if (!(el instanceof HTMLImageElement)) return;
    if (el.dataset.fallbackApplied) return;             // prevents an infinite loop if the fallback also fails
    el.dataset.fallbackApplied = "true";
    el.src = CONFIG.fallbackImage;
  }, true);
}

function initFooterYear() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}


/* ==========================================================================
   START EVERYTHING
   ========================================================================== */
function init() {
  initImageFallback();      // first, so it catches image errors from the start
  initMobileNav();
  initScrollState();
  initAnchorLinks();
  initActiveNavLink();
  initReveal();
  initMenuFilter();
  initWhatsApp();
  initReservationForm();
  initLightbox();
  initFooterYear();
}

// The script tag uses `defer`, so the HTML is already parsed here. This check is a safety net.
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
