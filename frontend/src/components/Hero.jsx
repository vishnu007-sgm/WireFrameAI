export default function Hero({ onUpload, onDraw }) {
  return (
    <section className="hero card">
      <div className="hero-text">
        <span className="badge pill">AI SKETCH TO CODE</span>
        <h1>
          Sketch
          <br />
          <span className="grad">to Code</span>
        </h1>
        <p>
          Draw a screen or upload a wireframe. Gemma 4 reads it and writes three working designs in Tailwind.
          Then ask for changes in plain words.
        </p>
        <div className="actions">
          <button className="btn" onClick={onUpload}>Upload a sketch</button>
          <button className="btn ghost" onClick={onDraw}>Draw one</button>
        </div>
        <small className="note">Every detected element is checked against the code, so nothing you drew goes missing.</small>
      </div>
      <div className="stack" aria-hidden="true">
        <i className="blob b1" />
        <i className="blob b2" />
        <div className="layer l1">SKETCH</div>
        <div className="layer l2">GEMMA 4</div>
        <div className="layer l3">CODE</div>
      </div>
    </section>
  )
}
