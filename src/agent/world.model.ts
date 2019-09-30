import { Vec } from '../util/vector';

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

export interface ThrustAction {
    type: "thrust";
    target: Vec;
    thrust: number;
}

export interface BoostAction {
    type: "boost";
}

export interface ShieldAction {
    type: "shield";
}