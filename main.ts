controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    custom.showChecklist()
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    custom.hideChecklist()
})
custom.drawTasks(
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
    if (custom.didTaskJustGetUnchecked(1)) {
        info.setScore(0)
    } else if (custom.didTaskJustGetChecked(1)) {
        info.changeScoreBy(1)
    }
})
