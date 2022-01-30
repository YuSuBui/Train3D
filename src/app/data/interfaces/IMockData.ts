export enum TunnelType {
    NORMAL = 'NORMAL',
    UNDER = 'UNDER',
}

export interface ITunnelDesc {
    name: string;
    type: TunnelType;
    length: number;
    bodyID: number;
    bodyOD: number;
    startAt: number;
    settings?: {
        color: string;
        opacity: number;
        isIsometricMode: boolean;
        tunnelColor: number | string;
    }
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