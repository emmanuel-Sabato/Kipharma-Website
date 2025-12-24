<script lang="ts">
	import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-svelte';
	import logo from '$lib/assets/KIPHARMA-banner-white.png';
</script>

<footer class="bg-[#DC2626] pt-16 pb-8 text-white">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div class="space-y-4">
				<div class="mb-4 flex items-center gap-2">
					<!-- Logo White version ideally -->
					<img src={logo} alt="Kipharma" class="h-10 w-auto rounded-sm bg-white/90 px-1" />
					<span class="text-2xl font-bold tracking-tight">Kipharma</span>
				</div>
				<p class="text-sm leading-relaxed text-red-100">
					Dedicated to providing high-quality pharmaceutical and personal care products to enhance
					the wellbeing of our community.
				</p>
				<div class="flex gap-4 pt-2">
					<a href="#" class="transition-colors hover:text-red-200"><Facebook class="h-5 w-5" /></a>
					<a href="#" class="transition-colors hover:text-red-200"><Twitter class="h-5 w-5" /></a>
					<a href="#" class="transition-colors hover:text-red-200"><Instagram class="h-5 w-5" /></a>
					<a href="#" class="transition-colors hover:text-red-200"><Linkedin class="h-5 w-5" /></a>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="mb-6 text-lg font-semibold">Quick Links</h3>
				<ul class="space-y-3 text-red-100">
					<li><a href="/" class="transition-colors hover:text-white">Home</a></li>
					<li><a href="/about" class="transition-colors hover:text-white">About Us</a></li>
					<li><a href="/products" class="transition-colors hover:text-white">Products</a></li>
					<li><a href="/branches" class="transition-colors hover:text-white">Branches</a></li>
					<li><a href="/careers" class="transition-colors hover:text-white">Careers</a></li>
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="mb-6 text-lg font-semibold">Contact Us</h3>
				<ul class="space-y-4 text-red-100">
					<li class="flex items-start gap-3">
						<MapPin class="mt-0.5 h-5 w-5 shrink-0" />
						<span>123 Health Street, Kigali, Rwanda</span>
					</li>
					<li class="flex items-center gap-3">
						<Phone class="h-5 w-5 shrink-0" />
						<span>+250 123 456 789</span>
					</li>
					<li class="flex items-center gap-3">
						<Mail class="h-5 w-5 shrink-0" />
						<span>support@kipharma.com</span>
					</li>
				</ul>
			</div>

			<!-- Newsletter -->
			<div>
				<h3 class="mb-6 text-lg font-semibold">Newsletter</h3>
				<p class="mb-4 text-sm text-red-100">
					Subscribe to receive updates on new products and special offers.
				</p>
				<form class="space-y-2">
					<input
						type="email"
						placeholder="Enter your email"
						class="w-full rounded-lg border border-red-700 bg-red-800 px-4 py-2.5 text-white placeholder-red-300 focus:ring-2 focus:ring-white/50 focus:outline-hidden"
					/>
					<button
						class="w-full rounded-lg bg-white py-2.5 font-semibold text-red-600 transition-colors hover:bg-red-50"
					>
						Subscribe
					</button>
				</form>
			</div>
		</div>

		<div class="border-t border-red-700/50 pt-8 text-center text-sm text-red-200">
			<p>&copy; {new Date().getFullYear()} Kipharma. All rights reserved.</p>
		</div>
	</div>
</footer>
