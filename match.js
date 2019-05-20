// reconcile two lists, emitting matches and unmatched values

function match(a, b) {
  const def = (v) => v || 0
  const times = (i,f) => { while(i--) { f() } }

  let as = {}, bs = {}

  // generate a hash of counts for each value
  //    across both datasets
  a.forEach( (v) => { as[v] = def(as[v]) + 1, bs[v] = def(bs[v]) })
  b.forEach( (v) => { as[v] = def(as[v]),     bs[v] = def(bs[v]) + 1 })

  // some javascript book-keeping: hash keys are strings, not values (sadly)
  let vals = Object.keys(as).map( (v) => parseFloat(v) )

  // for each discrete value, allot matches
  let matches = [], unmatched_a = [], unmatched_b = []
  vals.forEach( (v) => {
    times(Math.min(as[v], bs[v]),   () => matches.push(v))
    times(Math.max(0, as[v]-bs[v]), () => unmatched_a.push(v))
    times(Math.max(0, bs[v]-as[v]), () => unmatched_b.push(v))
  })

  return [ matches, unmatched_a, unmatched_b ]
}

export { match }
