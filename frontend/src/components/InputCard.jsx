import { useEffect, useState } from 'react'
import SketchPad from './SketchPad'

export default function InputCard({ tab, setTab, file, setFile, padRef, notes, setNotes, onGenerate, busy }) {
  const [thumb, setThumb] = useState('')

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const u = URL.createObjectURL(file)
      setThumb(u)
      return () => URL.revokeObjectURL(u)
    }
    setThumb('')
  }, [file])

  const pick = (f) => f && setFile(f)

  return (
    <section className="card tone-blue" id="input">
      <div className="card-head">
        <span className="ico">✏️</span> Your sketch
        <span className="badge pill">INPUT</span>
      </div>
      <div className="card-body">
        <div className="seg">
          <button className={tab === 'upload' ? 'on' : ''} onClick={() => setTab('upload')}>Upload</button>
          <button className={tab === 'draw' ? 'on' : ''} onClick={() => setTab('draw')}>Draw</button>
        </div>

        <div style={{ display: tab === 'upload' ? 'block' : 'none' }}>
          <label
            className="drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]) }}
          >
            <input
              type="file" hidden accept="image/png,image/jpeg,application/pdf"
              onChange={(e) => { pick(e.target.files[0]); e.target.value = '' }}
            />
            {thumb ? <img src={thumb} alt="Your uploaded sketch" /> : <strong>Drop a wireframe, mockup or flowchart</strong>}
            <span>{file ? file.name : 'PNG, JPG or PDF (first page)'}</span>
          </label>
        </div>

        <div style={{ display: tab === 'draw' ? 'block' : 'none' }}>
          <SketchPad ref={padRef} />
        </div>

        <label className="field">
          <span className="label">STYLE NOTES (OPTIONAL)</span>
          <textarea
            rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. dark theme, blue accent, sidebar navigation"
          />
        </label>

        <button className="btn wide" onClick={onGenerate} disabled={busy}>
          {busy ? 'Gemma 4 is working…' : 'Generate 3 designs'}
        </button>
      </div>
    </section>
  )
}
