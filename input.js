let selectedColumn = 0
let mouseX = 0
let mouseY = 100

window.addEventListener("mousemove", function(evt){
	if(gametray.getWinner() || gametray.isFull()) return
	let columnWidth = TRAY_WIDTH / 7
	mouseX = evt.clientX-canvas.getBoundingClientRect().x
	mouseY = evt.clientY;
	if(mouseX < TRAY_POS.x) mouseX = TRAY_POS.x
	if(mouseX >= TRAY_POS.x + TRAY_WIDTH) mouseX = TRAY_POS.x + TRAY_WIDTH - 1
	selectedColumn = Math.floor((mouseX-TRAY_POS.x) / columnWidth)
	tokens[0].hold(selectedColumn)
})

window.addEventListener("mousedown", () => {
	let canvasRect = canvas.getBoundingClientRect();
	if( contains({x:mouseX, y:mouseY}, canvasRect)){
		attemptPlay(selectedColumn)
	}
})

window.addEventListener("keydown", function(evt){
	if(evt.key == 'u'){
		if(difficultySelect.value == 8) {
			alert("You can't undo againt Chad :)")
			return
		}
		undo()
		undo()
	}
	if(evt.key == 'b'){
		bot.easy(tokens[0].getColor())
	}
	if(evt.key == 'r'){
		resetGame()
	}
})

function contains(point, rect){
	if( point.x >= rect.x &&
		point.x <= rect.width + rect.x &&
		point.y >= rect.y &&
		point.y <= rect.y + rect.height
	){
		return true
	}else{
		return false
	}
}
