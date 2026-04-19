# RNGredients

**RNGredients** is a gamified meal prep and recipe discovery application that solves the universal problem of "What's for dinner?" by combining pantry inventory management with a retro, gacha-style recipe roller.

## The Story: A Claude Project Through and Through

From the initial sparks of an idea to the final marketing materials, RNGredients is a **Claude project through and through**. 

### 1. Problem Evaluation
Claude was used extensively in combination with `gstack` (Google Workspace) and various office-tools to evaluate the core problem space. By analyzing user behavior, we identified the three major pain points of modern cooking:
- **Decision Fatigue:** The daily struggle of choosing what to cook.
- **Food Waste:** Ingredients expiring in the back of the fridge.
- **Lack of Workflow:** Inefficient meal planning and grocery routines.

### 2. Functional Requirements
Once the problem was evaluated, Claude structured the entire solution. The deep, functional requirements of the app were generated and split into a series of highly detailed Markdown files. You can find these in the `docs/` directory:
- `architecture.md`: Core architecture, game loop, and data models.
- `features.md`: Feature trees, screen wireframes, and task priorities.
- `DESIGN.md`: Master implementation specs including DB schemas, APIs, and the RNG loot table.
- `themes.md`: The 15 retro color palettes and UI design tokens.
- `ingredients.md`, `appliances.md`, `calorie_calc.md`, and more.

### 3. Marketing & Pitch Design
When it came time to sell the vision, Claude's design capabilities were used to build the marketing materials. Claude fully designed and coded a standalone, pixel-perfect, interactive pitch deck.

🎮 **Pitch Deck Presentation:**

<iframe src="RNGredients Pitch.html" width="100%" height="700px" style="border: 2px solid #2a2050; border-radius: 8px; margin-top: 10px;" allowfullscreen>
  <p>Your browser does not support iframes. <a href="RNGredients Pitch.html">Click here to view the pitch.</a></p>
</iframe>

## Getting Started

For detailed build commands, execution phases, and architectural notes, please see [CLAUDE.md](CLAUDE.md).

### Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend:** FastAPI (Python 3.11+)
- **Database:** Supabase (PostgreSQL)

### Quick Start (Frontend Mockup)
```bash
cd frontend
npm install
npm run dev
```
