import { useEffect, useState } from "react";
import { getInfo, analyze, design, edit } from "./api";
import Upload from "./components/Upload";
import Preview from "./components/Preview";
import EditBox from "./components/EditBox";

const DIRECTIONS = ["Clean Modern", "Compact Enterprise", "Bold Editorial"];

export default function App() {
  const [info, setInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [elements, setElements] = useState([]);
  const [designs, setDesigns] = useState({});
  const [active, setActive] = useState(DIRECTIONS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getInfo().then(setInfo).catch(() => setError("Backend not reachable. Start uvicorn on port 8000."));
  }, []);

  async function generate() {
    if (!file) return setError("Upload or draw a wireframe first.");
    setError("");
    setBusy(true);
    setDesigns(Object.fromEntries(DIRECTIONS.map((d) => [d, { status: "loading", history: [] }])));
    try {
      const els = await analyze(file, notes);
      setElements(els);
      await Promise.all(
        DIRECTIONS.map(async (d) => {
          try {
            const r = await design(file, d, els, notes);
            setDesigns((p) => ({ ...p, [d]: { status: "done", history: [r] } }));
          } catch (e) {
            setDesigns((p) => ({ ...p, [d]: { status: "error", history: [], error: e.message } }));
          }
        })
      );
    } catch (e) {
      setError(e.message);
      setDesigns({});
    }
    setBusy(false);
  }

  async function applyEdit(instruction) {
    const cur = designs[active].history.at(-1);
    const r = await edit(cur.html, instruction, elements);
    setDesigns((p) => ({ ...p, [active]: { ...p[active], history: [...p[active].history, r] } }));
  }

  function undo() {
    setDesigns((p) => {
      const h = p[active].history;
      return h.length < 2 ? p : { ...p, [active]: { ...p[active], history: h.slice(0, -1) } };
    });
  }

  const cur = designs[active];
  const latest = cur?.history?.at(-1);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Wireframe AI</h1>
        <span className="text-xs text-slate-600">
          {info ? `Model: ${info.model} via ${info.provider}` : "Connecting to backend..."}
        </span>
      </header>

      <section className="bg-white rounded-lg border p-4 space-y-3">
        <Upload onFile={setFile} />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional style notes (e.g. dark theme, use blue buttons)"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <button onClick={generate} disabled={busy} className="px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-50">
          {busy ? "Gemma 4 is building..." : "Generate 3 designs"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </section>

      {Object.keys(designs).length > 0 && (
        <section className="bg-white rounded-lg border p-4 space-y-3">
          <div className="flex gap-2">
            {DIRECTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setActive(d)}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${active === d ? "bg-slate-900 text-white" : "bg-white border"}`}
              >
                {d} {designs[d]?.status === "loading" ? "..." : designs[d]?.status === "error" ? "(failed)" : ""}
              </button>
            ))}
          </div>
          {cur?.status === "loading" && <p className="text-sm text-slate-600 py-10 text-center">Generating {active}...</p>}
          {cur?.status === "error" && <p className="text-sm text-red-600">{cur.error}</p>}
          {latest && (
            <>
              <Preview html={latest.html} check={latest.check} />
              <EditBox onEdit={applyEdit} onUndo={undo} canUndo={cur.history.length > 1} />
            </>
          )}
        </section>
      )}
    </div>
  );
}
