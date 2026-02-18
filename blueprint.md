
# Blueprint: 섬마을 수석원 (Seommaeul Suseokwon) Website

## 1. Project Overview

This project is to create a sophisticated, modern, and visually appealing single-page website for "섬마을 수석원". The goal is to create an online presence that reflects the elegance, tranquility, and artistic value of *suseok* (viewing stones). The site will be a single, immersive page that guides the user through the story and collection of the gallery.

## 2. Design & Style Philosophy

*   **Aesthetic:** Minimalist, elegant, and premium. The design will prioritize clean space, high-quality visuals, and a tranquil user experience.
*   **Color Palette:** A nature-inspired palette using modern `oklch` color spaces for vibrancy and subtlety.
*   **Typography:** Classic Serif for headings, clean Sans-serif for body text.
*   **Visuals & Effects:** Full-screen hero, multi-layered drop shadows, and subtle interactive animations.
*   **Layout:** A responsive, single-page layout using modern CSS (Flexbox, Grid).

## 3. Features & Implemented Plan

### Version 1: Initial Build

*   **Structure:** Set up a single-page application with `index.html`, `style.css`, and `main.js`.
*   **Sections:** Created Header, Hero, Introduction (`#intro`), Gallery (`#gallery`), Philosophy (`#philosophy`), and Footer sections.
*   **Components:** Implemented a `<stone-card>` Web Component to display individual stones.

### Version 2: Gallery Update

*   **Rename:** Changed "Gallery" to "Suseok Sale" (`#sale`).
*   **Layout:** Enhanced the grid layout to be more album-like.
*   **Deployment:** Deployed changes via Git.

---

## 4. Current Request: Admin, AdSense, & Mobile UX

*   **Goal:** Implement a secure admin page for managing sale items, prepare the site for Google AdSense approval, improve mobile responsiveness, and update footer details.

### Action Plan

1.  **Footer & AdSense Prep:**
    *   Update the footer in `index.html` with the new copyright year and address.
    *   Create a comprehensive `privacy.html` page, which is crucial for AdSense. This page will include sections on data collection, cookies, and AdSense itself.
    *   Add a link to the new `privacy.html` in the footer of all user-facing pages.

2.  **Mobile Responsiveness:**
    *   In `style.css`, add `@media` queries to ensure the layout, typography, and navigation are optimized for mobile and tablet screen sizes.
    *   Ensure the `sale-grid` and `philosophy-grid` adapt to a single-column layout on smaller screens.

3.  **Admin Page Setup (with Firebase):**
    *   Create a secure admin area composed of a login page (`admin.html`) and a dashboard (`admin-dashboard.html`).
    *   Set up Firebase in the project by creating `.idx/mcp.json` and a Firebase config file.
    *   Implement Firebase Authentication for the admin login.
    *   Create a form in the admin dashboard to upload new stone images to Firebase Storage and save their details (title, size, origin) to a Firestore database.

4.  **Dynamic Gallery Integration:**
    *   Modify `main.js` to fetch stone data dynamically from the Firestore database instead of using hardcoded HTML in `index.html`.
    *   The `stone-card` components will be generated based on the data retrieved from the database.

5.  **Deployment:**
    *   Stage all new and modified files using `git add .`.
    *   Commit the changes with a descriptive message.
    *   Push the final, error-free version to the `main` branch.
