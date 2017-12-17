import React from 'react';
import {contains_pony, contains_domo, contains_exit } from './aux'
import {data, width, height, pony_pos, domo_pos, exit_pos} from './test_data'
import {pony_character, domo_character, exit_character} from './resources'
import {makeBoard} from './make_board'
import {Tile} from './tile'
import {can_walk_north, can_walk_east, can_walk_south, can_walk_west} from './navigation'

export default class App extends React.Component {
  render(props) {
    const tiles = makeBoard(data, width, height);

    return (
      <div className="Board">
        {tiles.map((row, rowIndex) => {
          return row.map((tileType, columnIndex) => {
            const tile = tiles[rowIndex][columnIndex];
            const pony = contains_pony(columnIndex, rowIndex, width, pony_pos);
            const domo = contains_domo(columnIndex, rowIndex, width, domo_pos);
            const exit = contains_exit(columnIndex, rowIndex, width, exit_pos);
            const index = rowIndex * width + columnIndex
            var background
            switch(true) {
              case pony:
                background = 'url('+pony_character+')'
                break
              case domo:
                background = 'url('+domo_character+')'
                break
              case exit:
                background = 'url('+exit_character+')'
                break
              'white'}
            const north = can_walk_north(tile);
            const east = can_walk_east(tile, row.length, columnIndex);
            const south = can_walk_south(tile, tiles.length, rowIndex);
            const west = can_walk_west(tile);
            var clickHandler = (i) => alert('Clicked on: ' + i)
            return <Tile north={north} south={south} east={east} west={west} background={background}
              clickHandler={() => clickHandler(index)}/>;
          })
        })}
      </div>
    );
  }
}
