export default function Progress({ stage, done }) {
  const items = [
    ['read', 'Reading your sketch'],
    ['write', `Writing 3 designs (${done}/3)`],
    ['check', 'Checking the code'],
  ]
  return (
    <ol className="steps">
      {items.map(([k, label]) => (
        <li key={k} className={stage[k]}>
          <span className="dot" />
          {label}
        </li>
      ))}
    </ol>
  )
}
