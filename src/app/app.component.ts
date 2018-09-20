import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

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

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.ipc.send('mainWindowLoaded');
    this.ipc.on('detectedPorts', (evt, ports) => {
      this.ports = ports;
      this.selectedPort = ports[0];
      this.ref.detectChanges();
    });
    this.ipc.on('valueReceived', (evt, value) => {
      this.val = value;
      this.ref.detectChanges();
    });
  }

  connect() {
    this.ipc.send('connectModbus', this.selectedPort.comName);
  }

  read() {
    this.ipc.send('readModbus');
  }
}
