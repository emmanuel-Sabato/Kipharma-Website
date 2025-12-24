<script lang="ts">
	import { Truck, ShieldCheck, Stethoscope, Microscope, HeartPulse, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Services | Kipharma</title>
</svelte:head>

<div class="space-y-16 py-8">
	<!-- Hero Section -->
	<section class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">Our Services</h1>
		<p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
			Comprehensive healthcare solutions tailored to meet the needs of individuals and healthcare
			providers across Rwanda.
		</p>
	</section>

	<!-- Services Grid -->
	<section class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Service 1 -->
		<div
			class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-6 inline-flex rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Truck class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
				Pharmaceutical Distribution
			</h3>
			<p class="leading-relaxed text-gray-600 dark:text-gray-400">
				Reliable supply chain services ensuring timely delivery of pharmaceuticals to hospitals,
				clinics, and pharmacies nationwide.
			</p>
		</div>

		<!-- Service 2 -->
		<div
			class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-6 inline-flex rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Sparkles class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Personal Care & Beauty</h3>
			<p class="leading-relaxed text-gray-600 dark:text-gray-400">
				Curated selection of premium skincare, cosmetics, and hygiene products for your daily
				wellness and beauty needs.
			</p>
		</div>

		<!-- Service 3 -->
		<div
			class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-6 inline-flex rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Stethoscope class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Expert Consultation</h3>
			<p class="leading-relaxed text-gray-600 dark:text-gray-400">
				Access to professional advice from our qualified pharmacists to help you make informed
				health decisions.
			</p>
		</div>

		<!-- Service 4 -->
		<div
			class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-6 inline-flex rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<ShieldCheck class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Quality Assurance</h3>
			<p class="leading-relaxed text-gray-600 dark:text-gray-400">
				Strict quality control processes to guarantee safety and efficacy of all medical and
				personal care products.
			</p>
		</div>

		<!-- Service 5 -->
		<div
			class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-6 inline-flex rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<Microscope class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Laboratory Supplies</h3>
			<p class="leading-relaxed text-gray-600 dark:text-gray-400">
				Provision of state-of-the-art laboratory equipment and reagents for accurate diagnostic
				results.
			</p>
		</div>

		<!-- Service 6 -->
		<div
			class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="mb-6 inline-flex rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
			>
				<HeartPulse class="h-8 w-8" />
			</div>
			<h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Community Health</h3>
			<p class="leading-relaxed text-gray-600 dark:text-gray-400">
				Active participation in community health initiatives and wellness programs to promote a
				healthier society.
			</p>
		</div>
	</section>

	<!-- CTA Section -->
	<section
		class="relative overflow-hidden rounded-3xl bg-red-600 px-6 py-12 text-center text-white md:px-12 md:py-16"
	>
		<div class="relative z-10 mx-auto max-w-3xl">
			<h2 class="mb-4 text-3xl font-bold">Ready to Partner With Us?</h2>
			<p class="mb-8 text-red-100">
				Contact our team today to learn more about how we can support your healthcare and business
				needs.
			</p>
			<a
				href="/contact"
				class="inline-block rounded-full bg-white px-8 py-3.5 font-bold text-red-600 shadow-lg transition-transform hover:scale-105 active:scale-95"
			>
				Get in Touch
			</a>
		</div>
	</section>
</div>
