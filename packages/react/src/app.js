import React from 'react';
import ReactDOM from 'react-dom';
import LuckyWheel from './demo/LuckyWheel';
import LuckyGrid from './demo/LuckyGrid';
import SlotMachine from './demo/SlotMachine';

ReactDOM.render(
  <React.StrictMode>
    <LuckyWheel />
    {/* <LuckyGrid /> */}
    {/* <SlotMachine /> */}
  </React.StrictMode>,
  document.getElementById('root')
);
