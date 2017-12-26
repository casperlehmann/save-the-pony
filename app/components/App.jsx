import React from 'react';
import {data, width, height, pony_pos, domo_pos, exit_pos} from './test_data'
import {pony_character, domo_character, exit_character} from './resources'
import {makeBoard} from './make_board'
import {Tile, TileTransformer} from './tile'
import PropTypes from 'prop-types';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      data: props.data,
      width: props.width,
      height: props.height,
      pony_pos: props.pony_pos,
      domo_pos: props.domo_pos,
      exit_pos: props.exit_pos,
      pony_paths: [],
      gameStarted: false,
    };
  }

  getBackground(position) {
    if (this.state.pony_pos == position) {
      return 'url('+pony_character+')'
    }
    else if (this.state.domo_pos == position) {
      return 'url('+domo_character+')'
    }
    else if (this.state.exit_pos == position) {
      return 'url('+exit_character+')'
    }
    else {
      return 'url(https://i.imgur.com/c3EsnP6.jpg)'
    }
  }

  clickHandler(i, thing) {
    if (this.state.pony_paths.indexOf(i) != -1){
    this.setState({pony_pos: i}, function() {
      //console.log('pony click:', this.state.pony_pos)
    });
  }}

  render() {
    const tiles = makeBoard(this.state.data, this.state.width, this.state.height);
    const outerStyle = {
      width: '400px',
      height: '400px',
      display: 'grid',

      borderTop: '1px',
      borderBottom: '1px',
      borderLeft: '1px',
      borderRight: '1px',

      borderStyle: 'solid',
      borderColor: 'black',
    };
    const gameStyle =  {
      gridTemplateColumns: 'repeat(' + width + ', 1fr)',
      gridTemplateRows: 'repeat(' + height + ', 1fr)',
    };
    const menuStyle = {
      justifyContent: 'center',
      alignItems: 'center'
    };

    if (false && !this.state.gameStarted) {return (
      <div className="StartScreen" style={Object.assign(outerStyle, menuStyle)}>
        <button
          style={{width: '100%', height: '15%'}}
          onClick={() => this.setState({gameStarted: true})}
          >
          Start Game</button>
      </div>
    )}

    return (
      <div className="Board" style={Object.assign(outerStyle, gameStyle)}>
        {tiles.map((row, rowIndex) => {
          return row.map((tileType, columnIndex) => {
            const tile = TileTransformer(tiles, rowIndex, columnIndex, width, height);
            const index = rowIndex * width + columnIndex
            if (this.state.pony_pos === index) {this.state.pony_paths = tile.walkable}
            const background = this.getBackground(index);
            return <Tile
              north = {tile.wallNorth}
              south = {tile.wallSouth}
              east = {tile.wallEast}
              west = {tile.wallWest}
              background = {background}
              clickHandler = {() => this.clickHandler(index)}/>;
          })
        })}
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  pony_pos: PropTypes.number,
  domo_pos: PropTypes.number,
  exit_pos: PropTypes.number,
}

App.defaultProps = {
  data: data,
  width: width,
  height: height,
  pony_pos: pony_pos,
  domo_pos: domo_pos,
  exit_pos: exit_pos,
}