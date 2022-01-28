import { ElementRef, Injectable } from '@angular/core';
import { Color } from 'three';
import { DirectionPlanGraphic } from '../core/graphics/DirectionPlan.graphic';
import { IGroup } from '../core/interfaces/IGroup';
import { IViewer } from '../core/interfaces/IViewer';
import { DataAdapter } from '../data/DataAdapter';
import { IDataAdapter } from '../data/interfaces/IDataAdapter';
import { ITrajectoryDesc, ITunnelDesc, TunnelType } from '../data/interfaces/IMockData';
import { MockDataService } from '../services/mock-data.service';
import { EngineCommon } from './engine.common';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private canvasElement!: ElementRef<HTMLCanvasElement>;
  private viewer: IViewer | undefined;
  private mainGroup!: IGroup;
  private dataAdapter!: IDataAdapter;

  constructor(private mockData: MockDataService) { }

  public createScene(canvasElement: ElementRef<HTMLCanvasElement>): void {
    this.canvasElement = canvasElement;

    EngineCommon.createViewer(this.canvasElement).then((viewer: IViewer) => {
      this.viewer = viewer;
      this.mainGroup = viewer.getWorld().getMainGroup();

      this.mockData.getTrajectory().subscribe((trajectory: ITrajectoryDesc) => {
        this.dataAdapter = new DataAdapter(trajectory);
        const directionPlanGraphic = new DirectionPlanGraphic(this.dataAdapter);
        this.mainGroup.addNode(directionPlanGraphic);

        // create train track graphic
        const trackGraphic = EngineCommon.createTrack(this.dataAdapter.getTrajectory());
        this.mainGroup.addNode(trackGraphic);
      });

      this.mockData.getTunnel().subscribe((tunnels: ITunnelDesc[]) => {
        tunnels.forEach((tunnel: ITunnelDesc) => {
          const tunnelGraphic = EngineCommon.createTunnel(tunnel, this.dataAdapter.getTrajectory());
          if (tunnel.type === TunnelType.UNDER) {
            tunnelGraphic.getStyle().setOpacity(0.5);
          }
          this.mainGroup.addNode(tunnelGraphic);
        });
      });


    });
  }
}
