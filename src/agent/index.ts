/// <reference path="./codingame.d.ts" />

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const laps = parseInt(readline());
const checkpointCount = parseInt(readline());
for (let i = 0; i < checkpointCount; i++) {
    var inputs = readline().split(' ');
    const checkpointX = parseInt(inputs[0]);
    const checkpointY = parseInt(inputs[1]);
}

// game loop
while (true) {
    for (let i = 0; i < 2; i++) {
        var inputs = readline().split(' ');
        const x = parseInt(inputs[0]); // x position of your pod
        const y = parseInt(inputs[1]); // y position of your pod
        const vx = parseInt(inputs[2]); // x speed of your pod
        const vy = parseInt(inputs[3]); // y speed of your pod
        const angle = parseInt(inputs[4]); // angle of your pod
        const nextCheckPointId = parseInt(inputs[5]); // next check point id of your pod
    }
    for (let i = 0; i < 2; i++) {
        var inputs = readline().split(' ');
        const x2 = parseInt(inputs[0]); // x position of the opponent's pod
        const y2 = parseInt(inputs[1]); // y position of the opponent's pod
        const vx2 = parseInt(inputs[2]); // x speed of the opponent's pod
        const vy2 = parseInt(inputs[3]); // y speed of the opponent's pod
        const angle2 = parseInt(inputs[4]); // angle of the opponent's pod
        const nextCheckPointId2 = parseInt(inputs[5]); // next check point id of the opponent's pod
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');


    // You have to output the target position
    // followed by the power (0 <= power <= 200)
    // i.e.: "x y power"
    print('8000 4500 100');
    print('8000 4500 100');
}