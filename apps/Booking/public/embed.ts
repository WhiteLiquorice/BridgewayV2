(function () {
  'use strict';

  /**
   * Bridgeway Booking Embed Script
   *
   * Usage on any external website:
   *   <div data-bw-booking="my-org-slug"></div>
   *   <script src="https://yourbookingapp.com/embed.js" data-bw-base-url="https://yourbookingapp.com"></script>
   *
   * The script finds all [data-bw-booking] elements and replaces each with
   * an <iframe> pointing to the booking wizard for that org slug.
   * It listens for postMessage { type: 'bw-resize', height: NUMBER } from
   * each iframe and auto-resizes accordingly.
   */

  // Determine the base URL of the booking app.
  // 1. Check data-bw-base-url attribute on the script tag itself.
  // 2. Fall back to deriving it from the script's src URL.
  function getBaseUrl() {
    var scripts = document.querySelectorAll('script[src*="embed.js"]');
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var dataUrl = script.getAttribute('data-bw-base-url');
      if (dataUrl) {
        // Strip trailing slash
        return dataUrl.replace(/\/$/, '');
      }
      var src = script.getAttribute('src');
      if (src) {
        try {
          var url = new URL(src, window.location.href);
          return url.origin;
        } catch (e) {
          // ignore parse errors
        }
      }
    }
    // Last resort: use current origin (only works if embed.js is served from booking app)
    return window.location.origin;
  }

  var baseUrl = getBaseUrl();

  // Track iframes by their src so we can match postMessage events
  var iframeMap = [];

  function createIframe(orgSlug) {
    var iframe = document.createElement('iframe');
    var src = baseUrl + '/book?org=' + encodeURIComponent(orgSlug);
    iframe.setAttribute('src', src);
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '700');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('title', 'Booking Widget');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allow', 'payment');
    // Sandbox: restrict capabilities while still allowing forms, scripts, and
    // same-origin access (needed for Stripe Elements and postMessage resize).
    // allow-top-navigation-by-user-activation lets Stripe redirect after payment
    // without enabling arbitrary top-level navigation by the iframe.
    iframe.setAttribute('sandbox',
      'allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation'
    );
    iframe.style.cssText = 'border:0;border-radius:12px;display:block;width:100%;';
    iframeMap.push({ iframe: iframe, orgSlug: orgSlug });
    return iframe;
  }

  function init() {
    var containers = document.querySelectorAll('[data-bw-booking]');
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      var orgSlug = container.getAttribute('data-bw-booking');
      if (!orgSlug) continue;
      var iframe = createIframe(orgSlug);
      container.parentNode.replaceChild(iframe, container);
    }
  }

  // Auto-resize listener: iframes post { type: 'bw-resize', height: NUMBER }
  window.addEventListener('message', function (event) {
    // Strict origin check: compare against the exact booking app origin, not
    // a substring match (which could be spoofed by evil.bookingapp.com etc.).
    var expectedOrigin;
    try {
      expectedOrigin = new URL(baseUrl).origin;
    } catch (e) {
      expectedOrigin = baseUrl;
    }
    if (!event.origin || event.origin !== expectedOrigin) return;

    var data = event.data;
    if (!data || data.type !== 'bw-resize' || typeof data.height !== 'number') return;

    // Find the iframe that sent this message
    for (var i = 0; i < iframeMap.length; i++) {
      var entry = iframeMap[i];
      try {
        if (entry.iframe.contentWindow === event.source) {
          entry.iframe.style.height = data.height + 'px';
          entry.iframe.setAttribute('height', String(data.height));
          break;
        }
      } catch (e) {
        // cross-origin contentWindow access may throw; skip
      }
    }
  });

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
