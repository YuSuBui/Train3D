import { ElementRef, Injectable } from '@angular/core';
import { IViewer } from '../core/interfaces/IViewer';
import { EngineCommon } from './engine.common';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private canvasElement!: ElementRef<HTMLCanvasElement>;
  private viewer: IViewer | undefined;

  constructor() { }

  public createScene(canvasElement: ElementRef<HTMLCanvasElement>): void {
    this.canvasElement = canvasElement;

    EngineCommon.createViewer(this.canvasElement).then((viewer: IViewer) => {
      this.viewer = viewer;
    });
  }
}
