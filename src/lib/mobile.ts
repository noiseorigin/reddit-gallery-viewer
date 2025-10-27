/**
 * Mobile device optimizations
 * Detects and optimizes behavior for mobile devices
 */

export interface MobileOptimizations {
  isLowBandwidth: boolean;
  isSlowDevice: boolean;
  isMobileDevice: boolean;
  shouldReduceImages: boolean;
  imageLoadPriority: 'eager' | 'lazy' | 'very-lazy';
  cacheAggressively: boolean;
  connectionType: '4g' | '3g' | '2g' | 'unknown';
}

/**
 * Detect mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent;
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * Detect network type using Network Information API
 */
export function getNetworkType(): '4g' | '3g' | '2g' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';

  // @ts-ignore - Network Information API is not fully typed
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) return 'unknown';

  const effectiveType = connection.effectiveType;
  if (effectiveType === '4g') return '4g';
  if (effectiveType === '3g') return '3g';
  if (effectiveType === '2g') return '2g';

  return 'unknown';
}

/**
 * Detect if device has slow performance
 */
export function isSlowDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Check for low-memory devices (Android)
  // @ts-ignore
  const deviceMemory = navigator.deviceMemory;
  if (deviceMemory && deviceMemory < 4) return true;

  // Check for low CPU cores
  const cores = navigator.hardwareConcurrency || 1;
  if (cores < 2) return true;

  return false;
}

/**
 * Get comprehensive mobile optimization settings
 */
export function getMobileOptimizations(): MobileOptimizations {
  const isMobileDevice = isMobile();
  const connectionType = getNetworkType();
  const isSlowDeviceDetected = isSlowDevice();

  const isLowBandwidth = connectionType === '3g' || connectionType === '2g';
  const shouldReduceImages = isLowBandwidth || isSlowDeviceDetected;

  let imageLoadPriority: 'eager' | 'lazy' | 'very-lazy' = 'lazy';
  if (isLowBandwidth) {
    imageLoadPriority = 'very-lazy'; // Load fewer images upfront
  } else if (!isMobileDevice) {
    imageLoadPriority = 'eager'; // Desktop: eager load
  }

  return {
    isLowBandwidth,
    isSlowDevice: isSlowDeviceDetected,
    isMobileDevice,
    shouldReduceImages,
    imageLoadPriority,
    cacheAggressively: isMobileDevice || isLowBandwidth,
    connectionType,
  };
}

/**
 * Debounce function for mobile-optimized scroll handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for mobile-optimized event handling
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if device supports IntersectionObserver (for lazy loading)
 */
export function supportsIntersectionObserver(): boolean {
  if (typeof window === 'undefined') return false;
  return 'IntersectionObserver' in window;
}

/**
 * Get optimal number of images to preload based on device
 */
export function getOptimalPreloadCount(): number {
  const optimizations = getMobileOptimizations();

  if (!optimizations.isMobileDevice) {
    return 12; // Desktop: load more upfront
  }

  if (optimizations.isLowBandwidth) {
    return 3; // Low bandwidth: load very few
  }

  if (optimizations.isSlowDevice) {
    return 4; // Slow device: load few
  }

  return 6; // Normal mobile: load moderate amount
}

/**
 * Get cache duration based on device
 */
export function getCacheDuration(): number {
  const optimizations = getMobileOptimizations();

  if (optimizations.isLowBandwidth) {
    return 24 * 60 * 60 * 1000; // 24 hours for low bandwidth
  }

  if (optimizations.isMobileDevice) {
    return 12 * 60 * 60 * 1000; // 12 hours for mobile
  }

  return 60 * 60 * 1000; // 1 hour for desktop
}

/**
 * Request idle callback polyfill
 */
export function scheduleIdleTask(callback: () => void): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    // @ts-ignore
    requestIdleCallback(callback);
  } else {
    // Fallback: schedule after next paint
    if ('requestAnimationFrame' in window) {
      requestAnimationFrame(() => {
        setTimeout(callback, 0);
      });
    } else {
      setTimeout(callback, 100);
    }
  }
}

/**
 * Determine if we should show all features or simplified UI
 */
export function shouldUseSimplifiedUI(): boolean {
  const optimizations = getMobileOptimizations();
  return optimizations.isSlowDevice || optimizations.isLowBandwidth;
}

/**
 * Log mobile optimization info for debugging
 */
export function logMobileOptimizations(): void {
  if (typeof window === 'undefined') return;

  const optimizations = getMobileOptimizations();
  console.group('[MOBILE OPTIMIZATIONS]');
  console.log('Is Mobile Device:', optimizations.isMobileDevice);
  console.log('Network Type:', optimizations.connectionType);
  console.log('Is Slow Device:', optimizations.isSlowDevice);
  console.log('Is Low Bandwidth:', optimizations.isLowBandwidth);
  console.log('Image Load Priority:', optimizations.imageLoadPriority);
  console.log('Cache Aggressively:', optimizations.cacheAggressively);
  console.log('Device Memory:', (navigator as any).deviceMemory, 'GB');
  console.log('CPU Cores:', navigator.hardwareConcurrency);
  console.groupEnd();
}
