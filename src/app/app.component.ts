import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

declare let electron: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'TESTE';
  public ports: Array<any>;
  public ipc = electron.ipcRenderer;
  public val: any;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.ipc.send('mainWindowLoaded');
    this.ipc.on('detectedPorts', (evt, ports) => {
      this.ports = [];
      ports.forEach(element => {
        this.ports.push(element.comName);
      });
      this.ref.detectChanges();
    });
    this.ipc.on('valueReceived', (evt, value) => {
      this.val = value;
      this.ref.detectChanges();
    });
  }

  read() {
    this.ipc.send('readModbus');
  }
}
