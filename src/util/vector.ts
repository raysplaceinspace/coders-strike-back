export interface Vec {
    x: number;
    y: number;
}

export function create(x: number, y: number): Vec {
    return { x, y };
}