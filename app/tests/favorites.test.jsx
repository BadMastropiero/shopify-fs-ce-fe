import 'react';
import * as Mocks from './mocks.jsx';
import {render} from '@testing-library/react';
import Favorites from '../routes/favorites._index.jsx';
import * as RemixReact from '@remix-run/react';
import mockNodes from './mock_nodes.json';
// import {describe, test, expect, vi} from 'vitest';

vi.mock('@remix-run/react', () =>
  Mocks.createRemixReactMock({path: '/favorites'}),
);

let RemixReactMock = RemixReact;

describe('favorites', () => {
  beforeEach(() => {
    RemixReactMock.useLoaderData.mockReturnValue({
      nodes: mockNodes,
    });
    RemixReactMock.useSearchParams.mockReturnValue([new URLSearchParams()]);
  });

  test('renders favorite products', () => {
    let {getByText} = render(<Favorites />);
    const productLabels = mockNodes.map((node) => node.title);
    productLabels.forEach((label) => {
      expect(getByText(label)).toBeDefined();
    });
  });
});
