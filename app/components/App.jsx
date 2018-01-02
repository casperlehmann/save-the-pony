import React from 'react';
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

function httpGet(url, callback)
{
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
      pixelWidth: '500px',
      pixelHeight: '500px',
    };
    const ponyChallengeUrlStub = 'https://ponychallenge.trustpilot.com/'
    this.newMazeUrl = ponyChallengeUrlStub + 'pony-challenge/maze'
    this.gameUrlStub = ponyChallengeUrlStub + 'pony-challenge/maze/'
  }

  updateGameState(data) {
    this.setState({
      pony_pos: data.pony[0],
      domo_pos: data.domokun[0],
    })
  }

  updateMap(data) {
    this.setState({
      data: data.data,
      width: data.size[0],
      height: data.size[1],
      exit_pos: data['end-point'][0],
      gameStarted: true,
    })
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

  clickHandler(i) {
    if (!(this.state.pony_paths.indexOf(i) != -1)){
      return
    } else {
    let direction
    if (i === this.state.pony_pos - this.state.width) {direction = 'north'}
    else if (i === this.state.pony_pos - 1) {direction = 'west'}
    else if (i === this.state.pony_pos + 1) {direction = 'east'}
    else if (i === this.state.pony_pos + this.state.width) {direction = 'south'}
    // ! handle failure
    httpPost(
      this.gameUrlStub  + this.state.game_id,
      {
        "direction": direction
      },
      (data) => this.pony_moved_callback(data) // ! We need the context.
      )
  }}

  pony_moved_callback(data) {
    httpGet(
      this.gameUrlStub + this.state.game_id,
      (data) => {this.updateGameState(data)}
    )
  }

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
    const proofDimIsWithinRange = (i, min, max) => {
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
    const newBlockWidth = proofDimIsWithinRange(this.refs.width.value, 15, 25)
    const newBlockHeight = proofDimIsWithinRange(this.refs.height.value, 15, 25)
    const widthPerBlock = Math.min(500 + 40*(newBlockWidth-15), window.innerWidth-20)/newBlockWidth
    const heightPerBlock = Math.min(500 + 40*(newBlockHeight-15), window.innerHeight-20)/newBlockHeight
    const blockUnit = Math.min(widthPerBlock, heightPerBlock)
    this.setState({
      width_param: newBlockWidth,
      pixelWidth: newBlockWidth * blockUnit + 'px',
      height_param: newBlockHeight,
      pixelHeight: newBlockHeight * blockUnit + 'px',
      pony_name_param: proofNameIsPonyName(this.refs.pony_name.value),
      difficulty_param: proofDimIsWithinRange(this.refs.difficulty.value, 0, 10),
      game_id: this.refs.game_id.value,
    })
  }

  render() {
    const outerStyle = {
      width: this.state.pixelWidth,
      height: this.state.pixelHeight,
      display: 'grid',

      borderTop: '1px',
      borderBottom: '1px',
      borderLeft: '1px',
      borderRight: '1px',

      borderStyle: 'solid',
      borderColor: 'black',
    };
    const gameStyle =  {
      gridTemplateColumns: 'repeat(' + this.state.width + ', 1fr)',
      gridTemplateRows: 'repeat(' + this.state.height + ', 1fr)',
    };
    const menuStyle = {
      justifyContent: 'center',
      alignItems: 'center'
    };

    if (!this.state.gameStarted) {
      return this.renderMenu(outerStyle, menuStyle)
    }
    return this.renderGame(outerStyle, gameStyle)
  }

  renderMenu(outerStyle, menuStyle) {
    const request_game_callback = (data) => {this.setState({game_id: data.maze_id});}
    return(
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
          () => httpPost(this.newMazeUrl,
            {
              "maze-width": this.state.width_param,
              "maze-height": this.state.height_param,
              "maze-player-name": this.state.pony_name_param,
              "difficulty": this.state.difficulty_param
            },
            request_game_callback)
          }>Request Game</button>
        <div><label>Game ID: </label><input type='text' ref='game_id' value={this.state.game_id} onChange={this.update.bind(this)}/></div>
        <button
          style={{width: '100%', height: '15%'}}
          onClick={() => {
            httpGet(
              this.gameUrlStub + this.state.game_id,
              (data) => {
                this.updateGameState(data);
                this.updateMap(data);
              }
            )
          }}
        >Start Game</button>
      </div>
    )
  }

  renderGame(outerStyle, gameStyle){
    const tiles = makeBoard(this.state.data, this.state.width, this.state.height);
    return (
      <div className="Board" style={Object.assign(outerStyle, gameStyle)}>
        {tiles.map((row, rowIndex) => {
          return row.map((tileType, columnIndex) => {
            const tile = TileTransformer(tiles, rowIndex, columnIndex, this.state.width, this.state.height);
            const index = rowIndex * this.state.width + columnIndex
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

const test_data = [
  ['west', 'north'], ['north'], ['north'], ['north'], ['north'],
  ['west'], ['west'], ['west'], ['west'], ['north'],
  ['west'], ['west'], ['west'], ['west'], ['north'],
  ['west'], ['west'], [], ['west'], ['north'],
  ['west'], ['north'], ['north'], [], ['north'],
];

App.defaultProps = {
  data: test_data,
  width: 5,
  height: 5,
  pony_pos: 0,
  domo_pos: 3,
  exit_pos: 9,
  width_param: 15,
  height_param: 15,
  pony_name_param: 'Fluttershy',
  difficulty_param: 1,
}
