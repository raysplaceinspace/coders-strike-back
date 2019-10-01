import * as w from '../world';
import * as angles from '../util/angles';
import * as log from '../log';
import * as simulator from '../simulator';
import { Vec } from '../util/vector';

export function choose(world: w.World, podId: number): w.Action {
    const pod = world.pods[podId];
    const checkpoint = world.checkpoints[pod.nextCheckpointId];
    const nextCheckpoint = world.checkpoints[(pod.nextCheckpointId + 1) % world.checkpoints.length];

    const nextPos = pod.pos.clone().add(pod.velocity);
    const targetDiff = Vec.diff(checkpoint.pos, nextPos);
    const idealVelocity = targetDiff;
    const idealThrust = idealVelocity.clone().sub(pod.velocity);
    const nextAngle = angles.turnTowards(pod.angle, idealThrust.angle(), w.TurnRate);

    const headingSpeed = pod.velocity.dot(Vec.fromAngle(nextAngle));

    // if we travel the turn rate proportion of the circumference, then we turn out at the same rate we turn in and don't gain any ground
    const tangentialSpeedLimit = (w.TurnRate / angles.Tau) * (angles.Tau * targetDiff.length());
    const targetAngleError = Math.abs(angles.angleDelta(nextAngle, targetDiff.angle()));
    const headingOrbitalSpeed = tangentialSpeedLimit / (1e-6 + Math.sin(targetAngleError)); // this speed along the thrust heading and we just orbit
    const headingSpeedLimit = Math.cos(targetAngleError) * headingOrbitalSpeed; // want to travel less than orbital speed so we gain more ground inward

    const thrust = Math.min(
        w.MaxThrust,
        idealThrust.length(),
        Math.max(0, headingSpeedLimit - headingSpeed),
    );
    
    log.info(`pod ${pod.angle.toFixed(2)}`);
    log.info(`target ${targetDiff.angle().toFixed(2)}`);
    log.info(`error ${targetAngleError.toFixed(2)}`);
    log.info(`limit ${headingSpeedLimit.toFixed(0)}`);

    return {
        type: "thrust",
        target: pod.pos.clone().add(idealThrust),
        thrust,
    };
}