import { ElementRef } from "@angular/core";
import { Vector3 } from "three";
import { TrackGraphic } from "../core/graphics/Track.graphic";
import { TunnelGraphic } from "../core/graphics/Tunnel.graphic";
import { IViewer } from "../core/interfaces/IViewer";
import { ViewerFactory } from "../core/ViewerFactory";
import { ITunnelDesc } from "../data/interfaces/IMockData";

export class EngineCommon {
    private static readonly factoryViewer: ViewerFactory = new ViewerFactory();

    public static createViewer = (canvasElement: ElementRef<HTMLCanvasElement>): Promise<IViewer> => {
        return EngineCommon.factoryViewer.createViewer(canvasElement.nativeElement.id);
    };

    public static createTrack = (trajectory: Vector3[]) => {
        return new TrackGraphic(trajectory);
    };

    public static createTunnel = (parameters: ITunnelDesc, trajectory: Vector3[]) => {
        return new TunnelGraphic(parameters, trajectory);
    };
}