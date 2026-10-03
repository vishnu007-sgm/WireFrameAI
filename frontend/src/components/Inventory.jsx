export default function Inventory({ inventory, recall }) {
  const els = inventory.elements || []
  return (
    <section className="card tone-teal">
      <div className="card-head">
        <span className="ico">🔍</span> What Gemma 4 saw
        <span className="badge pill">CHECKED BY CODE</span>
      </div>
      <div className="card-body">
        <p className="muted">{inventory.screen_title || 'Untitled screen'}</p>
        <ul className="chips">
          {els.map((el, i) => (
            <li key={i}><b>{el.type}</b>{el.text ? ` “${el.text}”` : ''}</li>
          ))}
        </ul>
        {recall && (
          <div className="recall">
            <div className="bar"><i style={{ width: `${Math.round(recall.score * 100)}%` }} /></div>
            <p>
              <b>{recall.found}/{recall.total}</b> checkable elements are in this design
              {recall.missing.length > 0 && <span className="warn"> — missing: {recall.missing.join(', ')}</span>}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
