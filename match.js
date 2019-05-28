// reconcile two lists, emitting matches and unmatched values

function match(a, b, canonical) {
  const def = (v) => v || 0
  const times = (i,f) => { while(i--) { f() } }

  let as = {}, bs = {}, vals = {}

  if(!canonical) { canonical = (x) => x }

  // generate a hash of counts for each value across both datasets
  a.forEach( (v) => {
    let k = canonical(v)
    vals[k] = v
    as[k] = def(as[k]) + 1
    bs[k] = def(bs[k])
  })
  b.forEach( (v) => {
    let k = canonical(v)
    vals[k] = v
    as[k] = def(as[k])
    bs[k] = def(bs[k]) + 1
  })

  // for each discrete value, allot matches
  let matches = [], unmatched_a = [], unmatched_b = []
  Object.keys(vals).forEach( (v) => {
    times(Math.min(as[v], bs[v]),   () => matches.push(vals[v]))
    times(Math.max(0, as[v]-bs[v]), () => unmatched_a.push(vals[v]))
    times(Math.max(0, bs[v]-as[v]), () => unmatched_b.push(vals[v]))
  })

  return [ matches, unmatched_a, unmatched_b ]
}

export { match }
