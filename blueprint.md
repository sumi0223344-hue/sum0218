# Blueprint: 섬마을 수석원

## Overview

This document outlines the design and development of the "섬마을 수석원" website. The primary goal is to create a high-quality, multi-page website with rich, original content and a simple content management system (CMS) for the gallery.

## Current State

A high-quality, multi-page static website has been built. The pages include Home, About, Gallery, Contact, and Privacy Policy. The content is currently hard-coded in the HTML files.

## Plan for Admin Feature & Dynamic Gallery

1.  **Integrate Firebase:** The project will be integrated with Google Firebase to provide backend services.
    *   **Firestore Database:** To store gallery item metadata (name, description, size, origin, image URL).
    *   **Firebase Storage:** To host the gallery image files.
    *   **Firebase Authentication:** To secure the admin page.

2.  **Create Admin Portal (`admin.html` & `admin.js`):**
    *   A new `admin.html` page will be created, accessible only to the administrator.
    *   It will be protected by a login mechanism using Firebase Authentication.
    *   The page will contain a form to upload a new stone's image, name, description, size, and origin.
    *   A new `admin.js` file will handle the logic for authentication and uploading data to Firebase Storage and Firestore.

3.  **Dynamically Load Gallery (`gallery.html` & `gallery.js`):
    *   The static items in `gallery.html` will be removed.
    *   A new `gallery.js` script will be created to fetch all gallery items from the Firestore database when the page loads.
    *   The script will dynamically generate the HTML for each gallery item and display them on the page.

4.  **Firebase Configuration:**
    *   Add Firebase SDK scripts to all relevant HTML files.
    *   Create a `firebase-config.js` file to hold the Firebase project configuration, which the user will need to provide.
    *   Initialize Firebase services (Firestore, Storage, Auth) in the project.
