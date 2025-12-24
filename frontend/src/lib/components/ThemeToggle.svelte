<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte';

	let isDark = $state(false);

	onMount(() => {
		isDark =
			document.documentElement.classList.contains('dark') ||
			localStorage.getItem('theme') === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

		updateTheme(isDark);
	});

	function toggleTheme() {
		isDark = !isDark;
		updateTheme(isDark);
	}

	function updateTheme(dark: boolean) {
		if (dark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<button
	onclick={toggleTheme}
	class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
	aria-label="Toggle theme"
>
	{#if isDark}
		<Moon class="h-5 w-5 text-blue-500" />
	{:else}
		<Sun class="h-5 w-5 text-orange-500" />
	{/if}
</button>
