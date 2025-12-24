<script lang="ts">
	import {
		Package,
		MapPin,
		Users,
		Handshake,
		Briefcase,
		ChevronLeft,
		ChevronRight,
		CircleUser
	} from 'lucide-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let {
		isOpen = false,
		isDesktopCollapsed = false,
		toggleSidebar,
		toggleDesktopCollapse
	} = $props();

	let showCodeInput = $state(false);
	let accessCode = $state('');

	const navItems = [
		{ name: 'Products', href: '/products', icon: Package },
		{ name: 'Branches', href: '/branches', icon: MapPin },
		{ name: 'Teams', href: '/teams', icon: Users },
		{ name: 'Partners', href: '/partners', icon: Handshake },
		{ name: 'Careers', href: '/careers', icon: Briefcase }
	];

	// Helper to check active state
	function isActive(path: string) {
		return $page.url.pathname === path;
	}

	function verifyCode() {
		// Mock verification or simple check
		// The prompt didn't specify the code, so we'll just redirect or check any non-empty
		if (accessCode.trim().length > 0) {
			goto('/login');
			showCodeInput = false;
			accessCode = '';
		} else {
			alert('Please enter a code');
		}
	}
</script>

<aside
	class="
    fixed top-16 left-0 z-40 h-[calc(100vh-64px)]
    border-r border-gray-200 bg-gray-50 transition-all duration-300
    ease-in-out dark:border-gray-800 dark:bg-gray-900
    {isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
    {isDesktopCollapsed ? 'w-20' : 'w-[250px]'}
  "
>
	<!-- Collapse Toggle (Desktop) -->
	<div class="hidden justify-end p-2 md:flex">
		<button
			onclick={toggleDesktopCollapse}
			class="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
		>
			{#if isDesktopCollapsed}
				<ChevronRight class="h-5 w-5" />
			{:else}
				<ChevronLeft class="h-5 w-5" />
			{/if}
		</button>
	</div>

	<!-- Nav Items -->
	<div class="flex-1 overflow-y-auto py-4">
		<ul class="space-y-2 px-3">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class="
                            flex items-center gap-3 rounded-lg p-3
                            transition-all duration-200
                            {isActive(item.href)
							? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
							: 'text-gray-700 hover:bg-gray-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400'}
                            {isDesktopCollapsed ? 'justify-center' : ''}
                        "
						title={isDesktopCollapsed ? item.name : ''}
					>
						<item.icon class="h-6 w-6 shrink-0" />
						{#if !isDesktopCollapsed}
							<span
								class="overflow-hidden font-medium whitespace-nowrap transition-all duration-300"
							>
								{item.name}
							</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- User Profile / Admin Access (Bottom) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="absolute bottom-0 w-full border-t border-gray-200 bg-gray-100/50 p-4 dark:border-gray-800 dark:bg-gray-900/50"
	>
		{#if !showCodeInput}
			<div
				class="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80 {isDesktopCollapsed
					? 'justify-center'
					: ''}"
				onclick={() => (showCodeInput = true)}
			>
				<div class="relative">
					<CircleUser class="h-10 w-10 text-gray-400" />
					<span
						class="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"
					></span>
				</div>
				{#if !isDesktopCollapsed}
					<div class="overflow-hidden">
						<p class="truncate text-sm font-semibold text-gray-900 dark:text-white">Dr. Alex Doe</p>
						<p class="truncate text-xs text-gray-500 dark:text-gray-400">Click to Access Admin</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex flex-col gap-2 {isDesktopCollapsed ? 'items-center' : ''}">
				{#if !isDesktopCollapsed}
					<p class="text-xs font-medium text-gray-600 dark:text-gray-400">Staff Portal</p>
					<input
						type="password"
						bind:value={accessCode}
						placeholder="What is the Code?"
						class="w-full rounded border border-gray-300 bg-white p-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					/>
					<div class="flex gap-2">
						<button
							onclick={verifyCode}
							class="flex-1 rounded bg-red-600 py-1 text-xs font-bold text-white hover:bg-red-700"
						>
							Verify
						</button>
						<button
							onclick={() => (showCodeInput = false)}
							class="rounded bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
						>
							Cancel
						</button>
					</div>
				{:else}
					<!-- Collapsed view minimal input -->
					<div class="group relative">
						<button
							onclick={() => toggleDesktopCollapse()}
							class="rounded-full bg-red-100 p-2 text-red-600"
						>
							<CircleUser class="h-6 w-6" />
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</aside>

<!-- Overlay for mobile when sidebar is open -->
{#if isOpen}
	<button
		class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
		onclick={toggleSidebar}
		aria-label="Close sidebar"
	></button>
{/if}
