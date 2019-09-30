/// <reference path="./index.d.ts" />
import * as agent from '../agent';
import * as w from '../agent/world.model';
import * as v from '../util/vector';

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

function readMap(): w.Map {
    const laps = parseInt(readline());
    const checkpoints = new Array<w.Checkpoint>();
    const checkpointCount = parseInt(readline());
    for (let i = 0; i < checkpointCount; i++) {
        var inputs = readline().split(' ');
        const checkpointX = parseInt(inputs[0]);
        const checkpointY = parseInt(inputs[1]);
        checkpoints.push({
            id: i,
            pos: v.create(checkpointX, checkpointY),
        });
    }
    return {
        laps,
        checkpoints,
    };
}

function readPod(podId: number, teamId: number): w.Pod {
    var inputs = readline().split(' ');
    const x = parseInt(inputs[0]); // x position of your pod
    const y = parseInt(inputs[1]); // y position of your pod
    const vx = parseInt(inputs[2]); // x speed of your pod
    const vy = parseInt(inputs[3]); // y speed of your pod
    const angle = parseInt(inputs[4]); // angle of your pod
    const nextCheckpointId = parseInt(inputs[5]); // next check point id of your pod

    return {
        id: podId,
        teamId,
        pos: v.create(x, y),
        velocity: v.create(vx, vy),
        angle,
        nextCheckpointId,
    };
}

function formatAction(action: w.Action) {
    if (action.type === "thrust") {
        return `${action.target.x.toFixed(0)} ${action.target.y.toFixed(0)} ${action.thrust.toFixed(0)}`;
    } else if (action.type === "shield") {
        return `SHIELD`;
    } else if (action.type === "boost") {
        return `BOOST`;
    } else {
        return "NULL";
    }
}

// initialisation
const map = readMap();

// game loop
let tick = 0;
while (true) {
    const pods = new Array<w.Pod>();
    for (let i = 0; i < 4; i++) {
        const teamId = Math.floor(i / 2);
        const pod = readPod(i, teamId);
        pods.push(pod);
    }

    const world: w.World = {
        ...map,
        tick,
        pods,
    };

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    for (let i = 0; i < 2; ++i) {
        const action = agent.choose(world, i);
        print(formatAction(action));
    }

    ++tick;
}