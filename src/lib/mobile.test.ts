import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getOptimalPreloadCount, isSlowDevice } from './mobile';

function setNavigatorValue<K extends keyof Navigator>(key: K, value: Navigator[K]) {
  Object.defineProperty(window.navigator, key, {
    configurable: true,
    value,
  });
}

describe('mobile heuristics', () => {
  const originalUserAgent = window.navigator.userAgent;
  const originalHardwareConcurrency = window.navigator.hardwareConcurrency;

  beforeEach(() => {
    setNavigatorValue('userAgent', originalUserAgent);
    setNavigatorValue('hardwareConcurrency', originalHardwareConcurrency);
  });

  afterEach(() => {
    setNavigatorValue('userAgent', originalUserAgent);
    setNavigatorValue('hardwareConcurrency', originalHardwareConcurrency);
    Reflect.deleteProperty(window.navigator, 'deviceMemory');
  });

  it('does not classify a device as slow when performance APIs are unavailable', () => {
    setNavigatorValue(
      'userAgent',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );
    Reflect.deleteProperty(window.navigator, 'hardwareConcurrency');
    Reflect.deleteProperty(window.navigator, 'deviceMemory');

    expect(isSlowDevice()).toBe(false);
  });

  it('keeps normal mobile preload counts when performance APIs are unavailable', () => {
    setNavigatorValue(
      'userAgent',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );
    Reflect.deleteProperty(window.navigator, 'hardwareConcurrency');
    Reflect.deleteProperty(window.navigator, 'deviceMemory');

    expect(getOptimalPreloadCount()).toBe(6);
  });
});
