import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { MenubarService } from '../../menubar';
import { Store } from '@ngrx/store';
import { selectOrderedVisibleLayersWithLegend } from '../../../map/state/map.selectors';
import { MapService } from '@tailormap-viewer/map';
import { BaseComponentTypeEnum } from '@tailormap-viewer/api';
import { FigureMenuButtonComponent } from '../figure-menu-button/figure-menu-button.component';

@Component({
  selector: 'tm-figure',
  templateUrl: './figure.component.html',
  styleUrls: ['./figure.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FigureComponent implements OnInit {

  constructor(private menubarService: MenubarService) { }

  public ngOnInit(){
    this.menubarService.registerComponent({type: BaseComponentTypeEnum.FIGURE, component: FigureMenuButtonComponent});
  }

}
