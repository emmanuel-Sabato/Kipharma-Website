<script lang="ts">
	import { History, Award, Users, Target } from 'lucide-svelte';
	import logo from '$lib/assets/KIPHARMA-banner-white.png';
</script>

<svelte:head>
	<title>About Us | Kipharma</title>
</svelte:head>

<div class="space-y-16 py-8">
	<!-- Hero / Intro -->
	<section class="grid items-center gap-12 lg:grid-cols-2">
		<div class="space-y-6">
			<h1 class="text-4xl leading-tight font-bold text-gray-900 md:text-5xl dark:text-white">
				About <span class="text-red-600">Kipharma</span>
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				We are a leading pharmaceutical and personal care distributor in Rwanda, dedicated to
				bridging the gap between quality healthcare manufacturers and the community. With decades of
				experience, we have established ourselves as a trusted partner in the region's health
				sector.
			</p>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Our portfolio ranges from essential medicines to premium beauty products, ensuring that our
				customers have access to the best global brands locally.
			</p>
		</div>
		<div
			class="flex items-center justify-center rounded-3xl bg-red-50 p-12 lg:h-full dark:bg-red-900/10"
		>
			<!-- Placeholder for an office image or team image, using logo for now -->
			<div class="text-center">
				<img
					src={logo}
					alt="Kipharma Logo"
					class="mx-auto mb-6 h-20 w-auto rounded bg-white p-2 opacity-90 shadow-xl"
				/>
				<p class="font-medium text-red-800 dark:text-red-200">Established Excellence</p>
			</div>
		</div>
	</section>

	<!-- Values Grid -->
	<section>
		<div class="mb-12 text-center">
			<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
			<p class="mt-4 text-gray-600 dark:text-gray-400">
				The principles that guide our every action.
			</p>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
				>
					<Target class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Mission</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					To improve the quality of life in our community by providing affordable, high-quality
					health and wellness products.
				</p>
			</div>
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
				>
					<Award class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Quality</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					We never compromise on the safety and efficacy of the products we distribute.
				</p>
			</div>
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
				>
					<Users class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Integrity</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Building trust through transparent business practices and reliable partnerships.
				</p>
			</div>
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
				>
					<History class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Heritage</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Proudly serving the Rwandan market with dedication for over two decades.
				</p>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section
		class="overflow-hidden rounded-3xl bg-gray-900 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center bg-no-repeat py-20 text-white bg-blend-overlay"
	>
		<div class="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
			<div>
				<div class="text-4xl font-bold text-red-500">20+</div>
				<div class="mt-1 text-sm text-gray-300">Years Active</div>
			</div>
			<div>
				<div class="text-4xl font-bold text-red-500">50+</div>
				<div class="mt-1 text-sm text-gray-300">Global Partners</div>
			</div>
			<div>
				<div class="text-4xl font-bold text-red-500">1k+</div>
				<div class="mt-1 text-sm text-gray-300">Products</div>
			</div>
			<div>
				<div class="text-4xl font-bold text-red-500">5</div>
				<div class="mt-1 text-sm text-gray-300">Branches</div>
			</div>
		</div>
	</section>
</div>
