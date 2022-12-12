'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/candy.png">'
// Model:
var gBoard
var gGamerPos
var gScore
var gCountBalls
var gIntervalAddBall
var gIntervalGlue
var gIsGlue

function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    gScore = 0
    gCountBalls = 2

    var elImg = document.querySelector('.winLose')
    elImg.style.display = 'none'
}

function onStartGame(elBtn) {
    onInitGame()
    elBtn.style.display = 'none'
    var elScore = document.querySelector('.score')
    elScore.style.display = 'block'
    updateScore()
    renderBoard(gBoard)
    gIntervalAddBall = setInterval(addBall, 5000)
    // gIntervalGlue = setInterval(addGlue, 5000)
    // setInterval(removeGlue, 8000)
}

function onEndGame(isWin) {
    var elBtn = document.querySelector('.start')
    elBtn.style.display = 'block'
    var elScore = document.querySelector('.score')
    elScore.style.display = 'none'

    var img = (isWin) ? 'win' : 'lose'

    var elImg = document.querySelector('.winLose')
    elImg.src = `img/${img}.jpg`
    elImg.style.display = 'block'
    var elboard = document.querySelector('.board')
    elboard.style.display = 'none'
}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null, onGlue:false }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    //update FLOOR
    board[0][6].type = FLOOR
    board[9][6].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL

    console.log(board)
    return board
}

function updateScore() {
    var elScore = document.querySelector('.score')
    elScore.innerText = gScore
}

// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
    elBoard.style.display = 'block'
}

function addBall() {
    var posI = getRandomInt(0, 10)
    var posJ = getRandomInt(0, 12)
    //console.log(posI, posJ)

    //need to add cell left to avoid an infinite loop
    var currCell = gBoard[posI][posJ]
    console.log(currCell)
    if (!currCell.gameElement && currCell.type === FLOOR) {
        //update modal
        gBoard[posI][posJ].gameElement = BALL

        var location = { i: posI, j: posJ }
        renderCell(location, BALL_IMG)
        gCountBalls++
    }
    else if (gCountBalls > 78) {
        onEndGame(false)
        clearInterval(gIntervalAddBall)
    }
    else addBall()
}

function addGlue() {
    var posI = getRandomInt(0, 10)
    var posJ = getRandomInt(0, 12)
    //console.log(posI, posJ)

    //need to add cell left to avoid an infinite loop
    var currCell = gBoard[posI][posJ]
    console.log(currCell)
    if (!currCell.gameElement && currCell.type === FLOOR) {
        //update modal
        gBoard[posI][posJ].gameElement = GLUE
        var location = { i: posI, j: posJ }
        gGluePos = location
        renderCell(location, GLUE_IMG) 
    }
    // setInterval(removeGlue, 8000)
}

function removeGlue(){
    renderCell(gGluePos, '')
    gGluePos = null
}

// Move the player to a specific location
function moveTo(i, j) {

    console.log(i, j)
    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)


    var pass = false
    if(gGamerPos.i === 5 && i === 5 ) pass = true
    else if(gGamerPos.j === 6 && j === 6 ) pass = true

    console.log(pass)
    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || pass) {
        if(targetCell.gameElement === GLUE){
            setTimeout(wasteTime, 3000)
            console.log('glue')
        }
        else if (targetCell.gameElement === BALL) {
            console.log('Collecting!')
            gScore++
            gCountBalls--
            // document.getElementById("audioBall").loop = true;
        }
        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)
        if (gCountBalls === 0) onEndGame(true)
    }

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
    updateScore()

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    console.log('event.key:', event.key)

    switch (event.key) {
        case 'ArrowLeft':
            if(j === 0) moveTo(i, 11)
            else moveTo(i, j - 1)
            break
        case 'ArrowRight':
            if(j === 11) moveTo(i, 0)
            else moveTo(i, j + 1)
            break
        case 'ArrowUp':
            if(i === 0) moveTo(9, j)
            else moveTo(i - 1, j)
            break
        case 'ArrowDown':
            if(i === 9) moveTo(0, j)
            else moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

//do nothing function
function wasteTime(){

}