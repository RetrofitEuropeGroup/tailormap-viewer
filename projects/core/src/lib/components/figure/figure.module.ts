import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FigureComponent } from './figure/figure.component';
import { FigureMenuButtonComponent } from './figure-menu-button/figure-menu-button.component';
import { SharedModule } from '@tailormap-viewer/shared';
import { MenubarModule } from '../menubar';



@NgModule({
  declarations: [
    FigureComponent,
    FigureMenuButtonComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MenubarModule,
  ],
  exports: [
    FigureComponent
  ],
})
export class FigureModule { }


