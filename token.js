/* Token.js
 *
 * The Token class provides an interface for positioning, dropping, and drawing
 * the game tokens in the game. They are not related to the actual game logic and
 * are handled separately.
 */

const TOKEN_RADIUS = 25
const TOKEN_DIAMETER = 2*TOKEN_RADIUS
const DROP_SPEED = 3
const BLACK = 1
const RED = -1

function Token(tokenColor = BLACK){
	let x = -TOKEN_RADIUS
	let y = -TOKEN_RADIUS
	let speed = 0
	let falling = false
	let color = tokenColor == RED ? RED : BLACK
	let targetHeight = 0
	
	this.drawToken = function(){
		if(color == RED){
			ctx.fillStyle = "rgb(228, 78, 58)"
		}else{
			ctx.fillStyle = 'black'
		}
		ctx.beginPath()
		ctx.ellipse(x, y, TOKEN_RADIUS, TOKEN_RADIUS, 0, 0, 2*Math.PI)
		ctx.fill()
	}
	
	this.getY = function(){
		return y
	}
	
	this.hold = function(column){
		x = TRAY_POS.x + TRAY_BUFFER + TOKEN_RADIUS + (TOKEN_DIAMETER + TRAY_BUFFER) * column
		y = TRAY_POS.y - TOKEN_RADIUS
		speed = 0
		falling = false
	}
	
	this.drop = function(){
		falling = true
	}
	
	this.update = function(){
		if(falling){
			speed += DROP_SPEED
			y += speed
			if(y >= targetHeight){
				y = targetHeight
				falling = false
				speed = 0
			}
		}
	}
	
	this.getColor = function(){
		return color
	}
	
	this.setTargetHeight = function(height){
		targetHeight = height
	}
	
	this.holdColumn = function(column){
		tokens[0].hold({
			x: TRAY_POS.x + TRAY_BUFFER + TOKEN_RADIUS + (TOKEN_DIAMETER + TRAY_BUFFER) * column,
			y: TOKEN_RADIUS
		})
	}
}
