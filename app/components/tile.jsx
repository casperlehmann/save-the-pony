import React from 'react';

export const Tile = (params) => {
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
    return <div onClick={params.clickHandler} style={style}></div>;
  }