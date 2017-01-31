window.onload = function() {

  var gridWidth = 20;
  var gridHeight = 20;
  var tileWidth = 28;
  var tileHeight = 28;
  var bottomHeight = tileHeight * 3;
  var gameWidth = (gridWidth + 2.6)* tileWidth;
  var gameHeight = (gridHeight + 2) * tileHeight + bottomHeight;

  var MINE = 9;
  var FLAG = 10;

  var DEBUG = false;

  var grid = createArray(gridHeight, gridWidth);
  var timer;
  var score;
  var timerText;
  var scoreText;
  var endGameText;
  var restartGroup;

  var buttonWidth = 140;
  var buttonHeight = 50;

  var gameEnded;

  var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

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

    timer = 0;
    score = 0;
    gameEnded = false;

    var group = game.add.group();

    for (var x = 0; x < gridWidth; x++) {
      for (var y = 0; y < gridHeight; y++) {

        var tile = game.make.image(0, 0, "unknown");
        tile.shown = false;
        tile.inputEnabled = true;
        tile.events.onInputDown.add(clickHandler, this);
        tile.value = 0;
        tile.gridX = x;
        tile.gridY = y;
        tile.width = tileWidth;
        tile.height = tileHeight;

        grid[x][y] = tile;
        group.add(tile);
      }
    }

    for (var x = 0; x < gridWidth; x++) {
      for (var y = 0; y < gridHeight; y++) {
        if (Math.random() > 0.9) {
          addMine(grid[x][y]);
        }
      }
    }

    if (DEBUG) {
      for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
          var tile = grid[x][y];

          if (tile.value != MINE) {
            tile.loadTexture(getImage(tile), 0, false);
            tile.shown = true;
          }
        }
      }
    }

    group.align(gridWidth, -1, tileWidth + 1, tileHeight + 1);
    group.position.x = tileWidth;
    group.position.y = tileHeight;

    endGameText = game.add.text(group.x + group.width / 2, group.x + group.height / 2, '', { fontSize: 64, fill: '#ffffff',
      stroke: 'black', strokeThickness: 3, align: 'center' });
    endGameText.anchor.x = 0.5;
    endGameText.anchor.y = 0.5;

    timerText = game.add.text(game.width / 2, game.height - 2 * tileHeight, 'Time: 0 sec', { fontSize: 24, fill: '#ffffff',
      stroke: 'black', strokeThickness: 1.5, align: 'center' });
    timerText.anchor.x = 0.5;
    timerText.anchor.y = 0.5;

    scoreText = game.add.text(game.width / 2, game.height - 1 * tileHeight, 'Score: 0', { fontSize: 24, fill: '#ffffff',
      stroke: 'black', strokeThickness: 1.5, align: 'center' });
    scoreText.anchor.x = 0.5;
    scoreText.anchor.y = 0.5;

    restartGroup = game.add.group();
    var restartButton = game.add.button(-buttonWidth / 2, -buttonHeight / 2, 'unknown', restartGame, this, 2, 1, 0);
    restartButton.width = buttonWidth;
    restartButton.height = buttonHeight;

    var restartText = game.add.text(0, 0, 'Restart', { fontSize: 24, fill: '#ffffff',
      stroke: 'black', strokeThickness: 2, align: 'center' });
    restartText.anchor.x = 0.5;
    restartText.anchor.y = 0.5;

    restartGroup.add(restartButton);
    restartGroup.add(restartText);

    restartGroup.x = game.width / 2;
    restartGroup.y = game.height / 2 + endGameText.height * 0.4;
  }

  function update() {
    if (!gameEnded) {
      timer += (game.time.elapsedMS / 1000);

      timerText.text = 'Time : ' + Math.floor(timer) + ' sec';
      scoreText.text = 'Score: ' + score;
    }

    restartGroup.visible = gameEnded;
  }

  function clickHandler(tile, pointer) {
    if (!gameEnded) {
      if (pointer.leftButton.isDown && !tile.shown) {
        if (tile.value == MINE) {
          gameOver(true);
          return;
        } else {
          var queue = [];
          queue.push(tile);

          while(queue.length > 0) {
            var t = queue.shift();
            if (!t.shown) {
              openTile(t, queue);
            }
          }
        }
      } else if (pointer.rightButton.isDown && !tile.shown) {
        tile.hasFlag = !tile.hasFlag;
        tile.loadTexture(tile.hasFlag ? "flag" : "unknown", 0, false);
      }

      var won = true;
      for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
          if (grid[x][y].value != MINE && !grid[x][y].shown) {
            won = false;
          }
        }
      }

      if (won) {
        gameOver(false);
        return;
      }
    }
  }

  function openTile(tile, queue) {
    var image = getImage(tile);

    if (tile.value != MINE) {
      score += tile.value;
    }

    if (tile.value == 0) {
      var x = tile.gridX;
      var y = tile.gridY;

      // Add adjacent tiles
      addTile(x-1, y-1, queue);
      addTile(x,   y-1, queue);
      addTile(x+1, y-1, queue);

      addTile(x-1, y, queue);
      addTile(x+1, y, queue);

      addTile(x-1, y+1, queue);
      addTile(x,   y+1, queue);
      addTile(x+1, y+1, queue);
    }

    tile.loadTexture(image, 0, false);
    tile.shown = true;
  }

  function addTile(x, y, queue) {
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      queue.push(grid[x][y]);
    }
  }

  function addMine(tile) {
    tile.value = MINE;

    var x = tile.gridX;
    var y = tile.gridY;

    incrementTile(x-1, y-1);
    incrementTile(x,   y-1);
    incrementTile(x+1, y-1);

    incrementTile(x-1, y);
    incrementTile(x+1, y);

    incrementTile(x-1, y+1);
    incrementTile(x,   y+1);
    incrementTile(x+1, y+1);
  }

  function incrementTile(x, y) {
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      var tile = grid[x][y];
      if (tile.value != MINE) {
        tile.value++;
      }
    }
  }

  function gameOver(lost) {
    for (var x = 0; x < gridWidth; x++) {
      for (var y = 0; y < gridHeight; y++) {
        var tile = grid[x][y];
        var image = getImage(tile);
        tile.loadTexture(image, 0, false);
      }
    }

    gameEnded = true;
    endGameText.text = lost ? 'Game Over!' : 'You Won!';
  }

  function restartGame() {
    game.state.restart();
  }

  function getImage(tile) {
    switch(tile.value) {
      case 0:     return "0";
      case 1:     return "1";
      case 2:     return "2";
      case 3:     return "3";
      case 4:     return "4";
      case 5:     return "5";
      case 6:     return "6";
      case 7:     return "7";
      case 8:     return "8";
      case MINE:  return "mine";
      default:    return "unknown";
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
