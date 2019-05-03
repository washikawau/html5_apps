// ------------------------------------
var stage = new Array(20);
var context;
var currentBlock = [[0,0], [0,0], [0,0], [0,0]];
var x, y;
var speed;

// ------------------------------------
window.onload = function() {
  context = document.getElementById('canvas').getContext('2d');
  for (var i = 0; i < stage.length; ++i)
    stage[i] = new Array(12);
  initStage();
  changeCurrentBlock();

  window.addEventListener('keydown', processKeyDown, true);
  speed = 1000;
  timer();
}

// ------------------------------------
var initStage = function() {
  foreach2d(stage, function(i, j) {
    if (i == 19 || j == 0 || j == 11)
      stage[i][j] = 1;
    else
      stage[i][j] = 0;
  });
}

// ------------------------------------
var blocks = [
  [[0, -1], [0, 0], [ 0, 1], [ 0,  2]],
  [[0, -1], [0, 0], [ 1, 0], [-1,  0]],
  [[0, -1], [0, 0], [ 1, 0], [ 1, -1]],
  [[0, -1], [0, 0], [-1, 0], [ 1, -1]],
  [[0, -1], [0, 0], [ 1, 0], [-1, -1]],
  [[0, -1], [0, 0], [ 0, 1], [-1,  1]],
  [[0, -1], [0, 0], [ 0, 1], [ 1,  1]]
];
var changeCurrentBlock = function() {
  x = 6;
  y = 2;
  var num = Math.floor(Math.random() * 7);
  for (var i = 0; i < blocks[num].length; ++i)
    currentBlock[i] = blocks[num][i];
  var r = Math.floor(Math.random() * 4);
  for (var i = 0; i <= r; ++i)
    rotateCurrentBlock(1);
  if (hittest())
    initStage();
  drawCurrentBlock();
  drawStage();
}

// ------------------------------------
var timer = function() {
  drawCurrentBlock(0);
  ++y;
  if (hittest()) {
    --y;
    drawCurrentBlock(3);
    linetest();
    changeCurrentBlock();
  } else {
    drawCurrentBlock(2);
  }
  drawStage();
  setTimeout("timer()", speed);
}

// ------------------------------------
var drawStage = function() {
  foreach2d(stage, function(i, j) {
    switch (stage[i][j]) {
    case 0:
      drawRect([j, i], [200, 200, 200]);
      break;
    case 1:
      drawRect([j, i], [0, 0, 0]);
      break;
    case 2:
      drawRect([j, i], [200, 0, 0]);
      break;
    case 3:
      drawRect([j, i], [0, 0, 200]);
      break;
    }
  });
}

// ------------------------------------
var foreach2d = function(array2d, callbackWithIJ) {
  for (var i = 0; i < array2d.length; ++i)
    for (var j = 0; j < array2d[i].length; ++j)
      callbackWithIJ(i, j);
}

// ------------------------------------
var drawRect = function(pos, rgb) {
  context.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  context.fillRect(
    pos[0] * 16,
    pos[1] * 16,
    15,
    15
  );
}

// ------------------------------------
var drawCurrentBlock = function(cellType) {
  for (var i = 0; i < currentBlock.length; ++i) {
    var cx = x + currentBlock[i][0];
    var cy = y + currentBlock[i][1];
    stage[cy][cx] = cellType;
  }
}

// ------------------------------------
var rotateCurrentBlock = function(r) {
  for (var i = 0; i < currentBlock.length; ++i) {
    var tmp = currentBlock[i][0] * r;
    currentBlock[i][0] = -currentBlock[i][1] * r;
    currentBlock[i][1] = tmp;
  }
}

// ------------------------------------
var hittest = function() {
  for (var i = 0; i < currentBlock.length; ++i) {
    var cx = x + currentBlock[i][0];
    var cy = y + currentBlock[i][1];
    if (cx <= 0 || cx >= 11) return true;
    if (cy >= 19) return true;
    if (stage[cy][cx]) return true;
  }
  return false;
}

// ------------------------------------
var linetest = function() {
  labelLine:
  for (var i = stage.length - 2; i >= 1; --i) {
    for (var j = 1; j < stage[i].length - 1; ++j)
      if (stage[i][j] == 0)
        continue labelLine;

    for (var ii = i; ii >= 1; --ii) {
      for (var j = 1; j < stage[i].length - 1; ++j)
        stage[ii][j] = stage[ii-1][j];
    }

    ++i;
  }
}

// ------------------------------------
var processKeyDown = function(event) {
  var code = event.keyCode;
  var oldx = x;
  var oldy = y;
  var r = 0;
  drawCurrentBlock(0);

  switch (code) {
  case 37: // <-
    event.preventDefault();
    --x;
    break;
  case 39: // ->
    event.preventDefault();
    ++x;
    break;
  case 40: // v
    event.preventDefault();
    ++y;
    break;
  case 88: // X
    event.preventDefault();
    r = 1;
    break;
  case 90: // Z
    event.preventDefault();
    r = -1;
    break;
  }

  if (hittest()) {
    x = oldx;
    y = oldy;
  }

  if (r) {
    rotateCurrentBlock(r);
    if (hittest())
      rotateCurrentBlock(-r);
  }

  drawCurrentBlock(2);
  drawStage();
}
