import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ButtonModule,
  CardModule,
  DropdownModule,
  InputSwitchModule,
  SidebarModule,
  PanelModule,
  ToolbarModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { NgxChartsModule } from '@swimlane/ngx-charts/release/';

import { DateFormatPipe } from './pipes/date-format.pipe';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    NgxChartsModule,
    DropdownModule,
    PanelModule,
    SidebarModule,
    TableModule,
    ToolbarModule
  ],
  providers: [DateFormatPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
