# Toronto Hoodman — The 6ix RPG (Website)

A playable, Toronto-inspired browser RPG with a dark dashboard UI, character creation, six districts, missions, d20 skill checks, inventory/shop, reputation, crew naming, and save import/export.

## Play it locally

**Fastest method:** open `index.html` in a modern browser. The core game runs client-side and saves progress in that browser's local storage.

For a local web server (recommended):

```bash
# Python 3
python -m http.server 8000
```

Then open http://localhost:8000.

No Node.js, database, Discord bot, API key, or build step is required for this website version.

## Publish it as a GitHub Pages website

1. Create a new GitHub repository, for example `toronto-hoodman`.
2. Upload `index.html`, `styles.css`, `app.js`, and this `README.md` to the repository root.
3. Commit the files to the `main` branch.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then save.
7. Wait for GitHub Pages to publish the site. The URL will be shown in Settings → Pages.

The website is static, so GitHub Pages can host it without a server. Google Fonts are used for typography; if those are blocked, the page falls back to system fonts.

## Included game systems

- Character creation: five classes and four backgrounds
- Five stats: Brains, Talk, Muscle, Street Smarts, Clout
- Stat modifiers and d20 skill checks against difficulty targets
- Six fictional Toronto-inspired districts with travel
- Eight starter missions with different checks and rewards
- XP, levels, money, HP, reputation, and mission completion
- Inventory and shop, including consumable healing items and gear bonuses
- Crew naming and district reputation
- Activity log, daily flavour text, and quick dice rolls
- Local autosave plus JSON save export/import
- Responsive layout for desktop and mobile

## Important multiplayer limitation

This version is a **working browser game with a local save per browser**. It does not yet synchronize player actions between different people or devices. A public shared multiplayer world requires a backend and database (for example, Supabase or a custom Node.js API), authentication, and server-side validation for dice rolls, money, inventory, and mission rewards. GitHub Pages alone cannot run that backend.

The current release includes the planned multiplayer-themed systems and campaign UI, but it is not yet online multiplayer. Do not use the local client as an authoritative economy for a competitive game because browser saves can be edited.

## Save data

- Progress autosaves to local storage in the current browser.
- Use **Save & settings → Export save file** to back up your campaign.
- Use **Import save file** to restore it on another browser.
- Clearing browser storage can erase your local save; export a backup first.
- Reset campaign permanently clears the current local campaign after confirmation.

## Project files

```text
toronto-hoodman-website/
├── index.html   # All page structure and dialogs
├── styles.css   # Responsive visual design
├── app.js       # Game state, rules, missions, and UI interactions
├── README.md    # Setup, publishing, and game limitations
└── LICENSE      # MIT license
```

## Next upgrades

1. Add a hosted multiplayer backend and accounts.
2. Add real turn-by-turn encounters with enemy turns, defence, damage, and downed states.
3. Add party invites, shared missions, and crew membership.
4. Add business ownership, equipment slots, faction storylines, and branching quests.
5. Add server-authoritative saves, rate limits, backups, and moderation tools.

## License

MIT — see `LICENSE`.
