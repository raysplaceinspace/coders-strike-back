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

    const headingSpeedLimit = calculateHeadingSpeedLimit(targetDiff, nextAngle);

    const nextDiff = Vec.diff(nextCheckpoint.pos, checkpoint.pos);
    const nextSpeedLimit = calculateNextCheckpointLimit(targetDiff, nextDiff, nextAngle);

    const thrust = Math.min(
        w.MaxThrust,
        idealThrust.length(),
        Math.max(0, headingSpeedLimit - headingSpeed),
        Math.max(0, nextSpeedLimit - headingSpeed),
    );

    return {
        type: "thrust",
        target: pod.pos.clone().add(idealThrust),
        thrust,
    };
}

function calculateNextCheckpointLimit(targetDiff: Vec, nextDiff: Vec, nextAngle: number) {
    // We can cancel out momentum with our thrust. Equalise the rate ticks to reach the checkpoint vs the ticks to cancel out momentum, and we get this equation.
    const nextBrakeSpeed = Math.sqrt(w.MaxThrust * targetDiff.length()); 
    const nextTurnAngle = Math.abs(angles.angleDelta(nextAngle, nextDiff.angle()));
    const nextCosineAgreement = Math.cos(nextTurnAngle);
    const nextSpeedLimit = nextBrakeSpeed / Math.max(1e-6, -nextCosineAgreement);
    return nextSpeedLimit;
}

function calculateHeadingSpeedLimit(targetDiff: Vec, nextAngle: number) {
    // if we travel the turn rate proportion of the circumference, then we turn out at the same rate we turn in and don't gain any ground
    const tangentialSpeedLimit = (w.TurnRate / angles.Tau) * (angles.Tau * targetDiff.length());
    const targetAngleError = Math.abs(angles.angleDelta(nextAngle, targetDiff.angle()));
    const headingOrbitalSpeed = tangentialSpeedLimit / (1e-6 + Math.sin(targetAngleError)); // this speed along the thrust heading and we just orbit
    const headingSpeedLimit = 0.25 * Math.cos(targetAngleError) * headingOrbitalSpeed; // want to travel less than orbital speed so we gain more ground inward
    return headingSpeedLimit;
}
