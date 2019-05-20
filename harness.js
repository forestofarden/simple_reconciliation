// utility: small testing framework modeled on substack tape

function test(msg, f) {
  let div = document.createElement('div')
  let h1 = document.createElement('h1')
  h1.appendChild(document.createTextNode(msg))
  div.appendChild(h1)
  document.body.appendChild(div)

  f(api(div))
}

function api(elem) {
  return {
    equalSets: function(a,b) {
      let vals = b.reduce((s,v) => (s[v] = 1, s) , {})
      expect(a, b, a.length === b.length && a.every( (v) => vals[v] === 1))
    }
  }

  function expect(a, b, ok) {
    let p = document.createElement('p')
    let msg = ok ? 'PASS' : 'FAILURE! ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)
    p.appendChild(document.createTextNode(msg))
    elem.appendChild(p)
  }
}

export { test }
