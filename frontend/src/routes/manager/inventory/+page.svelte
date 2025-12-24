<script lang="ts">
	import { managerStore } from '$lib/stores/managerStore.svelte';
	import { Search, Plus, Minus, Bell, Package, ArrowUpDown, Filter } from 'lucide-svelte';

	let searchQuery = $state('');
	let stockInputs = $state<Record<string, number>>({});
	let sortBy = $state<'name' | 'stock' | 'price'>('name');

	let filteredProducts = $derived(
		managerStore.myProducts
			.filter(
				(p) =>
					p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					p.category.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((a, b) => {
				if (sortBy === 'stock') return a.stock - b.stock;
				if (sortBy === 'price') return b.price - a.price;
				return a.name.localeCompare(b.name);
			})
	);

	function handleStockUpdate(productId: string, type: 'in' | 'out') {
		const amount = stockInputs[productId] || 1;
		if (amount <= 0) return;
		const success = managerStore.updateStock(productId, amount, type);
		if (success) {
			stockInputs[productId] = 0;
		} else {
			alert('Cannot remove more stock than available.');
		}
	}

	function notifyAdmin(productName: string, productId: string) {
		if (confirm(`Notify admin about low stock for ${productName}?`)) {
			const success = managerStore.notifyAdmin(productId);
			if (success) {
				alert(`✅ Admin has been notified about low stock for "${productName}"`);
			} else {
				alert('Failed to send notification. Please try again.');
			}
		}
	}
</script>

<svelte:head>
	<title>Inventory | Manager Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
			<p class="text-slate-500 dark:text-slate-400">Track and manage your branch stock levels</p>
		</div>
		<div class="flex items-center gap-3">
			<div
				class="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800"
			>
				<Package class="h-4 w-4 text-slate-400" />
				<span class="text-sm font-medium text-slate-900 dark:text-white"
					>{managerStore.myProducts.length}</span
				>
				<span class="text-sm text-slate-500">Products</span>
			</div>
		</div>
	</div>

	<!-- Search & Filters -->
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search products by name or category..."
				class="w-full rounded-2xl border-0 bg-white py-3.5 pr-4 pl-12 text-slate-900 shadow-lg ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
			/>
		</div>
		<div class="flex gap-2">
			<button
				onclick={() => (sortBy = 'name')}
				class="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all {sortBy ===
				'name'
					? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
					: 'bg-white text-slate-600 ring-1 ring-slate-200/50 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'}"
			>
				<ArrowUpDown class="h-4 w-4" />
				Name
			</button>
			<button
				onclick={() => (sortBy = 'stock')}
				class="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all {sortBy ===
				'stock'
					? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
					: 'bg-white text-slate-600 ring-1 ring-slate-200/50 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'}"
			>
				<Filter class="h-4 w-4" />
				Stock
			</button>
		</div>
	</div>

	<!-- Product Grid -->
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredProducts as product (product.id)}
			<div
				class="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800"
			>
				<!-- Status Indicator -->
				<div class="absolute top-4 right-4">
					<span
						class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
						{product.status === 'In Stock'
							? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
							: product.status === 'Low Stock'
								? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
								: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}"
					>
						{#if product.status === 'Low Stock'}
							<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
						{/if}
						{product.status}
					</span>
				</div>

				<!-- Product Info -->
				<div class="flex gap-4">
					<div
						class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900"
					>
						<img
							src={product.image}
							alt={product.name}
							class="h-full w-full object-cover transition-transform group-hover:scale-110"
						/>
					</div>
					<div class="flex-1 overflow-hidden">
						<h3 class="truncate font-bold text-slate-900 dark:text-white">{product.name}</h3>
						<p class="text-sm text-slate-500">{product.category}</p>
						<p class="mt-2 text-lg font-bold text-purple-600 dark:text-purple-400">
							{product.price.toLocaleString()}
							<span class="text-sm font-normal text-slate-400">RWF</span>
						</p>
					</div>
				</div>

				<!-- Stock Controls -->
				<div class="mt-5 flex items-center gap-3">
					{#if product.stock < 50}
						<button
							onclick={() => notifyAdmin(product.name, product.id)}
							class="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 text-sm font-medium text-white shadow-lg shadow-amber-500/25 transition-transform hover:scale-105"
							title="Notify Admin"
						>
							<Bell class="h-4 w-4" />
						</button>
					{/if}

					<div class="flex flex-1 items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
						<button
							onclick={() => handleStockUpdate(product.id, 'out')}
							disabled={product.stock <= 0}
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
						>
							<Minus class="h-4 w-4" />
						</button>

						<div class="flex-1 text-center">
							<span class="text-lg font-bold text-slate-900 dark:text-white">{product.stock}</span>
							<span class="ml-1 text-xs text-slate-400">units</span>
						</div>

						<input
							type="number"
							min="1"
							placeholder="1"
							bind:value={stockInputs[product.id]}
							class="w-12 rounded-lg border-0 bg-white px-2 py-1 text-center text-sm font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
						/>

						<button
							onclick={() => handleStockUpdate(product.id, 'in')}
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-700 dark:text-slate-300"
						>
							<Plus class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredProducts.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800"
		>
			<Package class="h-16 w-16 text-slate-300 dark:text-slate-700" />
			<h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
			<p class="text-slate-500">Try adjusting your search query</p>
		</div>
	{/if}
</div>
