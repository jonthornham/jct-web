// Firebase for the Free Consult intake form only. IntakeForm.svelte imports this file with a
// dynamic import() once the form is on screen, so Firebase never loads on any other page (or on
// /free-consult while Calendly is showing).
//
// Local development always talks to the emulators with the demo project `demo-jct`, never to a
// real project, even if .env holds the real web config.
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import {
	addDoc,
	collection,
	connectFirestoreEmulator,
	getFirestore,
	serverTimestamp
} from 'firebase/firestore';

const env = import.meta.env;

/** The emulators: always in `vite dev`, and in a build when VITE_USE_FIREBASE_EMULATORS=true. */
export const useEmulators = env.DEV || env.VITE_USE_FIREBASE_EMULATORS === 'true';

export const EMULATOR = { host: '127.0.0.1', firestorePort: 38180, projectId: 'demo-jct' };

const config = useEmulators
	? { projectId: EMULATOR.projectId, apiKey: 'demo-key', appId: 'demo-app' }
	: {
			apiKey: env.VITE_FIREBASE_API_KEY,
			authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
			projectId: env.VITE_FIREBASE_PROJECT_ID,
			storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
			appId: env.VITE_FIREBASE_APP_ID
		};

let db;

/** Starts Firebase (and App Check when a site key is set). Safe to call more than once. */
export function start() {
	if (db) return db;
	const app = initializeApp(config);
	// App Check (reCAPTCHA Enterprise) when VITE_APPCHECK_SITE_KEY is set. Enforcement stays off
	// in the Firebase console until Jon turns it on after launch. In the emulators a debug token
	// is used instead of reCAPTCHA (printed in the browser console).
	const siteKey = env.VITE_APPCHECK_SITE_KEY;
	if (siteKey) {
		if (useEmulators) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
		initializeAppCheck(app, {
			provider: new ReCaptchaEnterpriseProvider(siteKey),
			isTokenAutoRefreshEnabled: true
		});
	}
	db = getFirestore(app);
	if (useEmulators) connectFirestoreEmulator(db, EMULATOR.host, EMULATOR.firestorePort);
	return db;
}

/** Writes one `consults` document. Rejects on failure, or after `timeoutMs` without an answer. */
export function saveConsult(consult, { timeoutMs = 15000 } = {}) {
	const write = addDoc(collection(start(), 'consults'), {
		...consult,
		createdAt: serverTimestamp()
	});
	const timeout = new Promise((_, reject) =>
		setTimeout(() => reject(new Error('timed out')), timeoutMs)
	);
	return Promise.race([write, timeout]);
}
