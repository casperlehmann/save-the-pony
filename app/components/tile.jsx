import React from 'react';

export const Tile = (params) => {
    let style = {
      backgroundImage: params.background,
      backgroundSize: 'cover',
      overflow: 'hidden',
      backgroundRepeat  : 'no-repeat',
      backgroundPosition: 'center',
  
      borderLeft: params.west ? 1 : 0,
      borderRight: params.east ? 1 : 0,
      borderTop: params.north ? 1 : 0,
      borderBottom: params.south ? 1 : 0,
      borderStyle: 'solid',
      borderColor: 'black',
    }
    return <div onClick={params.clickHandler} style={style}></div>;
  }

export const TileTransformer = (tiles, rowIndex, columnIndex, width, height) => {
    const current_tile = tiles[rowIndex][columnIndex];
    const atEasternBorder = columnIndex + 1 == width;
    const atSouthernBorder = rowIndex + 1 == height;

    return {
        wallNorth: current_tile.indexOf("north") >= 0,
        wallWest: current_tile.indexOf("west") >= 0,
        wallEast: atEasternBorder ? true : tiles[rowIndex][columnIndex+1].indexOf("west") >= 0,
        wallSouth: atSouthernBorder ? true : tiles[rowIndex+1][columnIndex].indexOf("north") >= 0,
    }
}