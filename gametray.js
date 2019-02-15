const TRAY_BUFFER = 7 // space between tokens in tray
const TRAY_WIDTH = 7*TOKEN_DIAMETER + 8*TRAY_BUFFER
const TRAY_HEIGHT = 6*TOKEN_DIAMETER + 2*TRAY_BUFFER
const HOLE_SIZE_DIFFERENCE = 3

const gametray = new Gametray()

function Gametray(){
	// tray is visualized sideways here so
	// it can be referenced as tray[column][row]
	// rather than tray[row][column]
	let tray = [
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0],
		[0,0,0,0,0,0]
	]
	
	let moveHistory = []
	
	this.play = function(column, color){
		if(color == undefined) console.warn("no color specified on play")
		if(this.getWinner()) return false
		if(tray[column][0] != 0) return false
		let row = 0
		while(row < 5 && tray[column][row+1] == 0){
			++row
		}
		tray[column][row] = color
		moveHistory.push({col: column, row: row})
		return true
	}
	
	this.getWinner = function(){
		// check for 4 in a row horizontally
		for(let c = 0; c <= 3; ++c){
			for(let r = 0; r < 6; ++r){
				if(tray[c][r] != 0 && tray[c][r] == tray[c+1][r] && tray[c][r] == tray[c+2][r] && tray[c][r] == tray[c+3][r]) return tray[c][r]
			}
		}
		
		// check for 4 in a row vertically
		for(let c = 0; c < 7; ++c){
			for(let r = 0; r <= 2; ++r){
				if(tray[c][r] != 0 && tray[c][r] == tray[c][r+1] && tray[c][r] == tray[c][r+2] && tray[c][r] == tray[c][r+3]) return tray[c][r]
			}
		}
		
		//check for 4 in a row diagonally
		for(let c = 0; c <= 3; ++c){
			for(let r = 0; r <= 2; ++r){
				if(tray[c][r] != 0 && tray[c][r] == tray[c+1][r+1] && tray[c][r] == tray[c+2][r+2] && tray[c][r] == tray[c+3][r+3]) return tray[c][r]
			}
		}
		for(let c = 0; c <= 3; ++c){
			for(let r = 3; r <= 5; ++r){
				if(tray[c][r] != 0 && tray[c][r] == tray[c+1][r-1] && tray[c][r] == tray[c+2][r-2] && tray[c][r] == tray[c+3][r-3]) return tray[c][r]
			}
		}
		return 0
	}
	
	this.getTray = function(){
		return Array.from(tray)
	}
	
	this.draw = function(x, y){
		ctx.fillStyle = 'blue'
		ctx.beginPath()
		ctx.rect(x, y, TRAY_WIDTH, TRAY_HEIGHT)
		for(let c = 0; c < 7; ++c){
			ctx.moveTo(x + TRAY_BUFFER + TOKEN_DIAMETER - HOLE_SIZE_DIFFERENCE + (TOKEN_DIAMETER + TRAY_BUFFER) * c, y)
			for(let r = 0; r < 6; ++r){
				ctx.ellipse(x + TRAY_BUFFER + TOKEN_RADIUS + (TOKEN_DIAMETER + TRAY_BUFFER) * c,
							y + TRAY_BUFFER + TOKEN_RADIUS + TOKEN_DIAMETER * r,
							TOKEN_RADIUS - HOLE_SIZE_DIFFERENCE, TOKEN_RADIUS - HOLE_SIZE_DIFFERENCE, 0, 0, 2*Math.PI, true)
			}
			ctx.moveTo(x + TRAY_BUFFER + TOKEN_DIAMETER - HOLE_SIZE_DIFFERENCE + (TOKEN_DIAMETER + TRAY_BUFFER) * c, y)
		}
		ctx.fill()
	}
	
	this.isFull = function(){
		for(let i = 0; i < 7; ++i){
			if(tray[i][0] == 0) return false
		}
		return true
	}
	
	this.isEmpty = function(){
		for(let c = 0; c < 7; ++c){
			if(tray[c][5] != 0) return false
		}
		return true
	}
	
	this.undo = function(){
		if(moveHistory.length == 0) return
		let previousMove = moveHistory.pop()
		tray[previousMove.col][previousMove.row] = 0
	}
	
	this.countWinningMoves = function(color){
		if(this.getWinner() || this.isFull()){
			console.warn("cannot count winning mvoes. game is over.")
			return
		}
		let count = 0
		for(let i = 0; i < 7; ++i){
			if(this.play(i, color)){
				if(this.getWinner() == color){
					++count
				}
				this.undo()
			}
		}
		return count
	}
	
	this.getWinningPositions = function(){
		let positions = []
		for(let c = 0; c < 7; ++c){
			for(let r = 0; r < 6; ++r){
				if(tray[c][r] == 0){
					tray[c][r] = RED
					if(this.getWinner() == RED){
						positions.push({col: c, row: r, color: RED})
					}
					tray[c][r] = BLACK
					if(this.getWinner() == BLACK){
						positions.push({col: c, row: r, color: BLACK})
					}
					tray[c][r] = 0
				}
			}
		}
		return positions
	}
	
	this.clearTray = function(){
		for(let c = 0; c < 7; ++c){
			for(let r = 0; r < 6; ++r){
				tray[c][r] = 0
			}
		}
	}
}