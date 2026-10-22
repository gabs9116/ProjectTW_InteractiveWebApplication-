# Genshin Impact Fan Web App & Character Creator

A frontend web project built from scratch using plain JavaScript, HTML5, and CSS. The project was developed as part of my Web Development coursework to practice client-side state handling, responsive design, and browser APIs without using external frameworks.

## What it does

- **Character Creator:** An interactive form that lets you design custom characters (element, weapon, custom hex colors, lore). It uses Regex for input validation.
- **Data Persistence:** Uses `localStorage` to save, display, and delete custom characters, and `sessionStorage` to keep track of the logged-in user profile.
- **Countdown Canvas:** A 2D canvas animation that calculates and displays a countdown timer, with support for pause/resume on click.
- **Daily Reward System:** A simple daily check-in button that tracks claims and resets automatically after 24 hours.
- **Inspirations Fetch:** An asynchronous call (`fetch API`) that loads random character concepts from a local `characters.json` file.
- **Responsive Layout:** Adaptive styling using Flexbox, CSS Grid, and media queries for mobile and desktop screens.

## Technologies

- JavaScript (ES6+)
- HTML5 (Canvas API, Semantic tags)
- CSS3 (Flexbox, Grid, CSS Variables)
- Web Storage API (`localStorage` & `sessionStorage`)
