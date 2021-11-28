import React from 'react';
import ReactDOM from 'react-dom';
import Wheel from './luckyWheel-demo';
import Grid from './luckyGrid-demo';
import Slot from './slot-demo';

ReactDOM.render(
  <React.StrictMode>
    <Wheel />
    <Grid />
    <Slot />
  </React.StrictMode>,
  document.getElementById('root')
);
