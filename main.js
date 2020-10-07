const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.setAttribute('width', GAME_WIDTH)
canvas.setAttribute('height', GAME_HEIGHT)
const TRAY_POS = {x: (canvas.width-TRAY_WIDTH)/2, y: 50}

let nextTurn = RED
let tokens = []
let lastTimePlayed = 0
const playDelay = 450


addToken()
setInterval(() => {
	if(tokens[0].getColor() == BLACK) bot.easy(BLACK)
	updateTokens()
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawTokens()
	gametray.draw(TRAY_POS.x, TRAY_POS.y)
	ctx.fillText(nextTurn==RED ? 'black' : 'red', 20, 20)
	ctx.fillText(winnerToText(), 20, 40)
}, 30)

function addToken(){
	tokens.unshift(new Token(nextTurn))
	swapNextTurn()
	tokens[0].hold(selectedColumn)
}

function drawTokens(){
	for(let i = 0; i < tokens.length; ++i){
		tokens[i].drawToken()
	}
}

function updateTokens(){
	for(let i = tokens.length - 1; i >= 0; --i){
		tokens[i].update()
		if(tokens[i].getY() >= canvas.height + TOKEN_RADIUS){
			tokens.splice(i, 1)
		}
	}
}

function swapNextTurn(){
	if(nextTurn == RED){
		nextTurn = BLACK
	}else{
		nextTurn = RED
	}
}

function undo(){
	if(gametray.isEmpty()) return
	// no token is being held. only previous move should be removed
	if(gametray.getWinner() || gametray.isFull()){
		tokens.splice(0, 1)
		swapNextTurn()
	// a token is being held. remove it and the previous move
	}else{
		tokens.splice(0, 2)
	}
	gametray.undo()
	addToken()
}

function winnerToText(){
	let winner = gametray.getWinner()
	if(winner === 0){
		return gametray.isFull() ? "Tie Game" : ""
	}
	return winner == RED ? "Red Wins!" : "Black Wins!"
}

function attemptPlay(column){
	if(Date.now() - lastTimePlayed < playDelay) return
	if(gametray.play(column, tokens[0].getColor())){
		tokens[0].hold(column)
		let targetHeight = 5
		while(targetHeight > 0 && gametray.getTray()[column][targetHeight-1]){
			--targetHeight
		}
		targetHeight = targetHeight * TOKEN_DIAMETER + TOKEN_RADIUS + TRAY_BUFFER + TRAY_POS.y
		tokens[0].setTargetHeight(targetHeight)
		tokens[0].drop()
		if(!gametray.getWinner() && !gametray.isFull()){
			addToken()
		}
		lastTimePlayed = Date.now()
		return true
	}
	return false
}

function resetGame(){
	for(let i = 0; i < tokens.length; ++i){
		tokens[i].setTargetHeight(canvas.height + TOKEN_RADIUS)
		tokens[i].drop()
	}
	gametray.clearTray()
	nextTurn = BLACK
	tokens[0] = new Token(RED)
}
