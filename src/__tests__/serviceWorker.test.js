const loadServiceWorker = () => {
  let mod;
  jest.isolateModules(() => {
    mod = require('../serviceWorker');
  });
  return mod;
};

const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

describe('serviceWorker.unregister', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete navigator.serviceWorker;
  });

  test('unregisters the active service worker when supported', async () => {
    const unregister = jest.fn();
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { ready: Promise.resolve({ unregister }) },
    });

    loadServiceWorker().unregister();
    await flush();

    expect(unregister).toHaveBeenCalled();
  });

  test('logs an error if the ready promise rejects', async () => {
    const error = new Error('boom');
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { ready: Promise.reject(error) },
    });
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    loadServiceWorker().unregister();
    await flush();

    expect(consoleError).toHaveBeenCalledWith(error.message);
  });

  test('is a no-op when serviceWorker is not in navigator', () => {
    expect(() => loadServiceWorker().unregister()).not.toThrow();
  });
});

describe('serviceWorker.register', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalPublicUrl = process.env.PUBLIC_URL;
  let originalLocation;
  let originalAddEventListener;
  let loadHandler;

  beforeEach(() => {
    originalLocation = window.location;
    originalAddEventListener = window.addEventListener;
    loadHandler = null;
    window.addEventListener = function (event, handler) {
      if (event === 'load') loadHandler = handler;
    };
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.PUBLIC_URL = originalPublicUrl;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    window.addEventListener = originalAddEventListener;
    delete navigator.serviceWorker;
    delete global.fetch;
    jest.restoreAllMocks();
  });

  const setLocation = (href, hostname) => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href, hostname, origin: new URL(href).origin },
    });
  };

  test('is a no-op outside production', () => {
    process.env.NODE_ENV = 'test';
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register: jest.fn() },
    });

    loadServiceWorker().register();

    expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
    expect(loadHandler).toBeNull();
  });

  test('returns early when PUBLIC_URL origin differs from window origin', () => {
    process.env.NODE_ENV = 'production';
    process.env.PUBLIC_URL = 'https://cdn.example.com';
    setLocation('https://app.example.com/', 'app.example.com');
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register: jest.fn() },
    });

    loadServiceWorker().register();

    expect(loadHandler).toBeNull();
    expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
  });

  test('registers via checkValidServiceWorker on localhost', async () => {
    process.env.NODE_ENV = 'production';
    process.env.PUBLIC_URL = 'http://localhost';
    setLocation('http://localhost/', 'localhost');

    const registration = { onupdatefound: null, installing: null };
    const swRegister = jest.fn(() => Promise.resolve(registration));
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: swRegister,
        ready: Promise.resolve({ unregister: jest.fn() }),
        controller: null,
      },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: { get: () => 'application/javascript' },
      })
    );
    jest.spyOn(console, 'log').mockImplementation(() => {});

    loadServiceWorker().register();
    expect(loadHandler).toEqual(expect.any(Function));
    loadHandler();
    await flush();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost/service-worker.js',
      expect.objectContaining({ headers: { 'Service-Worker': 'script' } })
    );
    expect(swRegister).toHaveBeenCalledWith('http://localhost/service-worker.js');
  });

  test('registers directly when not on localhost', async () => {
    process.env.NODE_ENV = 'production';
    process.env.PUBLIC_URL = 'https://app.example.com';
    setLocation('https://app.example.com/', 'app.example.com');

    const registration = { onupdatefound: null, installing: null };
    const swRegister = jest.fn(() => Promise.resolve(registration));
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register: swRegister, controller: null },
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    loadServiceWorker().register();
    expect(loadHandler).toEqual(expect.any(Function));
    loadHandler();
    await flush();

    expect(swRegister).toHaveBeenCalledWith(
      'https://app.example.com/service-worker.js'
    );
  });
});
