import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ProcessoService } from 'src/app/services/processo.service';
import { Subscription } from 'rxjs';

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

  displaySideBar = false;
  displayComDialog = false;
  connected = false;
  statusComMsg = 'Desconectado';
  modScanSubscription: Subscription;

  constructor(
    private _ref: ChangeDetectorRef,
    private _processoService: ProcessoService
  ) {
    this.ipc.on('valueReceived', (evt, value) => {
      // console.log(value);
      this._processoService.readModbusValues(value);
    });
    this.modScanSubscription = this._processoService
      .getModScan()
      .subscribe(cond => {
        if (cond.scan === true) {
          this.ipc.send('readModbus');
        } else {
          this.ipc.send('stopModbus');
        }
      });
  }

  ngOnInit() {
    this.ipc.send('mainWindowLoaded');
    this.ipc.on('detectedPorts', (evt, ports) => {
      this.ports = ports;
      this.selectedPort = ports[0];
      /*this._ref.detectChanges();*/
    });
  }

  connect() {
    this.ipc.send('connectModbus', this.selectedPort.comName);
    this.statusComMsg = 'Conectado';
  }

  showComDialog() {
    this.displayComDialog = true;
  }
}
