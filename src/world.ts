import * as angles from './util/angles';
import { Vec } from './util/vector';

export const TurnRate = 0.05 * angles.Tau;
export const Friction = 0.15;
export const BoostThrust = 650;
export const MaxThrust = 200;
export const CheckpointRadius = 600;

export interface Map {
    laps: number;
    checkpoints: Checkpoint[];
}

export interface World extends Map {
    tick: number;
    pods: Pod[];
}

export interface Checkpoint {
    id: number;
    pos: Vec;
}

export interface Pod {
    id: number;
    teamId: number;
    pos: Vec;
    velocity: Vec;
    angle: number;
    nextCheckpointId: number;
}

export type Action =
    ThrustAction
    | BoostAction
    | ShieldAction

export interface ActionBase {
    type: string;
    tag?: string;
}

export interface ThrustAction extends ActionBase {
    type: "thrust";
    target: Vec;
    thrust: number;
}

export interface BoostAction extends ActionBase {
    type: "boost";
    tag?: string;
}

export interface ShieldAction extends ActionBase {
    type: "shield";
}