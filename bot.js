let difficultySelect = document.getElementById("difficulty-select")


function _playRandom(){
	if(gametray.isFull() || gametray.getWinner()) return false
	let played = false
	let column = 0
	while(!played){
		column = Math.floor(Math.random()*7)
		played = attemptPlay(column, BLACK)
	}
	console.log("played at " + column)
	return true
}

function playRandom(){
	attemptPlay(Math.floor(Math.random()*7))
}

const bot = new Bot()

function Bot(){
	let best = 0
	
	this.easy = function(color){
		let start = 0
		let difficulty = difficultySelect.value;
		if(Date.now() - lastTimePlayed > playDelay){
			minimax(difficulty, color)
			console.log(best)
			attemptPlay(best)
			console.log(scoreWinningPositions(RED))
		}
	}

	// the maximizing player is assumed to be the player who's turn it is
	function minimax(depth, playerTurn){
		if(depth == 0 || gametray.getWinner() || gametray.isFull()){
			return getScore(tokens[0].getColor())
		}
		let scores = []
		if(playerTurn == tokens[0].getColor()){ // maximizing player
			for(let i = 0; i < 7; ++i){
				if(gametray.play(i, playerTurn)){
					scores.push(minimax(depth-1, playerTurn == RED ? BLACK : RED))
					gametray.undo()
				}else{
					scores.push(-10000)
				}
			}
			best = scores.findIndex((score) => score == Math.max(...scores))
			return Math.max(...scores)
		}else{ //minimizing player
			for(let i = 0; i < 7; ++i){
				if(gametray.play(i, playerTurn)){
					scores.push(minimax(depth-1, playerTurn == RED ? BLACK : RED))
					gametray.undo()
				}else{
					scores.push(10000)
				}
			}
			return Math.min(...scores)
		}
	}

	function getScore(player){
		return scoreWinningMove(player) + scoreCenterControl(player) + 4*scoreWinningPositions(player)
	}
	
	function scoreWinningMove(player){
		let winner = gametray.getWinner()
		if(winner){
			if(winner == player) return 1000
			return -1000
		}
		return 0
	}
	
	function scoreCenterControl(player){
		let score = 0
		for(let c = 0; c < 7; ++c){
			for(r = 0; r < 6; ++r){
				if(gametray.getTray()[c][r]){
					let x = c - 3
					if(x > 0) x *= -1
					x += 3
					if(gametray.getTray()[c][r] == player){
						score += x
					}else{
						score -= x
					}
				}
			}
		}
		return score
	}
	
	function scoreWinningPositions(player){
		let winningPositions = gametray.getWinningPositions()
		return winningPositions.reduce((acc, pos) => {
			if(pos.color == player) return acc + 1
			return acc - 1
		}, 0)
	}
}




























function _minMax(depth){
	console.log("winning moves: " + gametray.countWinningMoves(RED))
	let scores = [0,0,0,0,0,0,0]
	let best = 0
	for(let i = 0; i < 7; ++i){
		scores[i] = getScore(i, depth)
		console.log(i, scores[i])
	}
	for(let i = 1; i < 7; ++i){
		if(scores[i] > scores[best]){
			best = i
		}
	}
	console.log('best = ', best)
	return best
}

function _getScore(column, depth, currentDepth = 0, turn = tokens[0].getColor()){
	let score = 0
	if(!gametray.play(column, turn)){
		if(currentDepth == 0){
			return -1000000
		}else{
			return 0
		}
	}
	++currentDepth
	let weight = column - 3
	if(weight > 0) weight *= -1
	let winner = gametray.getWinner()
	if(winner){
		if(winner == tokens[0].getColor()){
			score = 1000
		}else{
			score = -1000
		}
	}else{
		if(currentDepth < depth){
			for(let i = 0; i < 7; ++i){
				let nextTurn = turn == BLACK ? RED : BLACK
				score += getScore(i, depth, currentDepth, nextTurn)
			}
			score += weight
		}else{
			score = weight
		}
	}
	score = score / currentDepth
	gametray.undo()
	return score
}
