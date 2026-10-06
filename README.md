# Ruins of Ember
Original Three.js action RPG arena inspired by the supplied fantasy combat reference. Lead Arin, Lyra, and Bram against the Ember Guardian in a procedural ruined fortress. The game uses original stylized characters and geometry rather than recreating the reference's licensed characters or photorealistic artwork.

## Run
Node.js 22 or newer. `npm install`, then `npm run dev`. Open the displayed localhost URL. `npm run build` produces a static website in dist, suitable for serving over HTTP. Do not open index.html directly with file://.

## Controls
WASD or arrow keys move across the arena. J attacks, K uses a ranged ember ability, H uses a healing potion, Space dodges, and L blocks while held. 1/2/3 select Arin/Lyra/Bram. Escape pauses. The command menu provides clickable attacks, abilities, potions, and dodge. On narrow/touch screens, directional buttons and a held block button are shown. Party cards switch characters. Restart resets the encounter.

## Encounter
Each hero has distinct health, basic attack damage, and range. Abilities cost 30 mana and have a cooldown. Dodge costs 15 mana and grants a short invulnerability interval; movement during the interval travels faster. Mana regenerates. Three potions restore bounded health. Companions follow and attack nearby enemies. The guardian pursues the selected hero, telegraphs a red circular slam, attacks the marked area, and enters recovery. Move outside the circle, dodge, or block to reduce damage. Low boss health shortens the delay between attacks. Defeat the guardian to win; losing every party member ends the encounter. Defeated heroes cannot be selected.

## Tests
`npm test` runs 12 combat-rule tests. `npm run build` checks the production bundle. The optional Python Playwright test is `tests/browser_check.py`; set CHROMIUM_PATH when using a custom browser executable. Browser checks cover actual WebGL rendering and desktop/mobile controls. docs contains rendered screenshots and a browser report.

## Scope
Local single-player arcade prototype, no multiplayer, campaign persistence, imported animations, voice/music, or photorealistic models. Attacks use range checks, not full weapon-mesh collisions; movement is bounded to the arena and does not collide with scenery. Mobile layout and simulated pointer controls are tested; physical iPhone/Android devices remain untested. HUD values come from the running combat simulation.

## Commit history
Separate implementation commits record actual work, with no backdating. artifacts/ThreeJS-Fighting-Game.bundle preserves the original local commit identifiers alongside the imported GitHub history.
