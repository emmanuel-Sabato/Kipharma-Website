<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';

	let { children } = $props();

	let sidebarOpen = $state(false);
	let desktopCollapsed = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleDesktopCollapse() {
		desktopCollapsed = !desktopCollapsed;
	}

	// Determine if we should show the full layout (Navbar, Sidebar, Footer)
	let isLoginPage = $derived($page.url.pathname === '/login');
	let isAdminPage = $derived($page.url.pathname.startsWith('/admin'));
	let isManagerPage = $derived($page.url.pathname.startsWith('/manager'));

	// Pages that have their own dedicated layout (no global navbar/sidebar)
	let hasCustomLayout = $derived(isLoginPage || isAdminPage || isManagerPage);
</script>

<div class="min-h-screen bg-gray-50 font-sans transition-colors duration-300 dark:bg-gray-950">
	{#if !hasCustomLayout}
		<Navbar {toggleSidebar} isSidebarOpen={sidebarOpen} />

		<Sidebar
			isOpen={sidebarOpen}
			isDesktopCollapsed={desktopCollapsed}
			{toggleSidebar}
			{toggleDesktopCollapse}
		/>
	{/if}

	<!-- Main Content -->
	<main
		class="
            flex-1
            transition-all duration-300 ease-in-out
            {hasCustomLayout
			? 'w-full p-0'
			: 'px-4 pt-20 pb-8 md:px-8 md:pt-24 ' + (desktopCollapsed ? 'md:ml-20' : 'md:ml-[250px]')}
        "
	>
		<div class="animate-fade-in mx-auto {hasCustomLayout ? 'w-full' : 'max-w-7xl'}">
			{@render children?.()}
		</div>
	</main>

	{#if !hasCustomLayout}
		<div
			class="transition-all duration-300 ease-in-out {desktopCollapsed
				? 'md:ml-20'
				: 'md:ml-[250px]'}"
		>
			<Footer />
		</div>
	{/if}
</div>

<style>
	/* smooth transitions handled by tailwind classes */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
