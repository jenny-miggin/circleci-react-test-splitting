/**
 * Tests for serviceWorker.js
 *
 * The module is deeply coupled to browser globals (window, navigator,
 * process.env). We set up minimal mocks for each before importing the module.
 */

// ---------------------------------------------------------------------------
// Helpers / shared mocks
// ---------------------------------------------------------------------------

/** Build a minimal navigator.serviceWorker mock. */
function makeSwMock({ registerResolve = true } = {}) {
  const registration = {
    installing: null,
    onupdatefound: null,
    unregister: jest.fn().mockResolvedValue(true),
  };

  return {
    register: registerResolve
      ? jest.fn().mockResolvedValue(registration)
      : jest.fn().mockRejectedValue(new Error('SW registration failed')),
    ready: Promise.resolve(registration),
    controller: null,
    _registration: registration,
  };
}

// ---------------------------------------------------------------------------
// unregister()
// ---------------------------------------------------------------------------
describe('unregister', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('calls navigator.serviceWorker.ready then unregister() when supported', async () => {
    const swMock = makeSwMock();
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: swMock,
      configurable: true,
      writable: true,
    });

    const { unregister } = require('../serviceWorker');
    unregister();

    // Allow microtasks to flush
    await Promise.resolve();
    expect(swMock._registration.unregister).toHaveBeenCalledTimes(1);
  });

  test('does not throw when serviceWorker is not in navigator', () => {
    const navigatorWithoutSW = {};
    Object.defineProperty(global, 'navigator', {
      value: navigatorWithoutSW,
      configurable: true,
      writable: true,
    });

    jest.resetModules();
    const { unregister } = require('../serviceWorker');
    expect(() => unregister()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// register() – non-production env (should be a no-op)
// ---------------------------------------------------------------------------
describe('register – non-production environment', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test'; // anything other than 'production'
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  test('does not attempt to register a service worker outside production', () => {
    const swMock = makeSwMock();
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: swMock,
      configurable: true,
      writable: true,
    });

    const { register } = require('../serviceWorker');
    register();

    expect(swMock.register).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// register() – production env, different origin PUBLIC_URL (early return)
// ---------------------------------------------------------------------------
describe('register – production, cross-origin PUBLIC_URL', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PUBLIC_URL: 'https://cdn.example.com',
    };

    // window.location.origin = 'http://localhost'
    delete window.location;
    window.location = new URL('http://localhost/');
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('returns early and does not register when PUBLIC_URL origin differs', () => {
    const swMock = makeSwMock();
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: swMock,
      configurable: true,
      writable: true,
    });

    const { register } = require('../serviceWorker');
    // Trigger the 'load' handler manually
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    register();
    // No 'load' listener should have been added because we returned early
    // (the PUBLIC_URL origin check happens before addEventListener)
    expect(swMock.register).not.toHaveBeenCalled();
    addEventListenerSpy.mockRestore();
  });
});
