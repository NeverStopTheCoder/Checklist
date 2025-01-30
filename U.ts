// Add your code here
//%block="Checklist"
//% weight=75 color=#CC3333 icon=""
namespace custom {
    // Array to store tasks and their completion status
    let tasks: { name: string, completed: boolean }[] = [];

    // Constants for positioning
    const startX = 20; // X position for text
    const boxX = 5; // X position for the checkbox
    const boxSize = 8; // Size of the checkbox
    const maxVisibleTasks = 7; // Maximum visible tasks
    let selectedItem = 0; // Currently selected task
    let scrollOffset = 0; // Tracks scrolling position
    let checklistVisible = true; // Controls checklist visibility

    // Function to create the block for 9 tasks
    //%group="Create"
    //% block="Draw tasks: task1 $task1 task2 $task2 task3 $task3 task4 $task4 task5 $task5 task6 $task6 task7 $task7 task8 $task8 task9 $task9"
    //% task1.shadow="text" task2.shadow="text" task3.shadow="text" task4.shadow="text" task5.shadow="text"
    //% task6.shadow="text" task7.shadow="text" task8.shadow="text" task9.shadow="text"
    export function drawTasks(
        task1: string, task2: string, task3: string, task4: string, task5: string,
        task6: string, task7: string, task8: string, task9: string
    ): void {
        // Initialize task list
        tasks = [
            { name: task1, completed: false }, { name: task2, completed: false },
            { name: task3, completed: false }, { name: task4, completed: false },
            { name: task5, completed: false }, { name: task6, completed: false },
            { name: task7, completed: false }, { name: task8, completed: false },
            { name: task9, completed: false }
        ];

        game.onPaint(function () {
            if (!checklistVisible) return; // Stop drawing if hidden

            let yPosition = 10; // Starting Y position
            let visibleTasks = tasks.slice(scrollOffset, scrollOffset + maxVisibleTasks);

            for (let i = 0; i < visibleTasks.length; i++) {
                const task = visibleTasks[i];

                // Draw checkbox
                screen.drawRect(boxX, yPosition, boxSize, boxSize, 1);
                if (task.completed) {
                    screen.fillRect(boxX + 2, yPosition + 2, boxSize - 4, boxSize - 4, 1);
                }

                // Draw task text with wrapping
                let textHeight = wrapAndDrawText(task.name, startX, yPosition, 120);

                // Highlight selected task
                if (i + scrollOffset === selectedItem) {
                    screen.drawRect(startX - 4, yPosition - 2, 100, textHeight + 4, 4);
                }

                yPosition += textHeight + 6; // Adjust spacing based on wrapped text
            }
        });

        // Function to wrap and draw text
        function wrapAndDrawText(text: string, x: number, y: number, wrapWidth: number): number {
            let words = text.split(" ");
            let currentLine = "";
            let currentY = y;
            const lineHeight = 12;
            let totalHeight = lineHeight;

            for (const word of words) {
                let testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
                if (testLine.length * 6 > wrapWidth) {
                    screen.print(currentLine, x, currentY);
                    currentLine = word;
                    currentY += lineHeight;
                    totalHeight += lineHeight;
                } else {
                    currentLine = testLine;
                }
            }
            screen.print(currentLine, x, currentY);
            return totalHeight;
        }

        // Toggle checkbox
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (checklistVisible && tasks.length > 0) {
                tasks[selectedItem].completed = !tasks[selectedItem].completed;
            }
        });

        // Move selection up
        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            if (checklistVisible && selectedItem > 0) {
                selectedItem--;
                if (selectedItem < scrollOffset) {
                    scrollOffset = selectedItem;
                }
            }
        });

        // Move selection down
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            if (checklistVisible && selectedItem < tasks.length - 1) {
                selectedItem++;
                let textHeight = getTaskHeight(selectedItem);
                let nextTaskPosition = getTaskPosition(selectedItem);

                if (nextTaskPosition + textHeight > 100) { // Adjust scrolling based on text height
                    scrollOffset++;
                }
            }
        });

        // Get the height of a task's text
        function getTaskHeight(index: number): number {
            return tasks[index].name.length > 20 ? 24 : 12;
        }

        // Get the position of a task
        function getTaskPosition(index: number): number {
            let y = 10;
            for (let i = 0; i < index; i++) {
                y += getTaskHeight(i) + 6;
            }
            return y;
        }
    }

    //% block="Hide checklist"
    //%group="Functions"
    export function hideChecklist(): void {
        checklistVisible = false;
    }

    //% block="Show checklist"
     //%group="Functions"
    export function showChecklist(): void {
        checklistVisible = true;
    }
    // Track previous state of tasks
    let previousTaskStates: boolean[] = [];

    // Track previous states of tasks (checked or unchecked)
    let prevCheckedStates: boolean[] = [];
   
    let lastCheckedState: { [key: number]: boolean } = {}; // Tracks previous states

    //% block="did task $taskNumber just get unchecked?"
     //%group="Functions"
    //% taskNumber.min=1 taskNumber.max=9
    export function didTaskJustGetUnchecked(taskNumber: number): boolean {
        let currentState = tasks[taskNumber - 1].completed; // Get current checked state

        if (!currentState && lastCheckedState[taskNumber] === true) {
            lastCheckedState[taskNumber] = false; // Update to reflect the new unchecked state
            return true; // Fire once when it switches to unchecked
        }

        // Ensure state is tracked properly for future toggles
        if (currentState) {
            lastCheckedState[taskNumber] = true;
        }

        return false;
    }

let lastCheckedState2: { [key: number]: boolean } = {}; // Stores last known checked states

//% block="did task $taskNumber just get checked?"
 //%group="Functions"
//% taskNumber.min=1 taskNumber.max=9
export function didTaskJustGetChecked(taskNumber: number): boolean {
    let currentState = tasks[taskNumber - 1].completed; // Get current checked state

    if (currentState && !lastCheckedState2[taskNumber]) {
        lastCheckedState2[taskNumber] = true; // Mark as checked
        return true; // Fire once when checked
    }

    if (!currentState) {
        lastCheckedState2[taskNumber] = false; // Reset when unchecked
    }

    return false; // Otherwise, do nothing
}
}
