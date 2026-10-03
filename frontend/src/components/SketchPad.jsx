import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const W = 900
const H = 560

const SketchPad = forwardRef(function SketchPad(_, ref) {
  const cv = useRef()
  const drawing = useRef(false)
  const last = useRef(null)
  const dirty = useRef(false)
  const [tool, setTool] = useState('pen')
  const [size, setSize] = useState(4)

  const fill = () => {
    const c = cv.current.getContext('2d')
    c.fillStyle = '#ffffff'
    c.fillRect(0, 0, W, H)
    dirty.current = false
  }

  useEffect(() => { fill() }, [])

  useImperativeHandle(ref, () => ({
    toBlob: () => new Promise((res) => (dirty.current ? cv.current.toBlob(res, 'image/png') : res(null))),
    clear: fill,
  }))

  const pos = (e) => {
    const r = cv.current.getBoundingClientRect()
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height }
  }

  const line = (a, b) => {
    const c = cv.current.getContext('2d')
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.strokeStyle = tool === 'pen' ? '#111111' : '#ffffff'
    c.lineWidth = tool === 'pen' ? size : size * 5
    c.beginPath()
    c.moveTo(a.x, a.y)
    c.lineTo(b.x, b.y)
    c.stroke()
    dirty.current = true
  }

  const down = (e) => {
    cv.current.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = pos(e)
    line(last.current, last.current)
  }
  const move = (e) => {
    if (!drawing.current) return
    const p = pos(e)
    line(last.current, p)
    last.current = p
  }
  const up = () => { drawing.current = false }

  return (
    <div className="pad">
      <div className="pad-tools">
        <button className={tool === 'pen' ? 'on' : ''} onClick={() => setTool('pen')}>Pen</button>
        <button className={tool === 'eraser' ? 'on' : ''} onClick={() => setTool('eraser')}>Eraser</button>
        <label>
          Size
          <input type="range" min="2" max="12" value={size} onChange={(e) => setSize(+e.target.value)} />
        </label>
        <button onClick={fill}>Clear</button>
      </div>
      <canvas
        ref={cv} width={W} height={H}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
      />
      <small className="muted">Draw boxes for sections, write the labels you want on buttons and headings.</small>
    </div>
  )
})

export default SketchPad
