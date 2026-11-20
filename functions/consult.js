// The Free Consult email, without Firebase: builds the Mailjet message, sends it, and says what
// to write back on the document. index.js wires it to Firestore; test/consult.test.js tests it.
//
// One email, to Jon only. The visitor's address is the Reply-To, so Jon can answer with one
// click. Nothing is ever sent to the visitor.

/** Sender and recipient (Jon, Nov 20). The sender must be verified in Mailjet. */
export const JCT_EMAIL = 'jon@consultjct.com';
export const JCT_NAME = 'JCT Consulting';

export const MAILJET_URL = 'https://api.mailjet.com/v3.1/send';

/** No line breaks or control characters in one-line places (subject, names). */
const oneLine = (v, max = 200) =>
	String(v ?? '')
		// eslint-disable-next-line no-control-regex
		.replace(/[\u0000-\u001f\u007f]+/g, ' ')
		.trim()
		.slice(0, max);

/** The Mailjet v3.1 message for one `consults` document. Plain text only. */
export function buildMessage(consult, id) {
	const name = oneLine(consult.name, 100);
	const company = oneLine(consult.company, 120);
	const lines = [
		`Name: ${name}`,
		`Email: ${oneLine(consult.email, 254)}`,
		`Company: ${company}`,
		`Stage: ${oneLine(consult.stage, 40)}`,
		`Link: ${consult.link ? oneLine(consult.link, 500) : '(none)'}`,
		'',
		'Biggest thing in the way:',
		String(consult.blocker ?? ''),
		'',
		`Firestore: consults/${id}`
	];
	return {
		From: { Email: JCT_EMAIL, Name: JCT_NAME },
		To: [{ Email: JCT_EMAIL, Name: 'Jon Thornham' }],
		ReplyTo: { Email: oneLine(consult.email, 254), Name: name },
		Subject: `Free consult request: ${name}, ${company}`,
		TextPart: lines.join('\n'),
		CustomID: `consult-${id}`
	};
}

/** Sends one message through Mailjet. Throws with Mailjet's status on failure. */
export async function sendMailjet(message, { apiKey, secretKey, fetch = globalThis.fetch }) {
	if (!apiKey || !secretKey) throw new Error('Mailjet keys are not set');
	const res = await fetch(MAILJET_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
		},
		body: JSON.stringify({ Messages: [message] }),
		signal: AbortSignal.timeout(15000)
	});
	const body = await res.json().catch(() => ({}));
	const status = body?.Messages?.[0]?.Status;
	if (!res.ok || status !== 'success') {
		const detail = JSON.stringify(body?.Messages?.[0]?.Errors ?? body).slice(0, 300);
		throw new Error(`Mailjet ${res.status} ${status ?? ''}: ${detail}`.trim());
	}
	return body.Messages[0];
}

/**
 * Handles one new `consults` document. Returns what to write back:
 * { emailed: true } on success, or { emailError } on failure. Never retries.
 * In the emulator (`emulator: true`) Mailjet isn't called: the email is logged instead.
 */
export async function handleConsult(consult, { id, emulator, send, log }) {
	const message = buildMessage(consult, id);
	if (emulator) {
		log.info('Emulator: email not sent, logged instead', { id, email: message });
		return { emailed: true };
	}
	try {
		await send(message);
		log.info('Consult emailed', { id });
		return { emailed: true };
	} catch (err) {
		const emailError = String(err?.message ?? err).slice(0, 500);
		log.error('Consult email failed', { id, emailError });
		return { emailError };
	}
}
