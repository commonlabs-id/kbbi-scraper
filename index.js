const A = require("./data/A.json");
const B = require("./data/B.json");
const C = require("./data/C.json");
const D = require("./data/D.json");
const E = require("./data/E.json");
const F = require("./data/F.json");
const G = require("./data/G.json");
const H = require("./data/H.json");
const I = require("./data/I.json");
const J = require("./data/J.json");
const K = require("./data/K.json");
const L = require("./data/L.json");
const M = require("./data/M.json");
const N = require("./data/N.json");
const O = require("./data/O.json");
const P = require("./data/P.json");
const Q = require("./data/Q.json");
const R = require("./data/R.json");
const S = require("./data/S.json");
const T = require("./data/T.json");
const U = require("./data/U.json");
const V = require("./data/V.json");
const W = require("./data/W.json");
const X = require("./data/X.json");
const Y = require("./data/Y.json");
const Z = require("./data/Z.json");

const result = {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z
};

let set = new Set([]);

for (const [letter, { entries }] of Object.entries(result)) {
  console.log(letter, entries.length);
  for (const { entry, href } of entries) {
    set.add(href.toLowerCase());
  }
}

console.log(Array.from(set));
