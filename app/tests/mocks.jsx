import * as React from 'react';
import * as ReactRouter from 'react-router';

// import {vi} from 'vitest';

export function createRemixReactMock(options) {
  let MockedForm = vi.fn(
    ({action, reloadDocument, replace, children, ...rest}) => {
      let href = ReactRouter.createPath(
        ReactRouter.resolvePath(action || '.', options.path),
      );
      return (
        <form
          {...rest}
          action={href}
          test-reloaddocument={reloadDocument ? 'true' : undefined}
          test-replace={replace ? 'true' : undefined}
        >
          {children}
        </form>
      );
    },
  );

  let MockedLink = vi.fn(
    ({to, reloadDocument, replace, state, prefetch, children, ...rest}) => {
      let href = ReactRouter.createPath(
        ReactRouter.resolvePath(to, options.path),
      );
      return (
        <a
          {...rest}
          href={href}
          test-reloaddocument={reloadDocument ? 'true' : undefined}
          test-replace={replace ? 'true' : undefined}
          test-state={state ? JSON.stringify(state) : undefined}
          test-prefetch={prefetch}
        >
          {children}
        </a>
      );
    },
  );

  return {
    useLoaderData: vi.fn(),
    useSearchParams: vi.fn(),
    Form: MockedForm,
    Link: MockedLink,
    Links: vi.fn(() => <link data-testid="remix-meta" />),
    LiveReload: vi.fn(() => <script data-testid="remix-live-reload" />),
    Meta: vi.fn(() => <title data-testid="remix-meta">remix-meta</title>),
    Outlet: options.Outlet || vi.fn(() => null),
    ScrollRestoration: vi.fn(() => (
      <script data-testid="remix-scroll-restoration" />
    )),
    Scripts: vi.fn(() => <script data-testid="remix-scripts" />),
    useLocation: vi.fn(() => options.path),
  };
}
