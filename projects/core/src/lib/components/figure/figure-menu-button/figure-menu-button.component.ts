import { Component } from '@angular/core';
import { BaseComponentTypeEnum } from '@tailormap-viewer/api';
import { selectComponentTitle } from '../../../state/core.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tm-figure-menu-button',
  templateUrl: './figure-menu-button.component.html',
  styleUrls: ['./figure-menu-button.component.css']

})
export class FigureMenuButtonComponent {
  public componentType = BaseComponentTypeEnum.FIGURE;
  public panelTitle$ = this.store$.select(selectComponentTitle(this.componentType, $localize `:@@core.legend.legend:Legend`));
  constructor(private store$: Store) {}
}
