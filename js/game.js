'use strict'

const WALL = '#'
const FOOD = '○'
const EMPTY = ' '
const POWERFOOD = '♣'

const gGame = {
    score: 0,
    isOn: false
}

var gBoard
var gFoodLeft = 56

function onInit() {
    // console.log('hello')
    gBoard = buildBoard()
    createGhosts(gBoard, 2)
    createPacman(gBoard)
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true

}

function onStartGame() {
    // don't displey modal
    var elModal = document.querySelector('.modalGameEnd')
    elModal.style.display = 'none'
    //displey board
    var elBoard = document.querySelector('.board-container')
    elBoard.style.display = 'block'
    //update score
    gGame.score = 0
    gGame.isOn = false
    updateScore(-gGame.score)

    onInit()
}

function gameOver(isWin) {
    console.log('Game Over')
    // stop game
    clearInterval(gIntervalGhosts)
    gGame.isOn = false
    renderCell(gPacman.location, '🪦')

    //update modal
    var img = (isWin) ? 'win' : 'lose'
    var elModalImg = document.querySelector('.modalImg')
    elModalImg.src = `img/${img}.jpg`

    //displey modal
    var elModal = document.querySelector('.modalGameEnd')
    elModal.style.display = 'block'

    // don't displey board
    var elBoard = document.querySelector('.board-container')
    elBoard.style.display = 'none'


}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }

    board[1][1] = POWERFOOD
    board[8][1] = POWERFOOD
    board[8][8] = POWERFOOD
    board[1][8] = POWERFOOD
    return board
}

function updateScore(diff) {
    // TODO: update model and dom
    // Model
    gGame.score += diff
    // DOM
    document.querySelector('h2 span').innerText = gGame.score
}

function onPowerFood() {
    gPacman.isSuper = true
    setTimeout((endPowerFood), 5000)
}

function endPowerFood() {
    gPacman.isSuper = false
    var diff = 2 - gGhosts.length
    createGhosts(gBoard, diff)
}


