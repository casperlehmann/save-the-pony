import React from 'react';
import {data, width, height, pony_pos, domo_pos, exit_pos} from './test_data'
import {pony_character, domo_character, exit_character} from './resources'
import {makeBoard} from './make_board'
import {Tile, TileTransformer} from './tile'

export default class App extends React.Component {
  render(props) {
    const tiles = makeBoard(data, width, height);
    const style = {
      width: '400px',
      height: '400px',
      display: 'grid',

      borderTop: '1px',
      borderBottom: '1px',
      borderLeft: '1px',
      borderRight: '1px',

      borderStyle: 'solid',
      borderColor: 'black',

      gridTemplateColumns: 'repeat(' + width + ', 1fr)',
      gridTemplateRows: 'repeat(' + height + ', 1fr)',
    };
    const backgrounds = {}
    backgrounds[pony_pos] = 'url('+pony_character+')';
    backgrounds[domo_pos] = 'url('+domo_character+')';
    backgrounds[exit_pos] = 'url('+exit_character+')';
    backgrounds['default'] = 'url(https://i.imgur.com/c3EsnP6.jpg)';
    function getBackground(position) {
      return backgrounds[position] || backgrounds['default'];
    }

    return (
      <div className="Board" style={style}>
        {tiles.map((row, rowIndex) => {
          return row.map((tileType, columnIndex) => {
            const tile = TileTransformer(tiles, rowIndex, columnIndex, width, height);
            const index = rowIndex * width + columnIndex
            const background = getBackground(index);
            const clickHandler = (i) => alert('Clicked on: ' + i)
            return <Tile
              north = {tile.wallNorth}
              south = {tile.wallSouth}
              east = {tile.wallEast}
              west = {tile.wallWest}
              background = {background}
              clickHandler = {() => clickHandler(index)}/>;
          })
        })}
      </div>
    );
  }
}
