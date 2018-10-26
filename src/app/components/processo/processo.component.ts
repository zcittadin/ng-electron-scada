import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import * as shape from 'd3-shape';
import { ProcessoService } from 'src/app/services/processo.service';

declare let electron: any;

@Component({
  selector: 'app-processo',
  templateUrl: './processo.component.html',
  styleUrls: ['./processo.component.css']
})
export class ProcessoComponent implements OnDestroy, OnInit {
  public ipc = electron.ipcRenderer;
  public val: any = 0;

  colorScheme: string;
  schemeType: string;
  xAxisLabel = 'Horário';
  yAxisLabel = '°C';
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

  processoStatusMsg = 'Parado';

  modbusSubscription: Subscription;

  constructor(
    private _ref: ChangeDetectorRef,
    private _dateFormatPipe: DateFormatPipe,
    private _processoService: ProcessoService
  ) {
    this.modbusSubscription = this._processoService
      .getModbusEmitter()
      .subscribe(obj => {
        this.plot(obj);
        this._ref.detectChanges();
      });
  }

  log(msg: any) {
    console.log(msg);
  }

  ngOnDestroy() {
    console.log('DESTRUÍDO!');
    this.modbusSubscription.unsubscribe();
  }

  ngOnInit() {
    this.colorScheme = 'forest';
    this.schemeType = 'ordinal';
    this.value = 0;
    this.dateData.push(this.series);
  }

  read() {
    this._processoService.initModScan();
    this.processoStatusMsg = 'Em andamento';
  }

  stopModScan() {
    this._processoService.stopModScan();
    this.processoStatusMsg = 'Parado';
  }

  plot(value: any) {
    // console.log(value);
    this.val = value.valor;
    this.series.series.push({
      value: value.valor,
      name: this._dateFormatPipe.transform(value.dataHorario, 'HH:mm:ss')
    });
    this.dateData = [...this.dateData];
  }
}
