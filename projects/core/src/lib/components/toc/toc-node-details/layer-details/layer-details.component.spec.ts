import { render, screen } from '@testing-library/angular';
import { LayerDetailsComponent } from './layer-details.component';
import { getAppLayerModel, getServiceModel } from '@tailormap-viewer/api';
import { of } from 'rxjs';
import { SharedModule } from '@tailormap-viewer/shared';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { LegendLayerComponent } from '../../../legend/legend-layer/legend-layer.component';
import { LayerTransparencyComponent } from '../layer-transparency/layer-transparency.component';
import { MapService } from '@tailormap-viewer/map';
import { LegendService } from '../../../legend/services/legend.service';
import { provideMockStore } from '@ngrx/store/testing';

const setup = async () => {
  const appLayer = getAppLayerModel({ title: 'The Layer' });
  const mapServiceMock = {
    getMapViewDetails$: jest.fn(),
  };
  const legendServiceMock = {
    getLegendInfo$: jest.fn(() => of([
      {
        layer: { ...appLayer, service: getServiceModel() },
        url: 'http://some-url/geoserver/wms?REQUEST=GetLegendGraphic',
        isInScale: true,
      },
    ])),
  };
  await render(LayerDetailsComponent, {
    imports: [ SharedModule, MatIconTestingModule ],
    declarations: [ LegendLayerComponent, LayerTransparencyComponent ],
    providers: [
      { provide: MapService, useValue: mapServiceMock },
      { provide: LegendService, useValue: legendServiceMock },
      provideMockStore({
        initialState: { map: { layers: [appLayer] } },
      }),
    ],
    componentProperties: {
      layerId: appLayer.id,
    },
  });
};

describe('LayerDetailsComponent', () => {

  test('should render', async () => {
    await setup();
    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

});
