import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DateFormatPipe } from './pipes/date-format.pipe';
import * as shape from 'd3-shape';

declare let electron: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public ports: Array<any>;
  public selectedPort: any;
  public ipc = electron.ipcRenderer;
  public val: any;

  colorScheme: string;
  schemeType: string;
  xAxisLabel = 'Horário';
  yAxisLabel = 'Temperatura (°C)';
  yMin = 0;
  yMax = 40;
  rangeFillOpacity = 0.15;
  legendTitle = 'Variáveis';
  dateData = [];
  curve = shape.curveBasis;
  value: number;
  series = {
    name: 'Temperatura',
    series: []
  };

  constructor(
    private ref: ChangeDetectorRef,
    private _dateFormatPipe: DateFormatPipe
  ) {}

  ngOnInit() {
    this.colorScheme = 'forest';
    this.schemeType = 'ordinal';
    this.value = 0;
    this.dateData.push(this.series);

    this.ipc.send('mainWindowLoaded');
    this.ipc.on('detectedPorts', (evt, ports) => {
      this.ports = ports;
      this.selectedPort = ports[0];
      this.ref.detectChanges();
    });
    this.ipc.on('valueReceived', (evt, value) => {
      this.val = value.valor;
      this.plot(value.valor);
      this.ref.detectChanges();
    });
  }

  connect() {
    this.ipc.send('connectModbus', this.selectedPort.comName);
  }

  read() {
    this.ipc.send('readModbus');
  }

  plot(temp: number) {
    console.log(temp);
    //let dt: any;
    //dt = this.datePipe.transform(Date.now(), 'dd/mm/yyyy');
    this.series.series.push({
      value: temp,
      name: this._dateFormatPipe.transform(new Date())
    });
    this.dateData = [...this.dateData];
  }
}
