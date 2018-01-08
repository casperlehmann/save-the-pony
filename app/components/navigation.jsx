export const addKeyboardControls = (game) => {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    //console.log(keyName)
    if (keyName === 'ArrowLeft'){
      if (game.state.gameStarted) {
        game.walkDirection('west')}
    } else if (keyName === 'ArrowRight'){
      if (game.state.gameStarted) {
        game.walkDirection('east')}
    } else if (keyName === 'ArrowUp'){
      if (game.state.gameStarted) {
        game.walkDirection('north')}
    } else if (keyName === 'ArrowDown'){
      if (game.state.gameStarted) {
        game.walkDirection('south')}
    } else if (keyName === 'Enter') {
      if (!game.state.gameStarted) {
        console.log('Game started')
        game.loadStateFromServer()
      }
    }
  });
}
