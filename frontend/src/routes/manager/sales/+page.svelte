<script lang="ts">
	import { managerStore } from '$lib/stores/managerStore.svelte';
	import {
		Search,
		ShoppingCart,
		Minus,
		Plus,
		Trash2,
		CreditCard,
		Sparkles,
		Receipt,
		X
	} from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let searchQuery = $state('');
	let cart = $state<Array<{ product: Product; quantity: number }>>([]);

	let filteredProducts = $derived(
		managerStore.myProducts.filter(
			(p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.status !== 'Out of Stock'
		)
	);

	let cartTotal = $derived(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
	let cartItemCount = $derived(cart.reduce((sum, item) => sum + item.quantity, 0));

	function addToCart(product: Product) {
		const existing = cart.find((i) => i.product.id === product.id);
		if (existing) {
			if (existing.quantity < product.stock) {
				existing.quantity++;
			} else {
				alert('Not enough stock!');
			}
		} else {
			cart.push({ product, quantity: 1 });
		}
	}

	function removeFromCart(productId: string) {
		const index = cart.findIndex((i) => i.product.id === productId);
		if (index > -1) {
			cart.splice(index, 1);
		}
	}

	function updateQuantity(productId: string, delta: number) {
		const item = cart.find((i) => i.product.id === productId);
		if (item) {
			const newQty = item.quantity + delta;
			if (newQty > 0 && newQty <= item.product.stock) {
				item.quantity = newQty;
			} else if (newQty <= 0) {
				removeFromCart(productId);
			}
		}
	}

	function handleCheckout() {
		if (cart.length === 0) return;
		if (confirm(`Confirm sale of ${cartTotal.toLocaleString()} RWF?`)) {
			let success = true;
			for (const item of cart) {
				if (!managerStore.updateStock(item.product.id, item.quantity, 'out')) {
					success = false;
				}
			}
			if (success) {
				alert('Sale recorded successfully!');
				cart = [];
			} else {
				alert('Error recording sale. Check stock levels.');
			}
		}
	}

	function clearCart() {
		cart = [];
	}
</script>

<svelte:head>
	<title>Point of Sale | Manager Dashboard</title>
</svelte:head>

<div class="flex h-[calc(100vh-120px)] gap-6">
	<!-- Product Grid -->
	<div class="flex flex-1 flex-col gap-6 overflow-hidden">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Point of Sale</h1>
				<p class="text-slate-500 dark:text-slate-400">Quick checkout and sales recording</p>
			</div>
			<div
				class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-white shadow-lg shadow-purple-500/25"
			>
				<Receipt class="h-4 w-4" />
				<span class="text-sm font-medium">{filteredProducts.length} Available</span>
			</div>
		</div>

		<!-- Search -->
		<div class="relative">
			<Search class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search products..."
				class="w-full rounded-2xl border-0 bg-white py-3.5 pr-4 pl-12 text-slate-900 shadow-lg ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
			/>
		</div>

		<!-- Products Grid -->
		<div
			class="grid flex-1 content-start gap-4 overflow-y-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			{#each filteredProducts as product (product.id)}
				<button
					onclick={() => addToCart(product)}
					disabled={product.stock === 0}
					class="group relative flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-lg ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 dark:bg-slate-900 dark:ring-slate-800"
				>
					<!-- Image -->
					<div
						class="relative h-36 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900"
					>
						<img
							src={product.image}
							alt={product.name}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
						></div>
						<div
							class="absolute right-2 bottom-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
						>
							{product.stock} left
						</div>
						<div
							class="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-purple-600 opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:opacity-100 dark:bg-slate-900/90"
						>
							<Plus class="h-5 w-5" />
						</div>
					</div>
					<!-- Info -->
					<div class="flex flex-1 flex-col p-4">
						<h3 class="line-clamp-1 font-bold text-slate-900 dark:text-white">{product.name}</h3>
						<p class="text-xs text-slate-500">{product.category}</p>
						<p class="mt-auto pt-2 text-lg font-bold text-purple-600 dark:text-purple-400">
							{product.price.toLocaleString()}
							<span class="text-sm font-normal text-slate-400">RWF</span>
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Cart Sidebar -->
	<div
		class="flex w-96 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800"
	>
		<!-- Cart Header -->
		<div
			class="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25"
				>
					<ShoppingCart class="h-5 w-5 text-white" />
				</div>
				<div>
					<h2 class="font-bold text-slate-900 dark:text-white">Current Order</h2>
					<p class="text-xs text-slate-500">{cartItemCount} items</p>
				</div>
			</div>
			{#if cart.length > 0}
				<button
					onclick={clearCart}
					class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
				>
					<Trash2 class="h-4 w-4" />
				</button>
			{/if}
		</div>

		<!-- Cart Items -->
		<div class="flex-1 overflow-y-auto p-4">
			{#if cart.length === 0}
				<div class="flex h-full flex-col items-center justify-center text-center">
					<div class="mb-4 rounded-2xl bg-slate-100 p-6 dark:bg-slate-800">
						<ShoppingCart class="h-12 w-12 text-slate-400" />
					</div>
					<h3 class="font-bold text-slate-900 dark:text-white">Cart is empty</h3>
					<p class="mt-1 text-sm text-slate-500">Tap products to add them</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each cart as item}
						<div
							class="group flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-colors dark:bg-slate-800/50"
						>
							<div
								class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800"
							>
								<img
									src={item.product.image}
									alt={item.product.name}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="flex-1 overflow-hidden">
								<p class="truncate text-sm font-semibold text-slate-900 dark:text-white">
									{item.product.name}
								</p>
								<p class="text-sm font-medium text-purple-600 dark:text-purple-400">
									{(item.product.price * item.quantity).toLocaleString()} RWF
								</p>
							</div>
							<div
								class="flex items-center gap-1 rounded-lg bg-white p-1 shadow-sm dark:bg-slate-700"
							>
								<button
									onclick={() => updateQuantity(item.product.id, -1)}
									class="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-600"
								>
									<Minus class="h-3 w-3" />
								</button>
								<span class="w-6 text-center text-sm font-bold">{item.quantity}</span>
								<button
									onclick={() => updateQuantity(item.product.id, 1)}
									class="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-600"
								>
									<Plus class="h-3 w-3" />
								</button>
							</div>
							<button
								onclick={() => removeFromCart(item.product.id)}
								class="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
							>
								<X class="h-4 w-4" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Cart Footer -->
		<div class="border-t border-slate-100 p-5 dark:border-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<span class="text-slate-500">Total</span>
				<span class="text-2xl font-bold text-slate-900 dark:text-white"
					>{cartTotal.toLocaleString()}
					<span class="text-sm font-normal text-slate-400">RWF</span></span
				>
			</div>
			<button
				onclick={handleCheckout}
				disabled={cart.length === 0}
				class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_100%] py-4 font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:bg-right disabled:opacity-50"
			>
				<CreditCard class="h-5 w-5" />
				Complete Sale
			</button>
		</div>
	</div>
</div>
