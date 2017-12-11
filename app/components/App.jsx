import React from 'react';

function makeBoard() {
  return [
    [ ['west', 'north'], ['north'], ['north'], ['north'], ['north'] ],
    [ ['west'], ['west'], ['west'], ['west'], ['north'] ],
    [ ['west'], ['west'], ['west'], ['west'], ['north'] ],
    [ ['west'], ['west'], [], ['west'], ['north'] ],
    [ ['west'], ['north'], ['north'], [], ['north'] ],
  ];
}

const Tile = (params) => {
  let style = {
    borderLeft: params.west ? 2 : 0,
    borderRight: params.east ? 2 : 0,
    borderTop: params.north ? 2 : 0,
    borderBottom: params.south ? 2 : 0,
    borderStyle: 'solid',
    borderColor: 'black'
  }
  
  return <div style={style}></div>;
}

const can_walk_north = (tile) => {
  return tile.indexOf("north") >= 0
}
const can_walk_east = (tile, width, columnIndex) => {
  return tile.indexOf("east") >= 0 || columnIndex == width - 1
}
const can_walk_south = (tile, height, rowIndex) => {
  return tile.indexOf("south") >= 0 || rowIndex == height - 1
}
const can_walk_west = (tile) => {
  return tile.indexOf("west") >= 0
}

export default class App extends React.Component {
  render(props) {
    const tiles = makeBoard();

    return (
      <div className="Board">
        {tiles.map((row, rowIndex) => {
          return row.map((tileType, columnIndex) => {
            const tile = tiles[rowIndex][columnIndex];
            const north = can_walk_north(tile);
            const east = can_walk_east(tile, row.length, columnIndex);
            const south = can_walk_south(tile, tiles.length, rowIndex);
            const west = can_walk_west(tile);
            return <Tile north={north} south={south} east={east} west={west}/>;
          })
        })}
      </div>
    );
  }
}
