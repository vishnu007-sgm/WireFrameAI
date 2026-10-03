import { useEffect, useRef, useState } from "react";

export default function Upload({ onFile }) {
  const [mode, setMode] = useState("upload");
  const [name, setName] = useState("");
  const ref = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (mode !== "draw") return;
    const c = ref.current;
    const x = c.getContext("2d");
    x.fillStyle = "#fff";
    x.fillRect(0, 0, c.width, c.height);
    x.lineWidth = 3;
    x.lineCap = "round";
    x.strokeStyle = "#111";
  }, [mode]);

  const pos = (e) => {
    const c = ref.current, r = c.getBoundingClientRect();
    return [((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height];
  };
  const down = (e) => {
    drawing.current = true;
    const x = ref.current.getContext("2d"), [px, py] = pos(e);
    x.beginPath();
    x.moveTo(px, py);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const x = ref.current.getContext("2d"), [px, py] = pos(e);
    x.lineTo(px, py);
    x.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    ref.current.toBlob((b) => {
      onFile(new File([b], "drawing.png", { type: "image/png" }));
      setName("drawing.png");
    }, "image/png");
  };
  const clear = () => {
    const c = ref.current, x = c.getContext("2d");
    x.fillStyle = "#fff";
    x.fillRect(0, 0, c.width, c.height);
    onFile(null);
    setName("");
  };

  const tab = (m) =>
    `px-4 py-1.5 rounded-md text-sm font-semibold ${mode === m ? "bg-slate-900 text-white" : "bg-white border"}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className={tab("upload")} onClick={() => setMode("upload")}>Upload</button>
        <button className={tab("draw")} onClick={() => setMode("draw")}>Draw</button>
      </div>
      {mode === "upload" ? (
        <input
          type="file"
          accept="image/*,.pdf"
          className="block w-full text-sm border rounded-md bg-white p-2"
          onChange={(e) => {
            const f = e.target.files[0] || null;
            onFile(f);
            setName(f ? f.name : "");
          }}
        />
      ) : (
        <div>
          <canvas
            ref={ref}
            width={800}
            height={500}
            style={{ touchAction: "none" }}
            className="w-full border rounded-md bg-white cursor-crosshair"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerLeave={up}
          />
          <button onClick={clear} className="mt-2 text-sm underline">Clear drawing</button>
        </div>
      )}
      {name && <p className="text-sm text-slate-600">Ready: {name}</p>}
    </div>
  );
}
