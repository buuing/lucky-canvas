document.addEventListener('DOMContentLoaded', function () {
  // Initialize Lucky Wheel
  const luckyWheel = new LuckyCanvas.LuckyWheel('#lucky-wheel', {
    width: 300,
    height: 300,
    blocks: [
      { padding: '10px', background: '#f9e3bb' },
      { padding: '10px', background: '#f8d384' }
    ],
    prizes: [
      { text: 'Prize 1', background: '#ffb933' },
      { text: 'Prize 2', background: '#ffcb3f' },
      { text: 'Prize 3', background: '#ffe15c' }
    ],
    buttons: [
      { radius: '50px', background: '#ffdea0' }
    ],
    start: function () {
      console.log('Lucky Wheel started');
    },
    end: function (prize) {
      console.log('Lucky Wheel ended, prize:', prize);
    }
  });

  // Initialize Lucky Grid
  const luckyGrid = new LuckyCanvas.LuckyGrid('#lucky-grid', {
    width: 300,
    height: 300,
    rows: 3,
    cols: 3,
    prizes: [
      { text: 'Prize 1', background: '#ffb933' },
      { text: 'Prize 2', background: '#ffcb3f' },
      { text: 'Prize 3', background: '#ffe15c' },
      { text: 'Prize 4', background: '#ffb933' },
      { text: 'Prize 5', background: '#ffcb3f' },
      { text: 'Prize 6', background: '#ffe15c' },
      { text: 'Prize 7', background: '#ffb933' },
      { text: 'Prize 8', background: '#ffcb3f' },
      { text: 'Prize 9', background: '#ffe15c' }
    ],
    start: function () {
      console.log('Lucky Grid started');
    },
    end: function (prize) {
      console.log('Lucky Grid ended, prize:', prize);
    }
  });

  // Initialize Slot Machine
  const slotMachine = new LuckyCanvas.SlotMachine('#slot-machine', {
    width: 300,
    height: 300,
    prizes: [
      { text: 'Prize 1', background: '#ffb933' },
      { text: 'Prize 2', background: '#ffcb3f' },
      { text: 'Prize 3', background: '#ffe15c' }
    ],
    start: function () {
      console.log('Slot Machine started');
    },
    end: function (prize) {
      console.log('Slot Machine ended, prize:', prize);
    }
  });

  // Event listeners for user interactions
  document.getElementById('start-wheel').addEventListener('click', function () {
    luckyWheel.play();
  });

  document.getElementById('start-grid').addEventListener('click', function () {
    luckyGrid.play();
  });

  document.getElementById('start-slot').addEventListener('click', function () {
    slotMachine.play();
  });
});
