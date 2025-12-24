<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import {
		Users,
		Building2,
		Package,
		TrendingUp,
		UserPlus,
		Plus,
		Bell,
		X,
		Check,
		AlertTriangle,
		ArrowUpRight,
		Clock,
		Sparkles,
		ChevronRight
	} from 'lucide-svelte';

	let showNotifications = $state(false);
</script>

<svelte:head>
	<title>Admin Dashboard | Kipharma</title>
</svelte:head>

<div class="space-y-8">
	<!-- Welcome Header -->
	<div
		class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 p-8 text-white shadow-2xl shadow-red-500/25"
	>
		<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
		<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
		<div class="relative flex items-center justify-between">
			<div>
				<div class="flex items-center gap-2 text-red-200">
					<Clock class="h-4 w-4" />
					<span class="text-sm"
						>{new Date().toLocaleDateString('en-US', {
							weekday: 'long',
							month: 'long',
							day: 'numeric'
						})}</span
					>
				</div>
				<h1 class="mt-2 text-3xl font-bold">Welcome, Administrator! 🛡️</h1>
				<p class="mt-1 text-red-200">Here's an overview of your pharmacy network.</p>
			</div>
			<div class="flex gap-3">
				<!-- Notification Bell -->
				<div class="relative">
					<button
						onclick={() => (showNotifications = !showNotifications)}
						class="relative rounded-xl bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
					>
						<Bell class="h-5 w-5" />
						{#if adminStore.unreadCount > 0}
							<span
								class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900"
							>
								{adminStore.unreadCount}
							</span>
						{/if}
					</button>

					<!-- Notification Dropdown -->
					{#if showNotifications}
						<div
							class="absolute top-14 right-0 z-50 w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white text-slate-900 shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:text-white"
						>
							<div
								class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800"
							>
								<h3 class="font-bold">Notifications</h3>
								{#if adminStore.notifications.length > 0}
									<button
										onclick={() => adminStore.markAllAsRead()}
										class="text-xs font-medium text-red-600 hover:text-red-700"
									>
										Mark all read
									</button>
								{/if}
							</div>
							<div class="max-h-80 overflow-y-auto">
								{#if adminStore.notifications.length === 0}
									<div class="flex flex-col items-center justify-center py-8 text-gray-400">
										<Bell class="mb-2 h-8 w-8 opacity-50" />
										<p class="text-sm">No notifications yet</p>
									</div>
								{:else}
									{#each adminStore.notifications as notification}
										<div
											class="relative border-b border-gray-50 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 {notification.read
												? 'opacity-60'
												: ''}"
										>
											{#if !notification.read}
												<div
													class="absolute top-1/2 left-2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500"
												></div>
											{/if}
											<div class="ml-4 flex gap-3">
												<div
													class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30"
												>
													<AlertTriangle class="h-5 w-5" />
												</div>
												<div class="flex-1">
													<p class="text-sm font-medium">{notification.productName}</p>
													<p class="text-xs text-gray-500">{notification.message}</p>
													<p class="mt-1 text-[10px] text-gray-400">
														From: {notification.managerName} • {notification.branchName}
													</p>
												</div>
												<div class="flex flex-col gap-1">
													{#if !notification.read}
														<button
															onclick={() => adminStore.markAsRead(notification.id)}
															class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700"
															title="Mark as read"
														>
															<Check class="h-4 w-4" />
														</button>
													{/if}
													<button
														onclick={() => adminStore.deleteNotification(notification.id)}
														class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
														title="Delete"
													>
														<X class="h-4 w-4" />
													</button>
												</div>
											</div>
										</div>
									{/each}
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<a
					href="/admin/users"
					class="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 font-medium backdrop-blur-sm transition-all hover:bg-white/30"
				>
					<UserPlus class="h-4 w-4" />
					Add User
				</a>
				<a
					href="/admin/products"
					class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-medium text-red-600 shadow-lg transition-all hover:bg-red-50"
				>
					<Plus class="h-4 w-4" />
					Add Product
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Total Branches -->
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
					<Building2 class="h-6 w-6 text-white" />
				</div>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Branches</p>
				<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
					{adminStore.branches.length}
				</p>
				<div class="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
					<ArrowUpRight class="h-3 w-3" />
					<span class="font-medium"
						>{adminStore.branches.filter((b) => b.status === 'Active').length} active</span
					>
				</div>
			</div>
		</div>

		<!-- Total Users -->
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
					<Users class="h-6 w-6 text-white" />
				</div>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</p>
				<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
					{adminStore.users.length}
				</p>
				<div class="mt-3 flex items-center gap-1 text-xs text-slate-500">
					<span class="font-medium">Across all branches</span>
				</div>
			</div>
		</div>

		<!-- Total Products -->
		<div
			class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div
				class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl transition-all group-hover:scale-150"
			></div>
			<div class="relative">
				<div
					class="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg shadow-purple-500/25"
				>
					<Package class="h-6 w-6 text-white" />
				</div>
				<p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
				<p class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
					{adminStore.products.length}
				</p>
				<div class="mt-3 flex items-center gap-1 text-xs">
					<span
						class="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
					>
						{adminStore.products.filter((p) => p.status === 'Low Stock').length} low stock
					</span>
				</div>
			</div>
		</div>

		<!-- Quick Action -->
		<a
			href="/admin/branches"
			class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 p-6 text-white shadow-xl shadow-red-500/25 transition-all hover:-translate-y-1 hover:shadow-2xl"
		>
			<div
				class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-all group-hover:scale-150"
			></div>
			<div class="relative">
				<div class="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-sm">
					<Sparkles class="h-6 w-6" />
				</div>
				<p class="text-sm font-medium text-red-200">Quick Action</p>
				<p class="mt-1 text-xl font-bold">Manage Branches</p>
				<div
					class="mt-3 flex items-center gap-1 text-sm text-red-200 transition-all group-hover:translate-x-1"
				>
					<span>Open Settings</span>
					<ChevronRight class="h-4 w-4" />
				</div>
			</div>
		</a>
	</div>

	<!-- Bottom Section -->
	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Quick Links -->
		<div
			class="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div class="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
				<h2 class="font-bold text-slate-900 dark:text-white">Quick Links</h2>
			</div>
			<div class="divide-y divide-slate-100 dark:divide-slate-800">
				<a
					href="/admin/branches"
					class="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
				>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25"
					>
						<Building2 class="h-5 w-5 text-white" />
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-slate-900 dark:text-white">Manage Branches</h3>
						<p class="text-sm text-slate-500">Add, edit or remove branch locations</p>
					</div>
					<ChevronRight class="h-5 w-5 text-slate-400" />
				</a>

				<a
					href="/admin/users"
					class="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
				>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25"
					>
						<Users class="h-5 w-5 text-white" />
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-slate-900 dark:text-white">Manage Users</h3>
						<p class="text-sm text-slate-500">Assign staff and manage access</p>
					</div>
					<ChevronRight class="h-5 w-5 text-slate-400" />
				</a>

				<a
					href="/admin/products"
					class="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
				>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
					>
						<Package class="h-5 w-5 text-white" />
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-slate-900 dark:text-white">Manage Products</h3>
						<p class="text-sm text-slate-500">Update inventory and pricing</p>
					</div>
					<ChevronRight class="h-5 w-5 text-slate-400" />
				</a>
			</div>
		</div>

		<!-- Recent Notifications -->
		<div
			class="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 shadow-slate-200/50 ring-slate-100 dark:bg-slate-900 dark:shadow-slate-950/50 dark:ring-slate-800"
		>
			<div
				class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800"
			>
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2">
						<Bell class="h-4 w-4 text-white" />
					</div>
					<h2 class="font-bold text-slate-900 dark:text-white">Recent Alerts</h2>
				</div>
				{#if adminStore.unreadCount > 0}
					<span
						class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400"
					>
						{adminStore.unreadCount} new
					</span>
				{/if}
			</div>
			{#if adminStore.notifications.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-gray-400">
					<Bell class="mb-2 h-10 w-10 opacity-30" />
					<p class="font-medium">No alerts yet</p>
					<p class="text-sm">Managers will notify you about low stock</p>
				</div>
			{:else}
				<div class="divide-y divide-slate-100 dark:divide-slate-800">
					{#each adminStore.notifications.slice(0, 4) as notification}
						<div class="flex items-start gap-3 px-6 py-4">
							<div
								class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30"
							>
								<AlertTriangle class="h-4 w-4" />
							</div>
							<div class="flex-1 overflow-hidden">
								<p class="truncate text-sm font-medium text-slate-900 dark:text-white">
									{notification.productName}
								</p>
								<p class="text-xs text-slate-500">
									{notification.currentStock} units left • {notification.branchName}
								</p>
							</div>
							{#if !notification.read}
								<div class="h-2 w-2 rounded-full bg-red-500"></div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
