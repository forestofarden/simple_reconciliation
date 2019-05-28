import test from 'tape'
import defined from 'defined'

test.Test.prototype.equalSets = function(a, b, f, extra) {
  let vals

  if(f) {
    a = a.map(f), b = b.map(f)
  }

  vals = b.reduce((s,v) => (s[v] = 1, s) , {})

  this._assert(a.length === b.length && a.every( (v) => vals[v] === 1), {
      message : 'should be equal sets',
      operator : 'equal',
      actual : a,
      expected : b,
      extra : extra
  })
}

export { test }
