<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import {
		LayoutDashboard,
		Building2,
		Users,
		Package,
		Bell,
		LogOut,
		Menu,
		X,
		ChevronRight,
		Shield,
		UserCircle,
		Handshake,
		Briefcase
	} from 'lucide-svelte';
	import { adminStore } from '$lib/stores/adminStore.svelte';

	let isSidebarOpen = $state(false);

	const navigation = [
		{
			name: 'Dashboard',
			href: '/admin',
			icon: LayoutDashboard,
			color: 'from-violet-500 to-purple-600'
		},
		{
			name: 'Branches',
			href: '/admin/branches',
			icon: Building2,
			color: 'from-blue-500 to-cyan-600'
		},
		{
			name: 'Users',
			href: '/admin/users',
			icon: Users,
			color: 'from-emerald-500 to-teal-600'
		},
		{
			name: 'Products',
			href: '/admin/products',
			icon: Package,
			color: 'from-orange-500 to-red-600'
		},
		{
			name: 'Team',
			href: '/admin/team',
			icon: UserCircle,
			color: 'from-pink-500 to-rose-600'
		},
		{
			name: 'Partners',
			href: '/admin/partners',
			icon: Handshake,
			color: 'from-indigo-500 to-blue-600'
		},
		{
			name: 'Careers',
			href: '/admin/careers',
			icon: Briefcase,
			color: 'from-amber-500 to-orange-600'
		}
	];
</script>

<div
	class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
>
	<!-- Animated Background Orbs -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<div
			class="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-300/30 mix-blend-multiply blur-3xl dark:bg-red-900/20"
		></div>
		<div
			class="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/30 mix-blend-multiply blur-3xl dark:bg-blue-900/20"
		></div>
		<div
			class="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-amber-300/30 mix-blend-multiply blur-3xl dark:bg-amber-900/20"
		></div>
	</div>

	<!-- Mobile Header -->
	<header
		class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/20 bg-white/70 px-4 backdrop-blur-xl lg:hidden dark:border-slate-800/50 dark:bg-slate-900/70"
	>
		<button
			onclick={() => (isSidebarOpen = !isSidebarOpen)}
			class="rounded-xl bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
		>
			<Menu class="h-5 w-5" />
		</button>
		<div class="flex items-center gap-2">
			<div class="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 p-1.5">
				<Shield class="h-full w-full text-white" />
			</div>
			<span
				class="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-lg font-bold text-transparent"
				>Kipharma</span
			>
		</div>
		<ThemeToggle />
	</header>

	<div class="flex min-h-screen">
		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/20 bg-white/80 backdrop-blur-2xl transition-all duration-300 ease-out lg:static lg:translate-x-0 dark:border-slate-800/50 dark:bg-slate-900/80 {isSidebarOpen
				? 'translate-x-0 shadow-2xl'
				: '-translate-x-full'}"
		>
			<div class="flex h-full flex-col">
				<!-- Logo -->
				<div class="flex h-20 items-center justify-between px-6">
					<div class="flex items-center gap-3">
						<div class="relative">
							<div
								class="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-2 shadow-lg shadow-red-500/25"
							>
								<Shield class="h-full w-full text-white" />
							</div>
							<div
								class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900"
							></div>
						</div>
						<div>
							<span
								class="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent"
								>Kipharma</span
							>
							<p class="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
								Admin Portal
							</p>
						</div>
					</div>
					<button
						onclick={() => (isSidebarOpen = false)}
						class="rounded-lg p-1.5 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
					>
						<X class="h-5 w-5 text-slate-500" />
					</button>
				</div>

				<!-- Admin Stats Card -->
				<div
					class="mx-4 mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-4 shadow-xl"
				>
					<div class="flex items-center gap-3">
						<div class="relative">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-500 text-lg font-bold text-white shadow-lg"
							>
								A
							</div>
							<div
								class="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"
							></div>
						</div>
						<div class="flex-1 overflow-hidden">
							<p class="truncate text-sm font-semibold text-white">Administrator</p>
							<p class="text-xs text-slate-400">Super Admin</p>
						</div>
					</div>
					<div class="mt-3 flex gap-2">
						<div class="flex-1 rounded-lg bg-white/10 px-2 py-1.5 text-center">
							<p class="text-xs font-bold text-white">{adminStore.branches.length}</p>
							<p class="text-[10px] text-slate-400">Branches</p>
						</div>
						<div class="flex-1 rounded-lg bg-white/10 px-2 py-1.5 text-center">
							<p class="text-xs font-bold text-white">{adminStore.users.length}</p>
							<p class="text-[10px] text-slate-400">Users</p>
						</div>
						<div class="flex-1 rounded-lg bg-white/10 px-2 py-1.5 text-center">
							<p class="text-xs font-bold text-amber-400">{adminStore.unreadCount}</p>
							<p class="text-[10px] text-slate-400">Alerts</p>
						</div>
					</div>
				</div>

				<!-- Navigation -->
				<nav class="flex-1 space-y-2 overflow-y-auto px-4">
					<p class="mb-3 px-3 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
						Navigation
					</p>
					{#each navigation as item}
						{@const isActive = $page.url.pathname === item.href}
						<a
							href={item.href}
							class="group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 {isActive
								? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
								: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'}"
						>
							<div class="relative">
								<item.icon
									class="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
								/>
							</div>
							<span class="flex-1">{item.name}</span>
							{#if isActive}
								<ChevronRight class="h-4 w-4 animate-pulse" />
							{/if}
						</a>
					{/each}
				</nav>

				<!-- Notifications Alert -->
				{#if adminStore.unreadCount > 0}
					<div class="mx-4 mb-4">
						<div
							class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 p-4 ring-1 ring-red-500/20"
						>
							<div
								class="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-red-500/20 blur-2xl"
							></div>
							<div class="relative flex items-start gap-3">
								<div class="rounded-xl bg-gradient-to-br from-red-500 to-rose-600 p-2 shadow-lg">
									<Bell class="h-4 w-4 text-white" />
								</div>
								<div>
									<h4 class="text-sm font-bold text-red-700 dark:text-red-400">New Alerts!</h4>
									<p class="mt-0.5 text-xs text-red-600/80 dark:text-red-500/80">
										{adminStore.unreadCount} unread notifications
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Bottom Actions -->
				<div class="border-t border-slate-200/50 p-4 dark:border-slate-800/50">
					<div class="mb-3 hidden lg:flex lg:items-center lg:justify-between">
						<span class="text-xs text-slate-400">Theme</span>
						<ThemeToggle />
					</div>
					<a
						href="/"
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						<LogOut class="h-4 w-4" />
						Sign Out
					</a>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
			<slot />
		</main>
	</div>
</div>

<style>
	@keyframes blob {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(20px, -30px) scale(1.1);
		}
		50% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		75% {
			transform: translate(30px, 20px) scale(1.05);
		}
	}
	.animate-blob {
		animation: blob 15s infinite ease-in-out;
	}
	.animation-delay-2000 {
		animation-delay: 2s;
	}
	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
