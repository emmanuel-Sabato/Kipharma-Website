<script lang="ts">
	import { goto } from '$app/navigation';
	import { Lock, Mail, ArrowRight, KeyRound, Loader2, AlertCircle } from 'lucide-svelte';
	import logo from '$lib/assets/KIPHARMA-banner-white.png';
	import { authStore } from '$lib/stores/authStore.svelte';

	let accessCode = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let isLoading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		isLoading = true;

		try {
			const result = await authStore.login(accessCode, email, password);
			
			if (result.success) {
				// Redirect based on role
				goto(result.redirectTo);
			} else {
				error = authStore.error || 'Login failed. Please check your credentials.';
			}
		} catch (err: any) {
			error = err.message || 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Staff Login | Kipharma</title>
</svelte:head>

<div class="flex min-h-[80vh] items-center justify-center px-4 py-12">
	<div
		class="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900"
	>
		<div class="text-center">
			<div class="mx-auto flex h-16 w-auto items-center justify-center">
				<div class="inline-block rounded-lg bg-white-600 p-2">
					<img src={logo} alt="Kipharma" class="h-8 w-auto mix-blend-plus-lighter" />
				</div>
			</div>
			<h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
				Staff Portal
			</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Please sign in to access the dashboard
			</p>
		</div>

		{#if error}
			<div class="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
				<AlertCircle class="h-5 w-5 flex-shrink-0" />
				<p class="text-sm">{error}</p>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="mt-8 space-y-6">
			<div class="space-y-4 rounded-md shadow-xs">
				<!-- Access Code Field -->
				<div class="space-y-2">
					<label
						for="access-code"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Portal Access Code
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<KeyRound class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="access-code"
							name="accessCode"
							type="text"
							bind:value={accessCode}
							required
							disabled={isLoading}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500 disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
							placeholder="Enter access code"
						/>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						Contact your administrator for the access code
					</p>
				</div>

				<!-- Email Field -->
				<div class="space-y-2">
					<label
						for="email-address"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Email address
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Mail class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="email-address"
							name="email"
							type="email"
							autocomplete="email"
							bind:value={email}
							required
							disabled={isLoading}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500 disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
							placeholder="admin@kipharma.rw"
						/>
					</div>
				</div>

				<!-- Password Field -->
				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Lock class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							bind:value={password}
							required
							disabled={isLoading}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500 disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
							placeholder="••••••••"
						/>
					</div>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:bg-gray-800"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
						Remember me
					</label>
				</div>

				<div class="text-sm">
					<a href="/" class="font-medium text-red-600 hover:text-red-500">
						← Back to Home
					</a>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative flex w-full justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden disabled:opacity-50 dark:focus:ring-offset-gray-900"
				>
					{#if isLoading}
						<Loader2 class="h-5 w-5 animate-spin" />
						<span class="ml-2">Signing in...</span>
					{:else}
						Sign in
						<span class="absolute inset-y-0 right-0 flex items-center pr-3">
							<ArrowRight class="h-5 w-5 text-red-500 group-hover:text-red-400" />
						</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
