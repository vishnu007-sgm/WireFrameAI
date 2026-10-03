import { useState } from "react";

export default function EditBox({ onEdit, onUndo, canUndo }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      await onEdit(text.trim());
      setText("");
    } catch (ex) {
      setErr(ex.message);
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe a change, e.g. replace the small circle buttons with rectangular boxes with bold labels"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        <button disabled={busy} className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold disabled:opacity-50">
          {busy ? "Editing..." : "Apply change"}
        </button>
        <button type="button" onClick={onUndo} disabled={!canUndo || busy} className="px-4 py-2 rounded-md border bg-white text-sm disabled:opacity-40">
          Undo
        </button>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
