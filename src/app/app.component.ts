import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine/engine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Train3D';

  @ViewChild('canvas', { static: true })
  public canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private engineService: EngineService) { }

  ngOnInit(): void {
    // create scene of rendering and progress
    this.engineService.createScene(this.canvas);
  }
}
