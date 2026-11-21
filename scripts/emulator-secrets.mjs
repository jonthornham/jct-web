// Gives the Functions emulator stand-in values for the function's secrets, so it never asks
// Google's Secret Manager for them. The function doesn't call Mailjet in the emulator, so
// these are never used. functions/.secret.local is gitignored and never deployed.
// Real keys go only into Secret Manager: firebase functions:secrets:set … (docs/LAUNCH.md).
import { existsSync, writeFileSync } from 'node:fs';

const file = 'functions/.secret.local';
if (!existsSync(file)) {
	writeFileSync(
		file,
		'# Emulator only. Not real keys; the emulator never calls Mailjet.\n' +
			'MAILJET_API_KEY=emulator-not-a-key\nMAILJET_SECRET_KEY=emulator-not-a-key\n'
	);
}
