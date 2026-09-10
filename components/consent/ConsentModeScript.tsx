import Script from 'next/script'

import { CONSENT_STORAGE_KEY, CONSENT_VERSION, DEFAULT_CONSENT } from '@/lib/consent/consent'

/**
 * Google Consent Mode v2 defaults.
 *
 * This MUST execute before the GTM container loads, otherwise tags fire once
 * with no consent state at all — which is the situation this replaces. Hence
 * `beforeInteractive` and its position above <GoogleTagManagerHead /> in the
 * root layout.
 *
 * Two things happen here, in order:
 *   1. Deny everything but strictly necessary storage.
 *   2. Re-apply a previously stored decision, so a returning visitor who
 *      accepted is not measured as denied for the first few hundred ms.
 *
 * `wait_for_update` gives step 2 (and the banner) a window to speak before
 * tags resolve their consent state.
 */
export function ConsentModeScript() {
    const bootstrap = `
(function(w,storageKey,version,defaults){
  w.dataLayer = w.dataLayer || [];
  function gtag(){ w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  gtag('consent', 'default', Object.assign({ wait_for_update: 500 }, defaults));
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  try {
    var stored = JSON.parse(w.localStorage.getItem(storageKey) || 'null');
    if (stored && stored.version === version) {
      var granted = function(v){ return v ? 'granted' : 'denied'; };
      gtag('consent', 'update', {
        analytics_storage: granted(stored.analytics),
        ad_storage: granted(stored.marketing),
        ad_user_data: granted(stored.marketing),
        ad_personalization: granted(stored.marketing),
        personalization_storage: granted(stored.marketing)
      });
    }
  } catch (e) { /* storage unavailable: defaults stand, banner will ask */ }
})(window, ${JSON.stringify(CONSENT_STORAGE_KEY)}, ${CONSENT_VERSION}, ${JSON.stringify(DEFAULT_CONSENT)});
`.trim()

    return (
        // The rule predates the App Router: `beforeInteractive` is unsupported in a
        // page/component there, but supported — and required for this — in the root
        // layout, which is where this renders.
        // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
        <Script
            id="consent-mode-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: bootstrap }}
        />
    )
}
