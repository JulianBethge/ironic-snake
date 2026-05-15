# Change Log

## [fix] Bug Fixes Session 1 (15.05.2026)

- **B1** `index.html` — Doppeltes `class`-Attribut auf `.sides`-Div gefixt (`class="sides" class="flex"` → `class="sides flex"`). `flex: 1` zu `.sides` in CSS hinzugefügt damit das Board zentriert bleibt.
- **B2** `main.js` — OK-Button Event Listener von `showSettings()` nach `setupHud()` verschoben. Verhindert dass bei jedem Pausieren ein neuer Listener gestapelt wird.
- **B5** `main.js` — Reihenfolge im Game Loop korrigiert: Richtung einlesen → Bewegen → Fruit-Collision → Status prüfen. Vorher wurde die Frucht mit 1-Tick-Verzögerung gefressen.
