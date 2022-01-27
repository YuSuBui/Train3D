export interface ITunnelDesc {
    name: string;
    length: number;
    bodyID: number;
    bodyOD: number;
    startAt: number;
}

export interface ITrajectoryDesc {
    trajectoryX: number[];
    trajectoryY: number[];
    trajectoryZ: number[];
}

export interface IMockData {
    trajectory: ITrajectoryDesc;
    tunnel: ITunnelDesc[];
}