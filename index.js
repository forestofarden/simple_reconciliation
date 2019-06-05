  import { match } from './match.js'
  import { test } from './harness.js'

  // duco test cases

  test('simple numeric input', (t) => {
    let [matched, a, b] =
      match([54, 11, 28.33, 36.2],
            [111, 36.2, 11, 14.4])

    t.equalSets(matched, [11, 36.2])
    t.equalSets(a, [54, 28.33])
    t.equalSets(b, [111, 14.4])

    t.end()
  })

  test('duplicates', (t) => {
    let [matched, a, b] =
      match([54, 36.2, 36.2, 36.2],
            [111, 36.2, 36.2, 14.4])

    t.equalSets(matched, [36.2, 36.2])
    t.equalSets(a, [54, 36.2])
    t.equalSets(b, [111, 14.4])

    t.end()
  })

  // additional test cases

  test('empty', (t) => {
    let [matched, a, b] =
      match([], [111, 36.2])

    t.equalSets(matched, [])
    t.equalSets(a, [])
    t.equalSets(b, [111, 36.2])

    t.end()
  })

  test('single value', (t) => {
    let [matched, a, b] =
      match([111, 111], [111, 111, 111])

    t.equalSets(matched, [111, 111])
    t.equalSets(a, [])
    t.equalSets(b, [111])

    t.end()
  })

  // test cases from pair programming exercise

  test('structured input', (t) => {
    const canonical = serializer()

    let [matched, a, b] =
      match([{price:54,   quantity:540, ticker:'M20', counterparty:'EUC'},
             {price:36.2, quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:36.2, quantity:400, ticker:'M20', counterparty:'INS'}],
            [{price:54,   quantity:540, ticker:'M20', counterparty:'INS'},
             {price:36.3, quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:36.2, quantity:400, ticker:'M20', counterparty:'INS'}],
           canonical)

       t.equalSets(matched, [{price:36.2, quantity:400, ticker:'M20', counterparty:'INS'},
                             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'}], canonical)
       t.equalSets(a, [{price:54,   quantity:540, ticker:'M20', counterparty:'EUC'},
                       {price:36.2, quantity:110, ticker:'DUC', counterparty:'INS'}], canonical)
       t.equalSets(b, [{price:54,   quantity:540, ticker:'M20', counterparty:'INS'},
                       {price:36.3, quantity:110, ticker:'DUC', counterparty:'INS'}], canonical)

       t.end()
  })

  test('tolerance rule', (t) => {
    function tolerate(r) {
      return { price:        Math.abs(r.price),
               quantity:     Math.abs(r.quantity),
               ticker:       r.ticker.toUpperCase(),
               counterparty: r.counterparty.toUpperCase()
      }
    }
    const canonical = compose(serializer(), tolerate)

    let [matched, a, b] =
      match([{price:54,   quantity:540, ticker:'M20', counterparty:'EUC'},
             {price:36.2, quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:-36.2, quantity:400, ticker:'M20', counterparty:'INS'}],
            [{price:54,   quantity:540, ticker:'M20', counterparty:'INS'},
             {price:36.3, quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:11,   quantity:110, ticker:'duc', counterparty:'ins'},
             {price:36.2, quantity:400, ticker:'M20', counterparty:'INS'}],
           canonical)

       t.equalSets(matched, [{price:36.2, quantity:400, ticker:'M20', counterparty:'INS'},
                             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'}], canonical)
       t.equalSets(a, [{price:54,   quantity:540, ticker:'M20', counterparty:'EUC'},
                       {price:36.2, quantity:110, ticker:'DUC', counterparty:'INS'}], canonical)
       t.equalSets(b, [{price:54,   quantity:540, ticker:'M20', counterparty:'INS'},
                       {price:36.3, quantity:110, ticker:'DUC', counterparty:'INS'}], canonical)

      t.end()
  })

  // utility

  // returns a closure function to serialise objects to strings, retaining
  //   field order (and so, guaranteed to maintain equality).
  function serializer() {
    let fields = []                 // track order for the fields already seen

    // emit a unique string for all of an object's values, observing the order
    //   of any fields emitted previously
    return (obj) => {
      fields = ordered_union(fields, Object.keys(obj))
      return fields.map( (k) => obj[k] ).join(':')
    }
  }

  // returns the set union of two arrays a & b
  //   guaranteed to maintain the order of a
  function ordered_union(a, b) {
    let a_set = new Set(a)
    let b_diff = b.filter( (k) => !a_set.has(k) )
    return [...a, ...b_diff]
  }

  // function composition
  function compose(a, b) {
    return (x) => a(b(x))
  }
