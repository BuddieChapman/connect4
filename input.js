let selectedColumn = 0

window.addEventListener("mousemove", function(evt){
	if(gametray.getWinner() || gametray.isFull()) return
	let columnWidth = TRAY_WIDTH / 7
	mouseX = evt.clientX-canvas.getBoundingClientRect().x
	if(mouseX < TRAY_POS.x) mouseX = TRAY_POS.x
	if(mouseX >= TRAY_POS.x + TRAY_WIDTH) mouseX = TRAY_POS.x + TRAY_WIDTH - 1
	selectedColumn = Math.floor((mouseX-TRAY_POS.x) / columnWidth)
	tokens[0].hold(selectedColumn)
})

window.addEventListener("mousedown", () => attemptPlay(selectedColumn))

window.addEventListener("keydown", function(evt){
	if(evt.key == 'u'){
		undo()
	}
	if(evt.key == 'b'){
		bot.easy(tokens[0].getColor())
	}
	if(evt.key == 'r'){
		resetGame()
	}
})