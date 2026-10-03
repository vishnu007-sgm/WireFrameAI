# Wireframe AI

Draw a screen or upload a wireframe (PNG, JPG or PDF). Gemma 4 reads it and writes three working UI designs in Tailwind CSS. Then ask for changes in plain words.

**Problem:** turning a hand-drawn wireframe into working front-end code is slow and repetitive.

## How it works
1. **Input:** draw on the built-in canvas or upload an image or PDF. Optional style notes steer the result.
2. **Read:** Gemma 4 (via the Gemini API) returns a JSON inventory of every element it sees.
3. **Write:** three Gemma 4 calls run in parallel, one per direction (Clean Modern, Compact Enterprise, Bold Editorial). Results stream into the UI as they finish.
4. **Check (plain code, no model):** the backend confirms each detected element appears in each design and shows the match rate.
5. **Refine:** type a change, Gemma 4 edits the design, the check runs again. Undo restores the previous version.
6. **Export:** copy or download standalone HTML (Tailwind), or convert to a React component.

The live preview runs in a sandboxed iframe. Scripts, links and inline event handlers are stripped from generated code before it is shown.

## Model
Gemma 4 through the Gemini API. The model ID is set with `GEMMA_MODEL` and shown in the UI header.

## Setup
```bash
# backend
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # then add your key and model ID
uvicorn main:app --reload --port 8000

# frontend (second terminal)
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. The preview loads Tailwind from a CDN, so it needs internet.

## Limits
Works best on clear, simple wireframes. Handwriting can be misread. The match rate checks that detected elements are present, not that the layout is pixel-perfect.

## Not built yet
Offline PWA and saved history, Fabric.js stencils, multi-page flows, Figma and Storybook export, full-stack scaffolding.

## How AI tools helped
- Gemma 4: reads the drawing, writes and edits the code.
- GitHub Copilot: add specific examples here (for instance "generated the FastAPI upload route").
- Snowflake CoCo: not used in this project.

## License
MIT
