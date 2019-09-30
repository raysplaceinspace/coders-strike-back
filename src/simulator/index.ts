import * as w from '../world';
import * as angles from '../util/angles';
import { Vec } from '../util/vector';

export function clone(world: w.World): w.World {
    const clone: w.World = {
        ...world,
        pods: world.pods.map(pod => clonePod(pod)),
    };
    return clone;
}

function clonePod(pod: w.Pod): w.Pod {
    return {
        ...pod,
        pos: pod.pos.clone(),
        velocity: pod.velocity.clone(),
    };
}

export function tick(world: w.World, actions: w.Action[]) {
    rotate(world, actions);
    accelerate(world, actions);
    move(world);
    advance(world);

    ++world.tick;
}

function rotate(world: w.World, actions: w.Action[]) {
    for (let i = 0; i < world.pods.length; ++i) {
        const pod = world.pods[i];
        const action = actions[i];
        if (action && action.type === "thrust") {
            rotatePod(pod, action.target, world);
        }
    }
}

function accelerate(world: w.World, actions: w.Action[]) {
    for (let i = 0; i < world.pods.length; ++i) {
        const pod = world.pods[i];
        const action = actions[i];
        if (action) {
            let thrust = 0;
            if (action.type === "thrust") {
                thrust = Math.min(w.MaxThrust, action.thrust);
            } else if (action.type === "boost") {
                thrust = w.BoostThrust;
            }

            acceleratePod(pod, thrust, world);
        }
    }
}

function advance(world: w.World) {
    for (let i = 0; i < world.pods.length; ++i) {
        const pod = world.pods[i];
        const checkpoint = world.checkpoints[pod.nextCheckpointId];
        if (insideCheckpoint(pod.pos, checkpoint)) {
            pod.nextCheckpointId = (pod.nextCheckpointId + 1) % world.checkpoints.length;
        }
    }
}

function insideCheckpoint(pos: Vec, checkpoint: w.Checkpoint): boolean {
    return Vec.distance(checkpoint.pos, pos) <= w.CheckpointRadius;
}

function rotatePod(pod: w.Pod, towards: Vec, world: w.World) {
    const diff = Vec.diff(towards, pod.pos);
    const targetAngle = diff.angle();
    if (world.tick === 0) {
        pod.angle = targetAngle;
    } else {
        pod.angle = angles.turnTowards(pod.angle, targetAngle, w.TurnRate);
    }
}

function acceleratePod(pod: w.Pod, thrust: number, world: w.World) {
    pod.velocity.add(Vec.fromAngle(pod.angle, thrust));
}

function move(world: w.World) {
    for (let i = 0; i < world.pods.length; ++i) {
        const pod = world.pods[i];
        movePod(pod, world);
    }
}

function movePod(pod: w.Pod, world: w.World) {
    pod.pos.add(pod.velocity);
    pod.velocity.mul(1 - w.Friction);
}