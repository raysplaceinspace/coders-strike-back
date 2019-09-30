import * as w from '../world';
import * as angles from '../util/angles';
import * as log from '../log';
import * as simulator from '../simulator';
import { Vec } from '../util/vector';

const StepMultiplier = 20; // Make this large so the step looks obvious in the debugger
const NumIterations = 1000;

export function choose(world: w.World, podId: number): w.Action {
    const pod = world.pods[podId];
    const checkpoint = world.checkpoints[pod.nextCheckpointId];

    const initialCost = evaluate(podId, checkpoint.id, world);
    let best: w.Action = {
        type: "thrust",
        target: pod.pos,
        thrust: 0,
        tag: "noop",
    };
    let bestCost = initialCost;

    let improvements = 0;
    for (let i = 0; i < NumIterations; ++i) {
        const actions = new Array<w.Action>();

        const action = generate(podId, world);
        actions[podId] = action;

        const next = simulator.clone(world);
        simulator.tick(next, actions);

        const cost = evaluate(podId, checkpoint.id, next);

        if (cost < bestCost) {
            best = action;
            bestCost = cost;
            ++improvements;
        }
    }

    log.info(`${improvements} improvements: ${initialCost.toFixed(0)} -> ${bestCost.toFixed(0)} cost`);

    return best;
}

function generate(podId: number, world: w.World): w.Action {
    const pod = world.pods[podId];

    const angle = Math.random() * angles.Tau;
    const thrust = Math.random() * w.MaxThrust;

    const step = Vec.fromAngle(angle, thrust * StepMultiplier);
    const target = pod.pos.clone().add(step);

    return {
        type: "thrust",
        target,
        thrust,
        tag: `(${step.x.toFixed(0)},${step.y.toFixed(0)})`,
    };
}

function evaluate(podId: number, checkpointId: number, world: w.World) {
    const pod = world.pods[podId];
    if (pod.nextCheckpointId !== checkpointId) {
        // Hit the checkpoint
        return 0;
    }

    const checkpoint = world.checkpoints[checkpointId];

    const momentumDestination = pod.pos.clone().addMul(pod.velocity, 1 / w.Friction);
    const diff = Vec.diff(checkpoint.pos, momentumDestination);

    const angleDelta = angles.angleDelta(pod.angle, diff.angle());
    const turnTicks = Math.abs(angleDelta) / w.TurnRate;

    return diff.length() * Math.max(1, turnTicks);
}