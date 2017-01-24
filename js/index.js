window.onload = function() {

  var grid_width = 20;
  var grid_height = 20;
  var tile_width = 32;
  var tile_height = 32;
  var game_width = ((grid_width + 1) * tile_width) + (grid_width * 3);
  var game_height = ((grid_height + 1) * tile_height) + (grid_height * 3);

  var MINE = 9;
  var FLAG = 10;

  var grid = createArray(grid_height, grid_width);
  var gameOverText;

  var game = new Phaser.Game(game_width, game_height, Phaser.AUTO, '', { preload: preload, create: create });

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
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

    var group = game.add.group();

    for (var x = 0; x < grid_width; x++) {
      for (var y = 0; y < grid_height; y++) {
        var value = Math.floor(Math.random() * 10);
        var tile = game.make.image(0, 0, "unknown");
        tile.value = value;
        tile.shown = false;
        tile.inputEnabled = true;
        tile.events.onInputDown.add(handler, this);
        tile.width = 32;
        tile.height = 32;

        grid[x][y] = tile;
        group.add(tile);
      }
    }

    group.align(grid_width, -1, tile_width + 1, tile_height + 1);
    group.position.x = (game.width - group.width) / 2;
    group.position.y = (game.height - group.height) / 2;

    gameOverText = game.add.text(0, 0, '', { fontSize: 64, fill: '#ffffff', stroke: 'black',
      strokeThickness: 3, align: 'center' });

    gameOverText.anchor.x = 0.5;
    gameOverText.anchor.y = 0.5;
    gameOverText.position.x = game.width / 2;
    gameOverText.position.y = game.height / 2;
  }

  function handler(tile, pointer) {
    if (pointer.leftButton.isDown && !tile.shown) {
      var image = getImage(tile);
      tile.loadTexture(image, 0, false);
      tile.shown = true;

      if (tile.value == MINE) {
        gameOver();
      }
    } else if (pointer.rightButton.isDown && !tile.shown) {
      tile.hasFlag = !tile.hasFlag;
      tile.loadTexture(tile.hasFlag ? "flag" : "unknown", 0, false);
    }
  }

  function gameOver() {
    for (var x = 0; x < grid_width; x++) {
      for (var y = 0; y < grid_height; y++) {
        var tile = grid[x][y];
        var image = getImage(tile);
        tile.loadTexture(image, 0, false);
      }
    }

    gameOverText.text = 'Game Over!';
  }

  function getImage(tile) {
    switch(tile.value) {
      case 0:   return "0";
      case 1:   return "1";
      case 2:   return "2";
      case 3:   return "3";
      case 4:   return "4";
      case 5:   return "5";
      case 6:   return "6";
      case 7:   return "7";
      case 8:   return "8";
      case MINE:  return "mine";
      default:  return "unknown";
    }
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
