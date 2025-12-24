<script lang="ts">
	import { managerStore } from '$lib/stores/managerStore.svelte';
	import {
		Package,
		TrendingUp,
		AlertTriangle,
		ArrowUpRight,
		Sparkles,
		Clock,
		ChevronRight
	} from 'lucide-svelte';

	let totalProducts = $derived(managerStore.myProducts.length);
	let lowStockCount = $derived(managerStore.lowStockItems.length);
	let totalStockValue = $derived(
		managerStore.myProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
	);
	let inStockCount = $derived(
		managerStore.myProducts.filter((p) => p.status === 'In Stock').length
	);
</script>

<svelte:head>
	<title>Manager Dashboard | Kipharma</title>
</svelte:head>

<div class="space-y-8">
	<!-- Welcome Header -->
	<div
		class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl shadow-purple-500/25"
	>
		<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
		<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
		<div class="relative">
			<div class="flex items-center gap-2 text-purple-200">
				<Clock class="h-4 w-4" />
				<span class="text-sm"
					>{new Date().toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric'
					})}</span
				>
			</div>
			<h1 class="mt-2 text-3xl font-bold">
				Welcome back, {managerStore.currentManager.name.split(' ')[0]}! 👋
			</h1>
			<p class="mt-1 text-purple-200">Here's what's happening with your branch today.</p>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Total Products -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div
				class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-2xl transition-all group-hover:scale-150"
			></div>
			<div class="relative">
				<div
					class="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3 shadow-lg shadow-blue-500/25"
				>
					<Package class="h-6 w-6 text-white" />
				</div>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
				<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{totalProducts}</p>
				<div class="mt-3 flex items-center gap-1 text-xs">
					<span
						class="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
					>
						{inStockCount} in stock
					</span>
				</div>
			</div>
		</div>

		<!-- Low Stock Alerts -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div
				class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-2xl transition-all group-hover:scale-150"
			></div>
			<div class="relative">
				<div
					class="mb-4 inline-flex rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-3 shadow-lg shadow-amber-500/25"
				>
					<AlertTriangle class="h-6 w-6 text-white" />
				</div>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock Alerts</p>
				<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{lowStockCount}</p>
				<div class="mt-3 flex items-center gap-1 text-xs">
					{#if lowStockCount > 0}
						<span
							class="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
						>
							<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></span>
							Needs attention
						</span>
					{:else}
						<span
							class="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
							>All clear</span
						>
					{/if}
				</div>
			</div>
		</div>

		<!-- Stock Value -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div
				class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-2xl transition-all group-hover:scale-150"
			></div>
			<div class="relative">
				<div
					class="mb-4 inline-flex rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-lg shadow-emerald-500/25"
				>
					<TrendingUp class="h-6 w-6 text-white" />
				</div>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Stock Value</p>
				<p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
					{(totalStockValue / 1000).toFixed(0)}K
					<span class="text-base font-normal text-slate-400">RWF</span>
				</p>
				<div class="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
					<ArrowUpRight class="h-3 w-3" />
					<span class="font-medium">Retail value</span>
				</div>
			</div>
		</div>

		<!-- Quick Action -->
		<a
			href="/manager/sales"
			class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-6 text-white shadow-xl shadow-purple-500/25 transition-all hover:-translate-y-1 hover:shadow-2xl"
		>
			<div
				class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-all group-hover:scale-150"
			></div>
			<div class="relative">
				<div class="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-sm">
					<Sparkles class="h-6 w-6" />
				</div>
				<p class="text-sm font-medium text-purple-200">Quick Action</p>
				<p class="mt-1 text-xl font-bold">Start Selling</p>
				<div
					class="mt-3 flex items-center gap-1 text-sm text-purple-200 transition-all group-hover:translate-x-1"
				>
					<span>Open POS</span>
					<ChevronRight class="h-4 w-4" />
				</div>
			</div>
		</a>
	</div>

	<!-- Low Stock Section -->
	{#if lowStockCount > 0}
		<div
			class="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div
				class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800"
			>
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2">
						<AlertTriangle class="h-4 w-4 text-white" />
					</div>
					<h2 class="font-bold text-slate-900 dark:text-white">Low Stock Items</h2>
				</div>
				<a
					href="/manager/inventory"
					class="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
				>
					View All →
				</a>
			</div>
			<div class="divide-y divide-slate-100 dark:divide-slate-800">
				{#each managerStore.lowStockItems.slice(0, 5) as item, i}
					<div
						class="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
					>
						<div
							class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800"
						>
							{i + 1}
						</div>
						<div class="h-12 w-12 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
							<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
						</div>
						<div class="flex-1">
							<h4 class="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
							<p class="text-sm text-slate-500">{item.category}</p>
						</div>
						<div class="text-right">
							<p class="text-lg font-bold text-amber-600 dark:text-amber-400">{item.stock}</p>
							<p class="text-xs text-slate-400">remaining</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
