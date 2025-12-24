<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import { Plus, Pencil, Trash2, Search, X, Package, ArrowLeft } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let searchQuery = $state('');
	let showModal = $state(false);
	let editingProduct = $state<Product | null>(null);

	// Form State
	let formName = $state('');
	let formCategory = $state('');
	let formPrice = $state(0);
	let formStock = $state(0);
	let formStatus: Product['status'] = $state('In Stock');
	let formBranchId = $state('');
	let formImage = $state(
		'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'
	); // Default placeholder

	// Computed
	let filteredProducts = $derived(
		adminStore.products.filter(
			(p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.category.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let activeBranches = $derived(adminStore.branches.filter((b) => b.status === 'Active'));

	function openAddModal() {
		editingProduct = null;
		formName = '';
		formCategory = '';
		formPrice = 0;
		formStock = 0;
		formStatus = 'In Stock';
		formBranchId = activeBranches[0]?.id || '';
		showModal = true;
	}

	function openEditModal(product: Product) {
		editingProduct = product;
		formName = product.name;
		formCategory = product.category;
		formPrice = product.price;
		formStock = product.stock;
		formStatus = product.status;
		formBranchId = product.branchId;
		formImage = product.image;
		showModal = true;
	}

	function handleSubmit() {
		if (editingProduct) {
			editingProduct.name = formName;
			editingProduct.category = formCategory;
			editingProduct.price = formPrice;
			editingProduct.stock = formStock;
			editingProduct.status = formStatus;
			editingProduct.branchId = formBranchId;
			editingProduct.image = formImage;
		} else {
			adminStore.addProduct({
				name: formName,
				category: formCategory,
				price: formPrice,
				stock: formStock,
				status: formStatus,
				branchId: formBranchId,
				image: formImage
			});
		}
		showModal = false;
	}

	function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this product?')) {
			adminStore.deleteProduct(id);
		}
	}
</script>

<svelte:head>
	<title>Manage Products | Kipharma Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<a
				href="/admin"
				class="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to Dashboard
			</a>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
			<p class="text-gray-600 dark:text-gray-400">Inventory and pricing</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
		>
			<Plus class="h-4 w-4" />
			Add New Product
		</button>
	</div>

	<!-- Search -->
	<div class="relative max-w-md">
		<Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search products..."
			class="w-full rounded-xl border border-gray-200 bg-white p-3 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
		/>
	</div>

	<!-- Grid -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredProducts as product (product.id)}
			<div
				class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-red-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="relative h-48 overflow-hidden bg-gray-100">
					<img
						src={product.image}
						alt={product.name}
						class="h-full w-full object-cover transition-transform group-hover:scale-105"
					/>
					<div class="absolute top-2 right-2">
						<span
							class="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm
							{product.status === 'In Stock' ? 'text-green-600' : 'text-orange-600'}"
						>
							{product.status}
						</span>
					</div>
				</div>

				<div class="flex flex-1 flex-col p-4">
					<div class="mb-2">
						<p class="text-xs font-medium text-gray-500 uppercase">{product.category}</p>
						<h3 class="font-bold text-gray-900 dark:text-white">{product.name}</h3>
					</div>

					<div class="mt-auto flex items-end justify-between">
						<div>
							<p class="text-xs text-gray-500">Stock: {product.stock}</p>
							<p class="text-lg font-bold text-red-600">{product.price.toLocaleString()} RWF</p>
						</div>

						<div class="flex gap-1">
							<button
								onclick={() => openEditModal(product)}
								class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
							>
								<Pencil class="h-4 w-4" />
							</button>
							<button
								onclick={() => handleDelete(product.id)}
								class="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">
					{editingProduct ? 'Edit Product' : 'Add New Product'}
				</h2>
				<button onclick={() => (showModal = false)} class="text-gray-500 hover:text-gray-700">
					<X class="h-6 w-6" />
				</button>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-4"
			>
				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
					<input
						type="text"
						bind:value={formName}
						required
						class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					/>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
						>Assign to Branch</label
					>
					<select
						bind:value={formBranchId}
						class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					>
						{#each activeBranches as branch}
							<option value={branch.id}>{branch.name}</option>
						{/each}
					</select>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
						<select
							bind:value={formCategory}
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						>
							<option value="Medicine">Medicine</option>
							<option value="Skincare">Skincare</option>
							<option value="Supplements">Supplements</option>
							<option value="Equipment">Equipment</option>
						</select>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
						<select
							bind:value={formStatus}
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						>
							<option value="In Stock">In Stock</option>
							<option value="Low Stock">Low Stock</option>
							<option value="Out of Stock">Out of Stock</option>
						</select>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Price (RWF)</label>
						<input
							type="number"
							bind:value={formPrice}
							min="0"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
							>Stock Quantity</label
						>
						<input
							type="number"
							bind:value={formStock}
							min="0"
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => (showModal = false)}
						class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
					>
						{editingProduct ? 'Update Product' : 'Add Product'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
