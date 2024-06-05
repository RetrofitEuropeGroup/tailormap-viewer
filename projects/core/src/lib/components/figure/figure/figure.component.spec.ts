import { render, screen } from '@testing-library/angular';
import { FigureComponent } from './figure.component';

describe('FigureComponent', () => {

  test('should render', async () => {
    await render(FigureComponent);
    expect(screen.getByText('figure works!'));
  });

});
