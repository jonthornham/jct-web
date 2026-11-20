// Cloud Functions for jct-web (2nd gen, Node.js 24).
//
// emailConsult: when the Free Consult form saves a document in `consults`, email Jon once
// through Mailjet (Reply-To: the visitor). On success the document gets `emailedAt`; on failure
// the error is logged and stored as `emailError`. No retries: a failed email stays visible on
// the document instead of looping.
//
// The Mailjet keys are Firebase secrets (Secret Manager), never in .env or the repo:
//   firebase functions:secrets:set MAILJET_API_KEY --project jct-web-d8780
//   firebase functions:secrets:set MAILJET_SECRET_KEY --project jct-web-d8780
// In the emulator, Mailjet is never called and the email is logged instead.
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue } from 'firebase-admin/firestore';
import { handleConsult, sendMailjet } from './consult.js';

initializeApp();

const MAILJET_API_KEY = defineSecret('MAILJET_API_KEY');
const MAILJET_SECRET_KEY = defineSecret('MAILJET_SECRET_KEY');

/** Must be a region that works with the Firestore database's location (see docs/LAUNCH.md). */
export const REGION = 'us-central1';

export const emailConsult = onDocumentCreated(
	{
		document: 'consults/{id}',
		region: REGION,
		secrets: [MAILJET_API_KEY, MAILJET_SECRET_KEY],
		retry: false,
		maxInstances: 5
	},
	async (event) => {
		const snap = event.data;
		if (!snap) return;
		const emulator = process.env.FUNCTIONS_EMULATOR === 'true';
		const result = await handleConsult(snap.data(), {
			id: event.params.id,
			emulator,
			log: logger,
			send: (message) =>
				sendMailjet(message, {
					apiKey: MAILJET_API_KEY.value(),
					secretKey: MAILJET_SECRET_KEY.value()
				})
		});
		await snap.ref.update(
			result.emailed
				? { emailedAt: FieldValue.serverTimestamp() }
				: { emailError: result.emailError }
		);
	}
);
