import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ButtonModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  InputSwitchModule,
  MenuModule,
  SidebarModule,
  PanelModule,
  ToolbarModule,
  TooltipModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { NgxChartsModule } from '@swimlane/ngx-charts/release/';

import { ProcessoService } from './services/processo.service';

import { AppRoutingModule } from './app.routing.module';

import { DateFormatPipe } from './pipes/date-format.pipe';
import { AppComponent } from './app.component';
import { ConsultasComponent } from './components/consultas/consultas.component';
import { ProcessoComponent } from './components/processo/processo.component';

@NgModule({
  declarations: [AppComponent, ConsultasComponent, ProcessoComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    NgxChartsModule,
    DialogModule,
    DropdownModule,
    MenuModule,
    PanelModule,
    SidebarModule,
    TableModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [DateFormatPipe, ProcessoService],
  bootstrap: [AppComponent]
})
export class AppModule {}
