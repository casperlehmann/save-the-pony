import React from 'react';
import {pony_character, domo_character, exit_character} from './resources'
import {makeBoard} from './make_board'
import {Tile, TileTransformer} from './tile'
import PropTypes from 'prop-types';
import {httpPost, httpGet} from './requests';

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
      pony_name: props.pony_name,
      difficulty: props.difficulty,
      pixelWidth: '500px',
      pixelHeight: '500px',
      game_id: props.game_id,
      hidden_url: props.hidden_url,
    };
    this.ponyChallengeUrlStub = 'https://ponychallenge.trustpilot.com'
    this.newMazeUrl = this.ponyChallengeUrlStub + '/pony-challenge/maze/'
  }

  loadStateFromServer(){
    httpGet(
      this.newMazeUrl + this.state.game_id,
      (data) => {
        this.updateGameState(data);
        this.updateMap(data);
      }
    )
  }

  updateGameState(data) {
    this.setState({
      pony_pos: data.pony[0],
      domo_pos: data.domokun[0],
    },
    // Upon updating, check for winning (or losing) conditions.
    () => {
      if (data['game-state'].state === 'over'){
        this.setState({
          game_result: data['game-state']['state-result'], // "You lost. Killed by monster"
        })
      } else if (data['game-state'].state === 'won'){
        this.setState({
          game_result: data['game-state']['state-result'], // "You won. Game ended"
          hidden_url: data['game-state']['hidden-url'] // "/eW91X3NhdmVkX3RoZV9wb255.jpg"
        })
      };
    }
  )}

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
      return ''//'url(https://i.imgur.com/c3EsnP6.jpg)'
    }
  }

  clickHandler(i) {
    if (!(this.state.pony_paths.indexOf(i) != -1)){
      // If the tile clicked is not possible to walk to, ignore and return nothing.
      return
    } else {
      let direction = this.translateTileNumberToDirection(i)
      // ! handle failure
      httpPost(
        this.newMazeUrl  + this.state.game_id,
        {
          "direction": direction
        },
        (data) => this.fetchGameState(data) // ! We need the context.
      )
    }
  }

  translateTileNumberToDirection(i) {
    let direction
    if (i === this.state.pony_pos - this.state.width) {direction = 'north'}
    else if (i === this.state.pony_pos - 1) {direction = 'west'}
    else if (i === this.state.pony_pos + 1) {direction = 'east'}
    else if (i === this.state.pony_pos + this.state.width) {direction = 'south'}
    return direction
  }

  tileAdjacentToPony(i) {
    let tilesAdjacentToPony = [
      this.state.pony_pos - this.state.width,
      this.state.pony_pos - 1,
      this.state.pony_pos + 1,
      this.state.pony_pos + this.state.width
    ]
    if (tilesAdjacentToPony.indexOf(i) > -1) { return true; }
    return false;
  }

  hoverHandler(i, e, action) {
    if (action === 'leave') {
      return (
        e.target.style.backgroundColor = '',
        e.target.style.opacity = 0
    )}
    let walkable = false
    if ((this.state.pony_paths.indexOf(i) != -1)){
      walkable = true
    }
    const isAdjacent = this.tileAdjacentToPony(i)
    const opacity = walkable ? .5 : .2
    const color = walkable ? 'green' : 'red'
    return (
      e.target.style.backgroundColor = color,
      e.target.style.opacity = opacity
    )
  }

  fetchGameState(data) {
    httpGet(
      this.newMazeUrl + this.state.game_id,
      (data) => {this.updateGameState(data)}
  )}

  update_params(){
    this.setState({
      width: this.refs.width.value,
      height: this.refs.height.value,
      pony_name: this.refs.pony_name.value,
      difficulty: this.refs.difficulty.value,
      game_id: this.refs.game_id.value,
    })
  }

  validate_params(){
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
      width: newBlockWidth,
      pixelWidth: newBlockWidth * blockUnit + 'px',
      height: newBlockHeight,
      pixelHeight: newBlockHeight * blockUnit + 'px',
      pony_name: proofNameIsPonyName(this.refs.pony_name.value),
      difficulty: proofDimIsWithinRange(this.refs.difficulty.value, 0, 10),
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
    if (this.state.hidden_url) {
      return (
        <div>
          <img src={this.ponyChallengeUrlStub + this.state.hidden_url}
            width={window.innerWidth-20} height={window.innerHeight-20}/>
        </div>
      )}
    if (!this.state.gameStarted) {
      return this.renderMenu(outerStyle, menuStyle)
    }
    return this.renderGame(outerStyle, gameStyle)
  }

  renderMenu(outerStyle, menuStyle) {
    const request_game_callback = (data) => {this.setState({game_id: data.maze_id});}
    return(
      <div className="StartScreen" style={Object.assign(outerStyle, menuStyle)}>
        <div><label>Width: </label><input type='number' ref='width' min="15" max="25" value={this.state.width} onChange={this.update_params.bind(this)} onBlur={this.validate_params.bind(this)}/></div>
        <div><label>Height: </label><input type='number' ref='height' min="15" max="25" value={this.state.height} onChange={this.update_params.bind(this)} onBlur={this.validate_params.bind(this)}/></div>
        <div>
          <label>Pony Name: </label>
          <select type='text' ref='pony_name' value={this.state.pony_name} onChange={this.update_params.bind(this)} onBlur={this.validate_params.bind(this)}>
            <option value='Fluttershy'>Fluttershy</option>
            <option value='Rainbow Dash'>Rainbow Dash</option>
          </select>
        </div>
        <div><label>Difficulty: </label><input type='number' ref='difficulty' min="0" max="10" value={this.state.difficulty} onChange={this.update_params.bind(this)} onBlur={this.validate_params.bind(this)}/></div>
        <button onClick={
          () => httpPost(this.newMazeUrl,
            {
              "maze-width": this.state.width,
              "maze-height": this.state.height,
              "maze-player-name": this.state.pony_name,
              "difficulty": this.state.difficulty
            },
            request_game_callback)
          }>Request Game</button>
        <div><label>Game ID: </label><input type='text' ref='game_id' value={this.state.game_id} onChange={this.update_params.bind(this)}/></div>
        <button
          style={{width: '100%', height: '15%'}}
          onClick={this.loadStateFromServer}
          >Start Game
        </button>
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
              clickHandler = {() => this.clickHandler(index)}
              hoverHandler = {(e, action) => this.hoverHandler(index, e, action)}/>;
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
  pony_name: PropTypes.string,
  difficulty: PropTypes.number,
  gameStarted: PropTypes.bool,
  game_id: PropTypes.string,
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
  pony_pos: 0,
  domo_pos: 3,
  exit_pos: 9,
  width: 15,
  height: 15,
  pony_name: 'Fluttershy',
  difficulty: 1,
  game_id: 'f86a1d3c-3138-4b7e-99a7-ca654d6d56e0',
}
