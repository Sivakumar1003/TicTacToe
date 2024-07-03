// =======================================================
//                      Initialize
// =======================================================
var playerStart = true; // true: player plays first

// fontawesome icons
var cross = '<i class="fas fa-times fa-6x">';
var circle = '<i class="far fa-circle fa-5x">';

var turnCross = true; // true: next click will show cross
var gameOver = false; 

var boardStatus = new Array(9).fill(null);

// =======================================================
//                      Game Logics
// =======================================================

// player select if play 'x' or 'o'
function selectPlay(player) {
    // modify the variables
    playerStart = player === 'x' ? true : false;
    // hide the settings div
    document.getElementById('settings').style.display = 'none';
    // display the board
    document.getElementById('gameBoard').style.display = 'inline-block';
    // if player select o. Computer starts
    if (!playerStart) computerTurn();
}

function handleClick(element) {
    var id = element.id;
    var square = document.getElementById(id);

    // if square is not empty -> error or if gameOver
    if (square.innerHTML !== "" || gameOver) {
        return 0;
    }
    
    play(id);
    computerTurn();
}

function computerTurn() {
    var board = document.getElementById('grid');

    // computer turn
    minmax(boardStatus, turnCross, 0);
    // enclosed logics in setTimeout to give a more natural flow
    board.style.pointerEvents = 'none';
    setTimeout(function(){
        play(choice);
        board.style.pointerEvents = 'auto';
    }, 1000);
}

function play(id) {
    var square = document.getElementById(id);
    var currPlayer = document.getElementById('currPlayer');

    // modify DOM
    square.innerHTML = turnCross ? cross : circle;
    square.className = '';
    
    // modify board status
    currPlayer.innerHTML = !turnCross ? 'x' : 'o';
    boardStatus[id] = turnCross ? 'x' : 'o';
    turnCross = !turnCross;

    var wonPlayer = checkBoard(boardStatus);
    if (wonPlayer) { 
        var str;
        gameOver = true;
        if (wonPlayer === 'draw') {
            str = '<p>Draw!</p>';
        } else {
            str = '<p>' + wonPlayer + ' won!</p>';
        }
        document.getElementById('whoseTurn').innerHTML = str;
    }
}

function checkBoard(game) {
    var winTable = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // columns
        [0,4,8], [2,4,6]           // diagonals
    ];

    // Handle draw
    if(!game.includes(null)) {
        return 'draw';
    }

    for (var i = 0, n = winTable.length; i < n; i++) {
        var combination = winTable[i];
        if (game[combination[0]] !== null && 
            game[combination[0]] === game[combination[1]] &&
            game[combination[0]] === game[combination[2]] ) {
             // winning combination
             return game[combination[0]];
         }
    }
    return 0;
}

// minmax algorithm
var choice;
function minmax(game, nextCross, depth) {
    if (checkBoard(game)) return score(game, depth);
    depth += 1;
    var scores = [];
    var moves = [];
    var move = nextCross ? 'x' : 'o';

    game.forEach(function(item, index) {
        if(!item) {
            var possibleGame = game.slice(); // Use of slice method to copy the array
            possibleGame[index] = move;
            scores.push(minmax(possibleGame, !nextCross, depth));
            moves.push(index);
        }
    });
    if (move === 'o') { // max calc
        var val = scores.reduce(function(a, b) {
            return Math.max(a,b);
        });
    } else {    // min calc
        var val = scores.reduce(function(a, b) {
            return Math.min(a,b);
        });
    }
    choice = moves[scores.indexOf(val)];
    return(val);
}

function score(game, depth) {
    // Score the game and define the related score
    var won = checkBoard(game);
    if (won === 'o') {
        return 10 - depth;
    } else if (won === 'x') {
        return depth - 10;
    } else {
        return 0;
    }
}


function restart() {
    turnCross = true; // true: next click will show cross
    gameOver = false; 
    // display the settings div
    document.getElementById('settings').style.display = 'grid';
    // hide the board
    document.getElementById('gameBoard').style.display = 'none';
    // board title
    document.getElementById('whoseTurn').innerHTML = '<p><span id="currPlayer">X</span>&#8217;s turn</p>';

    // reset the board
    boardStatus = new Array(9).fill(null);
    for(var i = 0; i < 9; i++) {
        document.getElementById(i).innerHTML = '';
    }
}