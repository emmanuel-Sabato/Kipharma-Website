<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, Star, Shield, Heart, Truck, Package, Loader2 } from 'lucide-svelte';
	import doctorImg from '$lib/assets/doctor1.png';

	const API_URL = 'http://localhost:5000/api';

	interface Product {
		_id: string;
		name: string;
		category: string;
		price: number;
		image: string;
		description?: string;
	}

	let products = $state<Product[]>([]);
	let isLoading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const response = await fetch(`${API_URL}/public/products?featured=true&limit=8`);
			const data = await response.json();
			
			if (data.success) {
				products = data.products;
			}
		} catch (err) {
			console.error('Failed to fetch products:', err);
			error = 'Failed to load products';
		} finally {
			isLoading = false;
		}
	});

	// Format price
	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-RW', {
			style: 'decimal',
			minimumFractionDigits: 0
		}).format(price) + ' RWF';
	}
</script>

<svelte:head>
	<title>Kipharma | Caring for Health, Caring for You</title>
</svelte:head>

<div class="space-y-16 pb-16">
	<!-- Hero Section -->
	<section
		class="relative overflow-hidden rounded-3xl bg-red-50 px-6 py-12 md:px-12 md:py-20 lg:py-24 dark:bg-red-900/10"
	>
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="z-10 space-y-6">
				<div
					class="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300"
				>
					<Star class="h-4 w-4 fill-current" />
					<span>Trusted Medical Supplier</span>
				</div>
				<h1
					class="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
				>
					Caring for <span class="text-red-600">Health</span><br />
					Caring for <span class="text-gray-900 dark:text-gray-100">You</span>
				</h1>
				<p class="max-w-xl text-lg text-gray-600 dark:text-gray-300">
					Enhancing your wellbeing with premium pharmaceutical and personal care products. From
					skincare essentials to advanced medical supplies, we are your partner in health.
				</p>
				<div class="flex flex-wrap gap-4">
					<a
						href="/products"
						class="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-red-600/20 transition-transform hover:scale-105 active:scale-95"
					>
						Discover More
					</a>
					<a
						href="/services"
						class="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-red-600 shadow-lg shadow-gray-200/50 transition-transform hover:scale-105 active:scale-95 dark:bg-gray-800 dark:text-white dark:shadow-black/20"
					>
						See All Services
					</a>
				</div>
			</div>

			<!-- Hero Image -->
			<div
				class="relative flex items-end justify-center lg:absolute lg:right-0 lg:bottom-0 lg:h-full lg:w-1/2 lg:justify-end"
			>
				<!-- abstract shapes background -->
				<div
					class="absolute top-10 right-10 h-64 w-64 rounded-full bg-green-200/50 blur-3xl dark:bg-green-900/20"
				></div>
				<div
					class="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-900/20"
				></div>

				<!-- Doctor Image -->
				<img
					src={doctorImg}
					alt="Kipharma Pharmacist"
					class="relative z-10 max-h-[500px] object-contain drop-shadow-2xl lg:max-h-[650px]"
				/>
			</div>
		</div>
	</section>

	<!-- Services Grid -->
	<section class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
		<div
			class="transition-hover rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:border-red-100 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Shield class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Quality Assurance</h3>
			<p class="text-gray-600 dark:text-gray-400">
				All our products undergo rigorous testing to ensure they meet the highest medical standards.
			</p>
		</div>
		<div
			class="transition-hover rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:border-red-100 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Heart class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Personal Care</h3>
			<p class="text-gray-600 dark:text-gray-400">
				A wide range of skincare, beauty, and hygiene products tailored for your daily needs.
			</p>
		</div>
		<div
			class="transition-hover rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:border-red-100 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Truck class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Fast Delivery</h3>
			<p class="text-gray-600 dark:text-gray-400">
				Quick and reliable delivery service to all branches and partners across the country.
			</p>
		</div>
	</section>

	<!-- Featured Products -->
	<section>
		<div class="mb-10 flex items-end justify-between">
			<div>
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Explore our top-rated personal care essentials.
				</p>
			</div>
			<a
				href="/products"
				class="hidden text-sm font-semibold text-red-600 hover:underline md:block dark:text-red-400"
				>View All Products &rarr;</a
			>
		</div>

		{#if isLoading}
			<!-- Loading State -->
			<div class="flex items-center justify-center py-16">
				<Loader2 class="h-8 w-8 animate-spin text-red-600" />
				<span class="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
			</div>
		{:else if products.length === 0}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
				<div class="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
					<Package class="h-12 w-12 text-gray-400" />
				</div>
				<h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">No Available Products</h3>
				<p class="mt-2 max-w-sm text-gray-600 dark:text-gray-400">
					Products will be displayed here once they are added by the administrator.
				</p>
			</div>
		{:else}
			<!-- Products Grid -->
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each products as product (product._id)}
					<div
						class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
					>
						<div
							class="flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-100"
						>
							{#if product.image}
								<img
									src={product.image}
									alt={product.name}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							{:else}
								<Package class="h-16 w-16 text-gray-300" />
							{/if}
						</div>
						<div class="p-5">
							<p class="text-xs font-medium text-red-600 dark:text-red-400">{product.category}</p>
							<h3 class="mt-1 text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
							<div class="mt-4 flex items-center justify-between">
								<span class="text-base font-semibold text-gray-900 dark:text-white"
									>{formatPrice(product.price)}</span
								>
								<button
									class="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-red-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-600"
								>
									<ArrowRight class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-8 text-center md:hidden">
			<a
				href="/products"
				class="text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
				>View All Products &rarr;</a
			>
		</div>
	</section>
</div>
