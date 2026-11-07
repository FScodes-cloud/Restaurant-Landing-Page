# LUMIÈRE — Restaurant & Dining

**Project ID:** RST-001 · **Industry:** Food & Hospitality · **Challenge:** Day 01 / 30

A premium, fully responsive restaurant landing page built with **HTML5, CSS3 and Vanilla JavaScript only** (no frameworks). LUMIÈRE is a **fictional restaurant** created for a front-end portfolio. Its address, phone number, email, reviews and prices are placeholders.

> **Tagline:** "An unforgettable dining experience, crafted with passion."

---

## Screenshots

> Add your own screenshots after running the project locally, then replace the placeholders below.

| Desktop | Tablet | Mobile |
| --- | --- | --- |
| `docs/screenshot-desktop.png` | `docs/screenshot-tablet.png` | `docs/screenshot-mobile.png` |

Tip: in Chrome, press `F12`, open the device toolbar (`Ctrl/Cmd + Shift + M`) and capture each size.

---

## Business Problem

The (fictional) restaurant owner faces these problems:

1. Customers cannot easily discover the restaurant online.
2. Customers keep phoning to ask about menus and prices.
3. There is no professional digital presence.
4. Booking a table is difficult.
5. The dining experience is hard to communicate.
6. The address and opening hours are hard to find.

## Project Objectives

**Primary:** increase table-reservation inquiries and attract new customers.

**Secondary:** build a premium identity, showcase food and atmosphere, publish the menu with prices, make practical info easy to find, and build trust with testimonials.

| Problem | How the site answers it |
| --- | --- |
| Hard to discover | SEO metadata, semantic HTML, fast-loading page |
| Phone calls about menu/prices | Filterable menu with prices on the page |
| No professional presence | Premium visual identity and photography |
| Hard to book | Reservation form in the navigation, hero, specials and footer |
| Experience hard to convey | About story, chef's specials, gallery, testimonials |
| Address/hours hard to find | Dedicated contact section, map area and WhatsApp button |

---

## Main Features

- **Sticky navigation** with a mobile hamburger menu (ARIA-labelled, closes on link click or `Esc`)
- **Full-screen hero** with a high-contrast overlay and two clear calls to action
- **Editorial About section** (story, philosophy, chef introduction)
- **Interactive menu**: 10 dishes with category filtering (All, Starters, Main Course, Desserts, Drinks) and a screen-reader status message
- **Chef's Specials** with ingredients, prices and reservation buttons
- **Responsive gallery** (CSS Grid) with an accessible **lightbox** built on the native `<dialog>` element (arrow keys, `Esc`, focus return)
- **Reservation form** with inline validation, an error summary, a success message and duplicate-submit protection
- **Testimonials** (three clearly fictional sample reviews)
- **Contact & location** with opening hours, a demo map and a **WhatsApp** link with a prefilled message
- **Back-to-top button**, **active nav highlighting** and **smooth scrolling** (disabled for users who prefer reduced motion)

### Design system

| Token | Value |
| --- | --- |
| Forest Black | `#171A17` |
| Warm Cream | `#F5F0E7` |
| Gold Accent | `#B58A56` |
| White | `#FFFFFF` |
| Deep Gold (extra) | `#8A6434`, used for gold *text* on cream so contrast stays above 4.5:1 |

Fonts: **Playfair Display** (headings) and **Inter** (body), loaded from Google Fonts.

### Performance & motion rules

- Only `transform` and `opacity` are animated for movement (the compositor-friendly properties).
- No `scroll` event listeners. `IntersectionObserver` handles the sticky-header state, back-to-top button, reveal animations and active nav link.
- Below-the-fold images use `loading="lazy"` and have `width`/`height` to prevent layout shift.
- `prefers-reduced-motion` turns off smooth scrolling and all animations.

---

## Reservation Form: Frontend-Only

**The reservation form does not send, store or process anything.** It validates input in the browser and shows a confirmation message to demonstrate the user experience.

Real reservations require one of:

- a **backend** (Node.js, PHP, Python, etc.) that receives the data, saves it and emails the restaurant, or
- a **third-party booking service** (e.g. OpenTable, Resy, Tock, or a form service such as Formspree), or
- the restaurant's existing booking system's API.

Validation rules: name (letters only, min 2), email format, phone (7–15 digits), date (not in the past, within 90 days), time (a same-day request must be at least 60 minutes ahead), guests (whole number 1–12). All limits live in the `CONFIG` object at the top of `js/script.js`.

---

## Technology Stack

- HTML5 (semantic elements, ARIA where needed)
- CSS3 (custom properties, Grid, Flexbox, `clamp()` fluid type, media queries)
- Vanilla JavaScript (ES6+)
- Google Fonts (Playfair Display, Inter)
- Inline SVG icon sprite
- Photography from Unsplash (see *Limitations*)

## Folder Structure

```
restaurant-landing-page/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   ├── images/
│   │   └── image-fallback.svg
│   └── icons/
│
└── README.md
```

## Installation

No installation or build step is needed. There are no dependencies.

## How to Run Locally

**Option 1: open the file.** Double-click `index.html`.

**Option 2: a local server (recommended).**

```bash
# from inside the restaurant-landing-page folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or use the **Live Server** extension in VS Code (right-click `index.html` → *Open with Live Server*).

The page needs an internet connection for Google Fonts and the photographs. Without it, text falls back to system fonts and images fall back to a local placeholder.

---

## Testing Checklist

- [ ] All nine sections display
- [ ] Desktop nav links scroll to the right sections
- [ ] Mobile menu opens, closes (link, `Esc`, outside tap)
- [ ] Each menu filter shows only matching dishes
- [ ] Submitting an empty form shows errors; fixing them lets you submit
- [ ] A past date and a 13-guest booking are rejected
- [ ] Double-clicking *Request Reservation* only submits once
- [ ] WhatsApp button opens `wa.me` with the prefilled message
- [ ] Lightbox opens, arrow keys and `Esc` work, focus returns to the thumbnail
- [ ] No horizontal scrolling at 320px
- [ ] Tab through the page: every control has a visible focus ring
- [ ] Turn on "Reduce motion" in your OS: animations stop

---

## Limitations

- **Reservations are not real** (frontend-only demo, see above).
- **All business details are fictional**: address, phone, email, chef, reviews, prices and hours. Social links are placeholders (`#`).
- **Photographs are hot-linked from Unsplash.** If you plan to use this commercially, download the images you keep, optimise them (WebP/AVIF, multiple sizes), store them in `assets/images/`, and update the `src` values. Check each image still exists. Dish photos are chosen to be representative, so match photos to dish names before showing this to a real client.
- **The map is an illustration**, not a live map.
- No analytics, cookie banner, or multi-language support.

## Future Improvements

- Connect the form to a real backend or booking API
- Replace the illustrated map with an embedded map of the real location
- Self-host optimised images with `srcset` / `<picture>`
- Add a downloadable PDF menu and dietary icons (vegan, gluten-free)
- Online ordering or gift-voucher section
- Structured data (`schema.org/Restaurant`) for richer search results
- Dark/light theme toggle and multi-language support
- Automated accessibility and Lighthouse checks in CI

---

## Credits

Photography: [Unsplash](https://unsplash.com) contributors. Built as **Day 01** of a 30-Day Real-World Landing Page Challenge.
