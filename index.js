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

  // test case 3

  let canonical = function(r) {
    let k = Object.keys(r)
    k.sort()
    let result = k.map((field) => r[field]).join(':')
    return result
  }

  test('structured input', (t) => {
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
    const tolerate_canonical = (r) => {
      return canonical({
        price: Math.abs(r.price),
        quantity: Math.abs(r.quantity),
        ticker: r.ticker.toUpperCase(),
        counterparty: r.counterparty.toUpperCase()
      })
    }

    let [matched, a, b] =
      match([{price:54,   quantity:540, ticker:'M20', counterparty:'EUC'},
             {price:36.2, quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:-36.2, quantity:400, ticker:'M20', counterparty:'INS'}],
            [{price:54,   quantity:540, ticker:'M20', counterparty:'INS'},
             {price:36.3, quantity:110, ticker:'DUC', counterparty:'INS'},
             {price:11,   quantity:110, ticker:'duc', counterparty:'ins'},
             {price:36.2, quantity:400, ticker:'M20', counterparty:'INS'}],
           tolerate_canonical)

       t.equalSets(matched, [{price:36.2, quantity:400, ticker:'M20', counterparty:'INS'},
                             {price:11,   quantity:110, ticker:'DUC', counterparty:'INS'}], tolerate_canonical)
       t.equalSets(a, [{price:54,   quantity:540, ticker:'M20', counterparty:'EUC'},
                       {price:36.2, quantity:110, ticker:'DUC', counterparty:'INS'}], tolerate_canonical)
       t.equalSets(b, [{price:54,   quantity:540, ticker:'M20', counterparty:'INS'},
                       {price:36.3, quantity:110, ticker:'DUC', counterparty:'INS'}], tolerate_canonical)

      t.end()
  })
