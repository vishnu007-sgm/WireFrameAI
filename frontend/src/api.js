async function j(res) {
  if (!res.ok) {
    let m = res.statusText;
    try { m = (await res.json()).detail || m; } catch { /* ignore */ }
    throw new Error(m);
  }
  return res.json();
}

export const getInfo = () => fetch("/api/info").then(j);

export function analyze(file, notes) {
  const f = new FormData();
  f.append("file", file);
  f.append("notes", notes);
  return fetch("/api/analyze", { method: "POST", body: f }).then(j).then((r) => r.elements);
}

export function design(file, direction, elements, notes) {
  const f = new FormData();
  f.append("file", file);
  f.append("direction", direction);
  f.append("elements", JSON.stringify(elements));
  f.append("notes", notes);
  return fetch("/api/design", { method: "POST", body: f }).then(j);
}

export const edit = (html, instruction, elements) =>
  fetch("/api/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, instruction, elements }),
  }).then(j);
