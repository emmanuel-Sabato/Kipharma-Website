<script lang="ts">
	import { MapPin, Phone, Mail, Clock, Send } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Contact Us | Kipharma</title>
</svelte:head>

<div class="space-y-16 py-8">
	<!-- Header -->
	<section class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">Get in Touch</h1>
		<p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
			Have questions about our products or services? We're here to help. Reach out to us using the
			information below.
		</p>
	</section>

	<div class="grid gap-12 lg:grid-cols-2">
		<!-- Contact Information -->
		<div class="space-y-8">
			<div
				class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
			>
				<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Contact Info</h2>
				<div class="space-y-6">
					<div class="flex items-start gap-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
						>
							<MapPin class="h-5 w-5" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">Head Office</h3>
							<p class="text-gray-600 dark:text-gray-400">123 Health Street, Kigali, Rwanda</p>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
						>
							<Phone class="h-5 w-5" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">Phone</h3>
							<p class="text-gray-600 dark:text-gray-400">+250 123 456 789</p>
							<p class="text-gray-600 dark:text-gray-400">+250 987 654 321</p>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
						>
							<Mail class="h-5 w-5" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">Email</h3>
							<p class="text-gray-600 dark:text-gray-400">info@kipharma.com</p>
							<p class="text-gray-600 dark:text-gray-400">sales@kipharma.com</p>
						</div>
					</div>

					<div class="flex items-start gap-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
						>
							<Clock class="h-5 w-5" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">Working Hours</h3>
							<p class="text-gray-600 dark:text-gray-400">Mon - Fri: 8:00 AM - 6:00 PM</p>
							<p class="text-gray-600 dark:text-gray-400">Sat: 9:00 AM - 2:00 PM</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Map Placeholder -->
			<div
				class="h-64 overflow-hidden rounded-2xl border border-gray-100 bg-gray-200 dark:border-gray-800 dark:bg-gray-800"
			>
				<iframe
					title="Office Location"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.0506822818!2d30.0401876!3d-1.9440727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xf329998bf0799d74!2sKigali!5e0!3m2!1sen!2srw!4v1647856754321!5m2!1sen!2srw"
					width="100%"
					height="100%"
					style="border:0;"
					loading="lazy"
				></iframe>
			</div>
		</div>

		<!-- Contact Form -->
		<div
			class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
		>
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
			<form class="space-y-6">
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>First Name</label
						>
						<input
							type="text"
							id="name"
							class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
							placeholder="John"
						/>
					</div>
					<div class="space-y-2">
						<label for="lastname" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Last Name</label
						>
						<input
							type="text"
							id="lastname"
							class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
							placeholder="Doe"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Email Address</label
					>
					<input
						type="email"
						id="email"
						class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						placeholder="john@example.com"
					/>
				</div>

				<div class="space-y-2">
					<label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Subject</label
					>
					<select
						id="subject"
						class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					>
						<option>General Inquiry</option>
						<option>Product Order</option>
						<option>Partnership</option>
						<option>Support</option>
					</select>
				</div>

				<div class="space-y-2">
					<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Message</label
					>
					<textarea
						id="message"
						rows="4"
						class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						placeholder="How can we help you?"
					></textarea>
				</div>

				<button
					type="submit"
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-red-700"
				>
					Send Message
					<Send class="h-4 w-4" />
				</button>
			</form>
		</div>
	</div>
</div>
