function duration(h1, m1, h2, m2) {
  return h2 * 60 - h1 * 60 + (m2 - m1)
}

module.exports = duration
