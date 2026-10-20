import { base } from '$app/paths';

/**
 * "Professional mode" — the version of the site sent to employers.
 *
 * Visiting any page under /professional turns it on. It then sticks for the
 * rest of the browser tab (sessionStorage), so following a link out to /about
 * or a blog post keeps the professional nav and footer. "See full site" turns
 * it off again.
 */

const KEY = 'rs-mode';
export const PRO_ROOT = `${base}/professional`;

export const proMode = $state({ sticky: false });

export function isProPath(pathname: string): boolean {
	return pathname === PRO_ROOT || pathname.startsWith(`${PRO_ROOT}/`);
}

export function initProMode() {
	try {
		proMode.sticky = sessionStorage.getItem(KEY) === 'pro';
	} catch {
		/* storage unavailable: mode follows the path only */
	}
}

export function enterProMode() {
	if (proMode.sticky) return;
	proMode.sticky = true;
	try {
		sessionStorage.setItem(KEY, 'pro');
	} catch {
		/* noop */
	}
}

export function exitProMode() {
	proMode.sticky = false;
	try {
		sessionStorage.removeItem(KEY);
	} catch {
		/* noop */
	}
}
