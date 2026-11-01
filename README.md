# Hospital Emergency Management System

An educational browser-based demonstration of the **Hospital Emergency Management System** described in the mini-project presentation. It demonstrates a **Priority Queue** using the following priority levels:

- Priority 1 — Critical
- Priority 2 — Serious
- Priority 3 — Normal

## Features

- Add a patient using Patient ID, name and emergency priority.
- Automatically display patients in priority order (Priority 1 first).
- Mark the highest-priority waiting patient as treated.
- Display the waiting queue and summary counts.
- Search the waiting queue by Patient ID.
- Save the demo queue in the browser using localStorage.

For patients with the same priority, the earlier-added patient remains first (first-in, first-out).

## Run locally

1. Download and extract this ZIP file.
2. Open the extracted folder.
3. Double-click `index.html` to open it in a browser.

No server, package installation or database is required.

## Publish using GitHub Pages

1. Sign in to GitHub and create a **new public repository**, for example `Hospital-Emergency-Management-System`.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository's root folder.
3. Open the repository's **Settings**.
4. Select **Pages** from the left menu.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select branch **main** and folder **/(root)**, then click **Save**.
7. Wait for GitHub Pages to publish the site. Refresh the Pages screen if needed.
8. Copy the published URL, usually:
   `https://YOUR-USERNAME.github.io/Hospital-Emergency-Management-System/`

Replace `YOUR-USERNAME` with your GitHub username and use the exact URL displayed by GitHub Pages.

## Important note

This is a student project demonstration only. It is not a real hospital information system and must not be used to make clinical decisions or store real patient information. The priority labels are illustrative and do not replace professional triage or medical judgement. Data is stored only in the current browser's local storage; it is not shared with other users or devices.
