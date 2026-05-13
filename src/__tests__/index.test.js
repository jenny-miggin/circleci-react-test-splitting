jest.mock('react-dom', () => ({ render: jest.fn() }));
jest.mock('../serviceWorker', () => ({
  register: jest.fn(),
  unregister: jest.fn(),
}));

describe('index.js', () => {
  test('renders <App /> into #root and unregisters the service worker', () => {
    const ReactDOM = require('react-dom');
    const serviceWorker = require('../serviceWorker');

    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    jest.isolateModules(() => {
      require('../index.js');
    });

    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    const [, container] = ReactDOM.render.mock.calls[0];
    expect(container).toBe(root);
    expect(serviceWorker.unregister).toHaveBeenCalled();

    document.body.removeChild(root);
  });
});
