import React from 'react';
import ReactDOM from 'react-dom';
import Wheel from './luckyWheel-demo';
import Grid from './luckyGrid-demo';

ReactDOM.render(
  <React.StrictMode>
    <Wheel />
    <Grid />
  </React.StrictMode>,
  document.getElementById('root')
);
