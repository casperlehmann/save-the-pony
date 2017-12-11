import React from 'react';

const data = [
  ['west', 'north'], ['north'], ['north'], ['north'], ['north'],
  ['west'], ['west'], ['west'], ['west'], ['north'],
  ['west'], ['west'], ['west'], ['west'], ['north'],
  ['west'], ['west'], [], ['west'], ['north'],
  ['west'], ['north'], ['north'], [], ['north'],
];

function makeBoard(data, width, height) {
  const out = data.reduce(
    (rows, key, index) => (index % width == 0
      ? rows.push([key])
      : rows[rows.length-1].push(key)) && rows,
    [])
  return out
}

const width = 5
const height = 5

const pony_character = 'https://orig00.deviantart.net/066e/f/2012/058/6/d/my_little_pony___rainbow_dash_b2_by_dj_fahr-d4r504l.png'
const pony_pos = 0
const domo_character = 'https://nugrahadiprasetia.files.wordpress.com/2017/11/cropped-domo_wallpaper_by_raydezee-png2.jpeg'
const domo_pos = 3
const exit_character = 'https://target.scene7.com/is/image/Target/17238970?wid=520&hei=520&fmt=pjpeg'
const exit_pos = 9

const Tile = (params) => {
  let style = {
    backgroundImage: params.background,
    backgroundSize: 'cover',
    overflow: 'hidden',
    backgroundRepeat  : 'no-repeat',
    backgroundPosition: 'center',

    borderLeft: params.west ? 2 : 0,
    borderRight: params.east ? 2 : 0,
    borderTop: params.north ? 2 : 0,
    borderBottom: params.south ? 2 : 0,
    borderStyle: 'solid',
    borderColor: 'black',
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
const contains_pony = (columnIndex, rowIndex, width) => {
  return columnIndex * width + rowIndex === pony_pos
}
const contains_domo = (columnIndex, rowIndex, width) => {
  return columnIndex * width + rowIndex === domo_pos
}
const contains_exit = (columnIndex, rowIndex, width) => {
  return columnIndex * width + rowIndex === exit_pos
}

export default class App extends React.Component {
  render(props) {
    const tiles = makeBoard(data, width, height);

    return (
      <div className="Board">
        {tiles.map((row, rowIndex) => {
          return row.map((tileType, columnIndex) => {
            const tile = tiles[rowIndex][columnIndex];
            const pony = contains_pony(columnIndex, rowIndex, width);
            const domo = contains_domo(columnIndex, rowIndex, width);
            const exit = contains_exit(columnIndex, rowIndex, width);
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
            return <Tile north={north} south={south} east={east} west={west} background={background}/>;
          })
        })}
      </div>
    );
  }
}
