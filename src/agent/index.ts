import * as w from './world.model';
import * as v from '../util/vector';

export function choose(world: w.World, podId: number): w.Action {
    const pod = world.pods[podId];
    const checkpoint = world.checkpoints[pod.nextCheckpointId];
    return {
        type: "thrust",
        target: checkpoint.pos,
        thrust: 200,
    };
}