<!--
	Intake form (components/intake-form.md): the Free Consult fallback when Calendly can't show
	(no booking URL, not loaded after 8s, or JavaScript off). Screens: free-consult-form-*,
	-form-errors-*, -sending-*, -send-error-*, -success-*.

	States: empty → errors (on blur per field; on submit for all, with a summary and focus on
	the first invalid field) → sending → sent (success card) or send error (answers kept).

	- Save first: one document in `consults` (src/lib/firebase/consults.js). The email to Jon is
	  sent afterwards by the Cloud Function on that collection (functions/).
	- Bots: a hidden honeypot field and a time-on-page check. A bot gets the same success card
	  and nothing is written.
	- Firebase loads only when `active` (the form is on screen), via a dynamic import.
	- Without JavaScript the form still shows (Booking.svelte) and submits through the visitor's
	  email app to Jon's address (`mailto:`), since there's no script to save it.
-->
<script>
	import { tick } from 'svelte';
	import { labels } from '$lib/config/labels';
	import { site } from '$lib/config/site';
	import { freeConsult } from '$lib/content/free-consult';
	import {
		HONEYPOT,
		LIMITS,
		STAGES,
		fieldError,
		submitConsult,
		summary,
		validate
	} from '$lib/intake';
	import { track } from '$lib/analytics';
	import Alert from '$components/ui/Alert.svelte';
	import ArrowLink from '$components/ui/ArrowLink.svelte';
	import Button from '$components/ui/Button.svelte';
	import Icon from '$components/ui/Icon.svelte';
	import MissingLink from '$components/placeholder/MissingLink.svelte';
	import MissingText from '$components/placeholder/MissingText.svelte';

	let { active = false } = $props();

	const f = labels.form;
	const tel = 'tel:+1' + site.phone.replace(/\D/g, '');
	const [sendBefore, sendAfter] = f.sendError.split(site.phone);

	let values = $state({ name: '', email: '', company: '', stage: '', blocker: '', link: '' });
	let honeypot = $state('');
	let errors = $state({});
	let submitted = $state(false);
	let status = $state('idle'); // idle | sending | sent | error
	let startedAt = 0;
	let firebase;

	let form = $state();
	let summaryEl = $state();
	let doneHeading = $state();

	const count = $derived(Object.keys(errors).length);
	const sending = $derived(status === 'sending');

	// Firebase (and App Check) start once the form is on screen; the clock for the bot check
	// starts then too.
	$effect(() => {
		if (!active || firebase) return;
		startedAt = Date.now();
		firebase = import('$lib/firebase/consults.js').then((m) => {
			m.start();
			return m;
		});
		firebase.catch(() => {});
	});

	function check(field) {
		const msg = fieldError(field, values);
		const next = { ...errors };
		if (msg) next[field] = msg;
		else delete next[field];
		errors = next;
	}

	// Blur: check that field. After a submit attempt, fields re-check as they change.
	const onblur = (field) => () => check(field);
	const oninput = (field) => () => {
		if (submitted || errors[field]) check(field);
	};

	async function onsubmit(event) {
		event.preventDefault();
		if (sending) return;
		submitted = true;
		errors = validate(values);
		if (count) {
			await tick();
			const first = Object.keys(errors)[0];
			form.querySelector(first === 'stage' ? '[name="stage"]' : `[name="${first}"]`)?.focus();
			return;
		}
		status = 'sending';
		const result = await submitConsult($state.snapshot(values), {
			honeypot,
			startedAt,
			save: async (doc) => {
				await (await (firebase ?? import('$lib/firebase/consults.js'))).saveConsult(doc);
				// Counted only after a real save (a bot's quiet "sent" never gets here). Only on www.
				track('consult_submitted');
			}
		});
		status = result === 'sent' ? 'sent' : 'error';
		await tick();
		if (status === 'sent') doneHeading?.focus();
		else summaryEl?.focus();
	}

	const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

	// Shared field look; the height is set per control (46px inputs, 120px text box).
	const input =
		'block w-full rounded-input border-0 bg-surface px-[14px] text-base text-fg ring-inset placeholder:text-fg-subtle focus:outline-none focus:ring-2 disabled:opacity-60';
	// An invalid field keeps its danger ring while focused (as the error screens draw it).
	const ring = (field) =>
		errors[field]
			? 'ring-2 ring-danger focus:ring-danger'
			: 'ring-1 ring-border-strong focus:ring-focus';
	const labelCls = 'block text-mk-ui font-semibold text-fg';
</script>

{#snippet error(field)}
	{#if errors[field]}
		<p
			id="{field}-error"
			class="m-0 mt-2 flex items-start gap-1.5 text-[14px] leading-[1.45] text-danger"
		>
			<Icon name="circle-alert" size={16} class="mt-[2px]" />
			<span><MissingText text={errors[field]} /></span>
		</p>
	{/if}
{/snippet}

<div class="rounded-card bg-surface p-[clamp(24px,3.5vw,40px)] ring-1 ring-inset ring-border">
	{#if status === 'sent'}
		<div role="status" class="flex flex-col items-start">
			<span class="grid h-12 w-12 place-items-center rounded-full bg-success-soft">
				<Icon name="check" size={22} stroke={2} class="text-success" />
			</span>
			<h2
				bind:this={doneHeading}
				tabindex="-1"
				class="m-0 mt-5 text-mk-h3 text-fg focus:outline-none"
			>
				{f.success.title}
			</h2>
			<p class="m-0 mt-3 text-mk-body text-fg-muted">{f.success.line}</p>
			<ArrowLink href="/how-i-work" class="mt-4">{labels.cta.howIWork}</ArrowLink>
		</div>
	{:else}
		<form
			bind:this={form}
			action="mailto:{labels.contact.email}"
			method="post"
			enctype="text/plain"
			novalidate
			aria-busy={sending}
			{onsubmit}
			class="flex flex-col gap-5"
		>
			{#if status === 'error'}
				<div bind:this={summaryEl} tabindex="-1" class="focus:outline-none">
					<Alert tone="danger" role="alert">
						{sendBefore}<a href={tel} class="inline-link font-mono">{site.phone}</a>{sendAfter}
					</Alert>
				</div>
			{:else if submitted && count}
				<Alert tone="danger" role="alert">{summary(count)}</Alert>
			{/if}

			<fieldset disabled={sending} class="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
				<div class="grid gap-5 sm:grid-cols-2 sm:gap-4">
					<div>
						<label for="name" class={labelCls}>{f.name}</label>
						<input
							id="name"
							name="name"
							type="text"
							autocomplete="name"
							maxlength={LIMITS.name}
							bind:value={values.name}
							onblur={onblur('name')}
							oninput={oninput('name')}
							aria-invalid={errors.name ? 'true' : undefined}
							aria-describedby={describedBy('name')}
							class="mt-2 h-[46px] {input} {ring('name')}"
						/>
						{@render error('name')}
					</div>
					<div>
						<label for="email" class={labelCls}>{f.email}</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							maxlength={LIMITS.email}
							bind:value={values.email}
							onblur={onblur('email')}
							oninput={oninput('email')}
							aria-invalid={errors.email ? 'true' : undefined}
							aria-describedby={describedBy('email')}
							class="mt-2 h-[46px] {input} {ring('email')}"
						/>
						{@render error('email')}
					</div>
				</div>

				<div>
					<label for="company" class={labelCls}>{f.company}</label>
					<input
						id="company"
						name="company"
						type="text"
						autocomplete="organization"
						maxlength={LIMITS.company}
						bind:value={values.company}
						onblur={onblur('company')}
						oninput={oninput('company')}
						aria-invalid={errors.company ? 'true' : undefined}
						aria-describedby={describedBy('company')}
						class="mt-2 h-[46px] {input} {ring('company')}"
					/>
					{@render error('company')}
				</div>

				<!-- Choice pills: native radios (arrow keys move the selection), drawn as pills. -->
				<fieldset class="m-0 min-w-0 border-0 p-0" aria-describedby={describedBy('stage')}>
					<legend class="{labelCls} p-0">{f.stage}</legend>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each STAGES as option (option)}
							<label class="relative">
								<input
									type="radio"
									name="stage"
									value={option}
									bind:group={values.stage}
									onchange={() => check('stage')}
									class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-pill border-0 bg-transparent opacity-0 focus:ring-0"
								/>
								<span
									class="flex h-10 items-center rounded-pill px-4 text-mk-ui ring-inset peer-checked:bg-primary-soft peer-checked:font-semibold peer-checked:text-accent-text peer-checked:ring-[1.5px] peer-checked:ring-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-disabled:opacity-60 {errors.stage
										? 'bg-surface-2 text-fg-muted ring-1 ring-danger'
										: 'bg-surface-2 text-fg-muted ring-1 ring-border hover:bg-surface-3'}"
								>
									{option}
								</span>
							</label>
						{/each}
					</div>
					{@render error('stage')}
				</fieldset>

				<div>
					<label for="blocker" class={labelCls}>{f.blocker}</label>
					<textarea
						id="blocker"
						name="blocker"
						maxlength={LIMITS.blocker}
						bind:value={values.blocker}
						onblur={onblur('blocker')}
						oninput={oninput('blocker')}
						aria-invalid={errors.blocker ? 'true' : undefined}
						aria-describedby={describedBy('blocker')}
						class="mt-2 h-[120px] {input} resize-y py-3 {ring('blocker')}"
					></textarea>
					{@render error('blocker')}
				</div>

				<div>
					<div class="flex items-baseline justify-between gap-4">
						<label for="link" class={labelCls}>{f.link}</label>
						<span class="text-[14px] text-fg-subtle">{f.optional}</span>
					</div>
					<input
						id="link"
						name="link"
						type="url"
						inputmode="url"
						placeholder="https://"
						maxlength={LIMITS.link}
						bind:value={values.link}
						onblur={onblur('link')}
						oninput={oninput('link')}
						aria-invalid={errors.link ? 'true' : undefined}
						aria-describedby={describedBy('link')}
						class="mt-2 h-[46px] {input} {ring('link')}"
					/>
					{@render error('link')}
				</div>

				<!-- Honeypot: off screen and out of the tab order; people never fill it. -->
				<div aria-hidden="true" class="absolute -left-[9999px] h-px w-px overflow-hidden">
					<label for={HONEYPOT}>{HONEYPOT}</label>
					<input
						id={HONEYPOT}
						name={HONEYPOT}
						type="text"
						tabindex="-1"
						autocomplete="off"
						bind:value={honeypot}
					/>
				</div>
			</fieldset>

			<div class="flex flex-col items-start gap-4">
				<Button
					type="submit"
					disabled={sending}
					class="w-full sm:w-auto {sending ? '!opacity-60' : ''}"
				>
					{#if sending}
						<Icon name="loader" size={16} stroke={2} class="motion-safe:animate-spin" />
						{f.sending}
					{:else}
						{f.submit}
					{/if}
				</Button>
				<p class="m-0 text-[14px] text-fg-subtle">
					{freeConsult.contact.name} · {freeConsult.contact.place} ·
					<a href={tel} class="font-mono text-fg-subtle no-underline hover:underline"
						>{site.phone}</a
					>
					·
					<MissingLink
						href={site.linkedin}
						external
						class="text-fg-subtle no-underline hover:underline">{labels.cta.linkedin}</MissingLink
					>
				</p>
			</div>
		</form>
	{/if}
</div>
