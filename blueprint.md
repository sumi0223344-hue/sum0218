
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

### Version 3: Admin, AdSense, & Mobile UX

*   **Admin Page:** Created a secure admin area (`/admin.html`, `/admin-dashboard.html`) with Firebase for login and dynamic item management (Create, Read, Delete).
*   **Dynamic Gallery:** The main gallery now fetches and displays stone data directly from the Firestore database.
*   **AdSense Prep:** Added a `privacy.html` page and linked it in the footer.
*   **Mobile UX:** Implemented responsive design using media queries for better mobile viewing.

---

## 4. Current Request: Static Fallback for Gallery

*   **Goal:** Ensure the website's gallery is visually functional even without a database connection by providing static fallback data.

### Action Plan

1.  **Modify `main.js`:**
    *   Create a function `loadStaticStones()` that populates the gallery with a predefined set of sample suseok data.
    *   Update the existing data fetching logic. If the Firebase connection fails or is not configured, call `loadStaticStones()` to display the sample data instead of an error message.
    *   This ensures the gallery is never empty, improving the user experience for first-time visitors or in development environments.

2.  **Deployment:**
    *   Stage and commit the changes.
    *   Push the updated version to the `main` branch.
