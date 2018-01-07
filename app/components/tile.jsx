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
    return (
        <div
            onClick={params.clickHandler}
            style={style}
            ><div
                onMouseEnter={(e) => params.hoverHandler(e, 'enter')}
                onMouseOut={(e) => params.hoverHandler(e, 'leave')}
                style={{
                    overflow: 'hidden',
                    height: '100%',
                }}
            ></div>
        </div>
    );
  }

export const TileTransformer = (tiles, rowIndex, columnIndex, width, height) => {
    const current_tile = tiles[rowIndex][columnIndex];
    const atEasternBorder = columnIndex + 1 == width;
    const atSouthernBorder = rowIndex + 1 == height;
    const wallNorth = current_tile.indexOf("north") >= 0
    const wallWest = current_tile.indexOf("west") >= 0
    const wallEast = atEasternBorder ? true : tiles[rowIndex][columnIndex+1].indexOf("west") >= 0
    const wallSouth = atSouthernBorder ? true : tiles[rowIndex+1][columnIndex].indexOf("north") >= 0

    const walkablePaths = []
    if (!wallNorth) {walkablePaths.push(columnIndex+rowIndex*width-width)}
    if (!wallWest) {walkablePaths.push(columnIndex+rowIndex*width-1)}
    if (!wallEast) {walkablePaths.push(columnIndex+rowIndex*width+1)}
    if (!wallSouth) {walkablePaths.push(columnIndex+rowIndex*width+width)}
    return {
        wallNorth: wallNorth,
        wallWest: wallWest,
        wallEast: wallEast,
        wallSouth: wallSouth,
        walkable: walkablePaths
    }
}