// reconcile two lists, emitting matches and unmatched values

// this solution retains O(n) performance by exploiting equality characteristics
//   of the proposed tolerance functions (absolute value and case-insensitivity).
//
// instead of taking a boolean-valued function that indicates if two values match
//   (subject to known tolerances), it takes a canonicalization function.
//
// the canonicalization function must guarantee that all values within a given
//   tolerance map to the same output.  to reconcile, matches are counted in a
//   single pass over the inputs, using a hash of counts keyed to the canonical
//   values
//
// [ N.B. no promises are made about which value is emitted for a given tolerance
//   match ]

function match(a, b, canonical = (x) => x) {
  const def = (v) => v || 0
  const times = (i,f) => { while(i--) { f() } }

  let as = {}, bs = {}, vals = {}
  const canon = (v, vals) => { let k = canonical(v); vals[k] = v; return k }

  // generate a hash of counts for each canonical value across both datasets
  a.forEach( (v) => { v = canon(v, vals);  as[v] = def(as[v]) + 1;  bs[v] = def(bs[v]) } )
  b.forEach( (v) => { v = canon(v, vals);  as[v] = def(as[v]);      bs[v] = def(bs[v]) + 1 } )

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
