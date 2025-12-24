<script lang="ts">
	import { Search, Globe, Menu, X } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import logo from '$lib/assets/KIPHARMA-banner-white.png';

	let { isSidebarOpen = false, toggleSidebar } = $props();

	let isMobileMenuOpen = false;

	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Services', href: '/services' },
		{ name: 'About Us', href: '/about' },
		{ name: 'Contact', href: '/contact' }
	];
</script>

<nav
	class="fixed top-0 z-50 h-16 w-full border-b border-gray-200 bg-white shadow-xs transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900"
>
	<div class="h-full px-10 lg:px-6">
		<div class="flex h-full items-center">
			<!-- Left: Logo -->
			<div class="mr-auto flex-shrink-0">
				<a href="/" class="flex items-center gap-2">
					<div class="flex items-center gap-2 text-4xl font-bold text-white dark:text-blue-500">
						<img
							src={logo}
							alt="Kipharma"
							class="h-12 w-30 rounded-sm bg-white/80 object-contain p-1"
						/>
					</div>
				</a>
			</div>

			<!-- Center: Links, Search, Lang, Theme (Desktop Only) -->
			<div class="hidden flex-1 items-center justify-center gap-8 md:flex">
				<!-- Desktop Links -->
				<div class="flex items-center gap-6">
					{#each links as link}
						<a
							href={link.href}
							class="group relative text-xl font-medium text-gray-700 transition-colors duration-200 hover:text-red-600 dark:text-gray-200 dark:hover:text-red-400"
						>
							{link.name}
							<span
								class="absolute bottom-[-4px] left-0 h-0.5 w-0 bg-red-600 transition-all duration-200 group-hover:w-full dark:bg-red-400"
							></span>
						</a>
					{/each}
				</div>

				<!-- Search -->
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Search class="h-4 w-4 text-gray-400" />
					</div>
					<input
						type="text"
						class="block h-9 w-[600px] rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 transition-all focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						placeholder="Search..."
					/>
				</div>

				<!-- Language -->
				<div>
					<button
						class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-200 dark:hover:text-red-400"
					>
						<Globe class="h-4 w-4" />
						<span>EN</span>
					</button>
				</div>

				<!-- Theme Toggle -->
				<ThemeToggle />
			</div>

			<!-- Right: Mobile Menu & Theme (Mobile Only) -->
			<div class="ml-auto flex items-center gap-4 md:hidden">
				<ThemeToggle />
				<button
					type="button"
					class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-hidden dark:text-gray-400 dark:hover:bg-gray-700"
					onclick={toggleSidebar}
				>
					<Menu class="h-6 w-6" />
				</button>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile sidebar overlay logic handled in Layout/Sidebar usually, but can be here too. 
     The user requested a "Sidebar Navbar (vertical, left side)" which acts as a drawer in mobile.
     The "Top Navbar" hamburger should toggle that sidebar.
-->
