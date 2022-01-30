import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IGangZData, IMockData, ITrajectoryDesc, ITunnelDesc } from '../data/interfaces/IMockData';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private tunnel!: Subject<ITunnelDesc[]>;
  private trajectory!: Subject<ITrajectoryDesc>;
  private gangzList!: Subject<IGangZData[]>;

  constructor(private httpClient: HttpClient) {
    this.trajectory = new Subject<ITrajectoryDesc>();
    this.tunnel = new Subject<ITunnelDesc[]>();
    this.gangzList = new Subject<IGangZData[]>();

    this.httpClient.get<IMockData>('assets/mock-data.json').subscribe((data: IMockData) => {
      console.log("data json from MockDataService ", data);
      this.trajectory.next(data.trajectory);
      this.tunnel.next(data.tunnel);
      this.gangzList.next(data.gangzList);
    })
  }

  public getTrajectory(): Observable<ITrajectoryDesc> {
    return this.trajectory.asObservable();
  }

  public getListOfGangZ(): Observable<IGangZData[]> {
    return this.gangzList.asObservable();
  }

  public getTunnel(): Observable<ITunnelDesc[]> {
    return this.tunnel.asObservable();
  }

}
