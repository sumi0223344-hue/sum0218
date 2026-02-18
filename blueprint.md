
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
*   **Components:** Implemented a `<stone-card>` Web Component to display individual stones with their image, title, description, size, and origin.
*   **Styling:** Applied a modern stylesheet using CSS Layers, custom properties, and a responsive grid layout for the gallery.

---

## 4. Current Request: Gallery Update & Deployment

*   **Goal:** Change the "Gallery" section to a "Suseok Sale" section with a more album-like feel, and then deploy the site via Git.

### Action Plan

1.  **Rename Section:**
    *   In `index.html`, change the navigation link from "갤러리" to "수석판매".
    *   Update the corresponding section `id` from `gallery` to `sale`.
    *   Change the section heading `<h2>` from "대표 수석" to "수석 판매".

2.  **Enhance Album Layout:**
    *   In `style.css`, update the selectors from `#gallery` and `.gallery-grid` to `#sale` and `.sale-grid` respectively.
    *   Modify the grid layout for `.sale-grid` to present the stone cards in a more prominent, album-style format. The cards will be made slightly larger and more focused.

3.  **Deploy via Git:**
    *   Stage all changes using `git add .`.
    *   Commit the changes with a descriptive message.
    *   Push the commit to the `main` branch on the remote repository.
