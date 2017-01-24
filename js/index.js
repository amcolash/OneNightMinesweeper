window.onload = function() {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

  var width = 30;
  var height = 30;

  function preload () {
    game.load.image('0', 'img/0.png');
    game.load.image('1', 'img/1.png');
    game.load.image('2', 'img/2.png');
    game.load.image('3', 'img/3.png');
    game.load.image('4', 'img/4.png');
    game.load.image('5', 'img/5.png');
    game.load.image('6', 'img/6.png');
    game.load.image('7', 'img/7.png');
    game.load.image('8', 'img/8.png');

    game.load.image('flag', 'img/flag.png');
    game.load.image('mine', 'img/mine.png');
    game.load.image('unknown', 'img/unknown.png');
  }

  function create () {
    var grid = createArray(2, 2);

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        grid[x][y] = 0;
      }
    }

    console.log(grid);

    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
  }

  function createArray(length) {
    var arr = new Array(length || 0),
      i = length;

    if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
  }

};
