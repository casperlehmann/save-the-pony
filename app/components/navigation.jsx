export const can_walk_north = (tile) => {
  return tile.indexOf("north") >= 0
}
  
export const can_walk_east = (tile, width, columnIndex) => {
  return tile.indexOf("east") >= 0 || columnIndex == width - 1
}

export const can_walk_south = (tile, height, rowIndex) => {
  return tile.indexOf("south") >= 0 || rowIndex == height - 1
}

export const can_walk_west = (tile) => {
  return tile.indexOf("west") >= 0
}
