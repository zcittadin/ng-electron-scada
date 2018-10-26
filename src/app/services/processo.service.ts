import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProcessoService {

  private subjectModScan = new Subject<any>();
  private subjectModEmitter = new Subject<any>();

  readModbusValues(obj: any) {
    this.subjectModEmitter.next(obj);
  }

  getModbusEmitter(): Observable<any> {
    return this.subjectModEmitter.asObservable();
  }

  initModScan() {
    this.subjectModScan.next({ scan: true });
  }

  stopModScan() {
    this.subjectModScan.next({ scan: false });
  }

  getModScan(): Observable<any> {
    return this.subjectModScan.asObservable();
  }

}
