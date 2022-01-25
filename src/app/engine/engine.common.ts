import { ElementRef } from "@angular/core";
import { IViewer } from "../core/interfaces/IViewer";
import { ViewerFactory } from "../core/ViewerFactory";

export class EngineCommon {
    private static readonly factoryViewer: ViewerFactory = new ViewerFactory();

    public static createViewer = (canvasElement: ElementRef<HTMLCanvasElement>): Promise<IViewer> => {
        return EngineCommon.factoryViewer.createViewer(canvasElement.nativeElement.id);
    };
}