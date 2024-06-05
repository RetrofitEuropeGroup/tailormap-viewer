import { render, screen } from '@testing-library/angular';
import { FigureMenuButtonComponent } from './figure-menu-button.component';
import { of } from 'rxjs';
import { MenubarButtonComponent, MenubarService } from '../../menubar';
import { SharedModule } from '@tailormap-viewer/shared';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import userEvent from '@testing-library/user-event';
import { provideMockStore } from '@ngrx/store/testing';
import { coreStateKey, initialCoreState } from '../../../state/core.state';

describe('FigureMenuButtonComponent', () => {

  test('should render', async () => {
    await render(FigureMenuButtonComponent);
    expect(screen.getByText('figure-menu-button works!'));
  });

});
