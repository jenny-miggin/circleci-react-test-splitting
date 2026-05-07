import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

describe('App component – extended coverage', () => {
  let container;

  beforeEach(() => {
    ({ container } = render(<App />));
  });

  test('renders the app logo image', () => {
    const img = container.querySelector('img.App-logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'logo');
  });

  test('renders the inline code tag with the correct content', () => {
    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code).toHaveTextContent('src/App.js');
  });

  test('renders the "Learn React" link with the correct href', () => {
    const link = container.querySelector('a.App-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://reactjs.org');
  });

  test('"Learn React" link opens in a new tab', () => {
    const link = container.querySelector('a.App-link');
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('"Learn React" link has rel="noopener noreferrer" for security', () => {
    const link = container.querySelector('a.App-link');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders the App-header element', () => {
    const header = container.querySelector('header.App-header');
    expect(header).toBeInTheDocument();
  });

  test('renders the root App div', () => {
    const root = container.querySelector('div.App');
    expect(root).toBeInTheDocument();
  });
});
