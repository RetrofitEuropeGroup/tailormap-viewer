import { render, screen } from '@testing-library/angular';
import { GeoRegistryPageComponent } from './geo-registry-page.component';
import { SharedModule } from '@tailormap-viewer/shared';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { AdminTemplateComponent } from '../../templates/admin-template/admin-template.component';
import { NavigationComponent } from '../../templates/admin-template/navigation/navigation.component';

describe('GeoRegistryPageComponent', () => {

  test('should render', async () => {
    await render(GeoRegistryPageComponent, {
      imports: [ SharedModule, MatIconTestingModule ],
      declarations: [ AdminTemplateComponent, NavigationComponent ],
    });
    // Menu item and title
    expect(await screen.findAllByText('Geo Registry')).toHaveLength(2);
  });

});