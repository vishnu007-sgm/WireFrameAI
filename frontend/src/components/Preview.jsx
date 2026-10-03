import { useState } from "react";

export const wrap = (body) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script src="https://cdn.tailwindcss.com"></script></head><body>${body}</body></html>`;

export default function Preview({ html, check }) {
  const [tab, setTab] = useState("preview");

  const copy = () => navigator.clipboard.writeText(wrap(html));
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([wrap(html)], { type: "text/html" }));
    a.download = "wireframe-ai-design.html";
    a.click();
  };
  const t = (n) => `px-3 py-1 text-sm font-semibold rounded ${tab === n ? "bg-slate-900 text-white" : "bg-white border"}`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button className={t("preview")} onClick={() => setTab("preview")}>Live preview</button>
        <button className={t("code")} onClick={() => setTab("code")}>Code</button>
        <span className="flex-1" />
        {check && check.total > 0 && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${check.matched === check.total ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            Elements matched: {check.matched}/{check.total}
          </span>
        )}
        <button onClick={copy} className="px-3 py-1 text-sm bg-white border rounded">Copy HTML</button>
        <button onClick={download} className="px-3 py-1 text-sm bg-white border rounded">Download</button>
      </div>
      {check && check.missing?.length > 0 && (
        <p className="text-xs text-amber-800">Missing from design: {check.missing.join(", ")}</p>
      )}
      {tab === "preview" ? (
        <iframe title="preview" sandbox="allow-scripts" srcDoc={wrap(html)} className="w-full h-[560px] bg-white border rounded-md" />
      ) : (
        <pre className="h-[560px] overflow-auto bg-slate-900 text-slate-100 text-xs p-3 rounded-md whitespace-pre-wrap">{html}</pre>
      )}
    </div>
  );
}
