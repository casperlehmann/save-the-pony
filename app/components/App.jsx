import React from 'react';
import {data, width, height, pony_pos, domo_pos, exit_pos} from './test_data'
import {pony_character, domo_character, exit_character} from './resources'
import {makeBoard} from './make_board'
import {Tile, TileTransformer} from './tile'
import PropTypes from 'prop-types';

function httpPost(url, payload, callback)
{
    fetch(url,  {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json())
    .then(function(data){
      callback(data)
    });
}

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
      width_param: props.width_param,
      height_param: props.height_param,
      pony_name_param: props.pony_name_param,
      difficulty_param: props.difficulty_param,
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

  update(){
    this.setState({
      width_param: this.refs.width.value,
      height_param: this.refs.height.value,
      pony_name_param: this.refs.pony_name.value,
      difficulty_param: this.refs.difficulty.value,
      game_id: this.refs.game_id.value,
    })
  }

  validate(){
    const proofDimIsWithinRange = (i, min, max, fallback) => {
      const parsed = parseInt(i)
      let bounded
      if (isNaN(parsed)) {bounded = min} else {bounded = Math.max(Math.min(max, parsed), min)}
      return bounded
    }
    const proofNameIsPonyName = (name) => {
      if( ['Fluttershy', 'Rainbow Dash'].indexOf(name) > -1){
        return this.refs.pony_name.value
      } else {
        return 'Fluttershy'
      }
    }
    this.setState({
      width_param: proofDimIsWithinRange(this.refs.width.value, 15, 25, this.state.width_param),
      height_param: proofDimIsWithinRange(this.refs.height.value, 15, 25, this.state.height_param),
      pony_name_param: proofNameIsPonyName(this.refs.pony_name.value),
      difficulty_param: proofDimIsWithinRange(this.refs.difficulty.value, 0, 10, this.state.difficulty_param),
      game_id: this.refs.game_id.value,
    })
  }

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
    const newMazeUrl = 'https://ponychallenge.trustpilot.com/pony-challenge/maze'
    const request_game_callback = (data) => document.getElementById('game_id').value = data.maze_id;

    if (!this.state.gameStarted) {return (
      <div className="StartScreen" style={Object.assign(outerStyle, menuStyle)}>
        <div><label>Width: </label><input type='number' ref='width' min="15" max="25" value={this.state.width_param} onChange={this.update.bind(this)} onBlur={this.validate.bind(this)}/></div>
        <div><label>Height: </label><input type='number' ref='height' min="15" max="25" value={this.state.height_param} onChange={this.update.bind(this)} onBlur={this.validate.bind(this)}/></div>
        <div><label>Pony Name: </label>
          <select type='text' ref='pony_name' value={this.state.pony_name_param} onChange={this.update.bind(this)} onBlur={this.validate.bind(this)}>
            <option value='Fluttershy'>Fluttershy</option>
            <option value='Rainbow Dash'>Rainbow Dash</option>
          </select>
        </div>
        <div><label>Difficulty: </label><input type='number' ref='difficulty' min="0" max="10" value={this.state.difficulty_param} onChange={this.update.bind(this)} onBlur={this.validate.bind(this)}/></div>
        <button onClick={
          () => httpPost(newMazeUrl,
            {
              "maze-width": this.state.width_param,
              "maze-height": this.state.height_param,
              "maze-player-name": this.state.pony_name_param,
              "difficulty": this.state.difficulty_param
              }
            , request_game_callback)
          }>Request Game</button>
        <div><label>Game ID: </label><input type='text' ref='game_id' value={this.state.game_id} onChange={this.update.bind(this)}/></div>
        <button
          style={{width: '100%', height: '15%'}}
          onClick={() => this.setState({gameStarted: true})}
        >Start Game</button>
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
  width_param: PropTypes.number,
  height_param: PropTypes.number,
  pony_name_param: PropTypes.string,
  difficulty_param: PropTypes.number,
}

App.defaultProps = {
  data: data,
  width: width,
  height: height,
  pony_pos: pony_pos,
  domo_pos: domo_pos,
  exit_pos: exit_pos,
  width_param: 15,
  height_param: 15,
  pony_name_param: 'Fluttershy',
  difficulty_param: 1,
}
