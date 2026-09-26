# Menu (Navigation) import files — Matrixify

These CSVs rebuild the store's **Main menu** (`main-menu`) — the full category
hierarchy that powers the header mega menu, the "View catalog" dropdown, and the
"•••" overflow. Kept here for reference / re-import if the menu ever needs rebuilding.

## Structure the menu builds
7 top categories (+ Sale) → column headings → sub-links (3 levels), 79 items total.
Links point to collections by handle (Strength & Weights → `strength-weights`, etc.).

## `free-plan-split/` — USE THESE (Matrixify free/Demo plan = 10 items per import)
Import **in order, one at a time**, waiting for each to finish:

1. `01-top-categories.csv` — the 8 top categories. **Command REPLACE** (wipes the
   default Home/Catalog/Contact and installs the categories).
2. `02-headings-1.csv`, `03-headings-2.csv` — the column headings (MERGE), nested
   under the categories by `Menu Item: Parent Title`.
3. `04-links-1.csv` … `09-links-6.csv` — the sub-links (MERGE), nested under the
   headings.

Order matters: headings must exist before links, categories before headings.

## `subhan-main-menu-SINGLE-FILE.csv` — reference only
The whole menu in one file (for a PAID Matrixify plan with no 10-item cap). This is
the earlier single-file version; the split files above supersede it on the free plan.

## Format notes (what made the import succeed)
- Type column must be **`Menu Item: Resource Type`** = `Collection` (NOT `Menu Item: Type`).
- **`Menu Item: Resource Handle`** = the collection handle (e.g. `dumbbells`).
- **`Menu Item: Parent Title`** links a child to its parent by the parent's exact title.
- Each item row carries **`Menu Item: Command`** = `MERGE`.

## Editing later
Once imported, manage everything in **Online Store → Navigation → Main menu** — no
re-import needed. Re-importing `01` (REPLACE) rebuilds the whole menu from scratch.
