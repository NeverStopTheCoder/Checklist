controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    custo.showChecklist()
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    custo.hideChecklist()
})
custo.drawTasks(
"1",
"2",
"3",
"4",
"5",
"6",
"7",
"8",
"9"
)
forever(function () {
    if (custo.didTaskJustGetUnchecked(1)) {
        info.setScore(0)
    } else if (custo.didTaskJustGetChecked(1)) {
        info.changeScoreBy(1)
    }
})
