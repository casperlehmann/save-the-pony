export function makeBoard(data, width, height) {
  const out = data.reduce(
    (rows, key, index) => (index % width == 0
      ? rows.push([key])
      : rows[rows.length-1].push(key)) && rows,
    [])
  return out
}
