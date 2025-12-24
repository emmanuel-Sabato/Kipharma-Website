<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import { Plus, Pencil, Trash2, Building2, Search, X, ArrowLeft } from 'lucide-svelte';
	import type { Branch } from '$lib/types';

	let searchQuery = $state('');
	let showModal = $state(false);
	let editingBranch = $state<Branch | null>(null);

	// Form State
	let formName = $state('');
	let formLocation = $state('');
	let formManager = $state('');
	let formContact = $state('');
	let formStatus: 'Active' | 'Inactive' = $state('Active');

	// Computed
	let filteredBranches = $derived(
		adminStore.branches.filter(
			(b) =>
				b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				b.location.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function openAddModal() {
		editingBranch = null;
		formName = '';
		formLocation = '';
		formManager = '';
		formContact = '';
		formStatus = 'Active';
		showModal = true;
	}

	function openEditModal(branch: Branch) {
		editingBranch = branch;
		formName = branch.name;
		formLocation = branch.location;
		formManager = branch.manager;
		formContact = branch.contact;
		formStatus = branch.status;
		showModal = true;
	}

	function handleSubmit() {
		if (editingBranch) {
			// Update Logic
			editingBranch.name = formName;
			editingBranch.location = formLocation;
			editingBranch.manager = formManager;
			editingBranch.contact = formContact;
			editingBranch.status = formStatus;
		} else {
			// Add Logic
			adminStore.addBranch({
				name: formName,
				location: formLocation,
				manager: formManager,
				contact: formContact,
				status: formStatus
			});
		}
		showModal = false;
	}

	function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this branch?')) {
			adminStore.deleteBranch(id);
		}
	}
</script>

<svelte:head>
	<title>Manage Branches | Kipharma Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<a
				href="/admin"
				class="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to Dashboard
			</a>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Branches</h1>
			<p class="text-gray-600 dark:text-gray-400">Manage your pharmacy locations</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
		>
			<Plus class="h-4 w-4" />
			Add New Branch
		</button>
	</div>

	<!-- Search and Filter -->
	<div class="relative">
		<Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search branches..."
			class="w-full rounded-xl border border-gray-200 bg-white p-3 pl-10 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
		/>
	</div>

	<!-- List -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredBranches as branch (branch.id)}
			<div
				class="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
			>
				<!-- Status Badge -->
				<div class="absolute top-6 right-6">
					<span
						class="rounded-full px-2 py-1 text-xs font-semibold
                        {branch.status === 'Active'
							? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
							: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}"
					>
						{branch.status}
					</span>
				</div>

				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20"
				>
					<Building2 class="h-6 w-6" />
				</div>

				<h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">{branch.name}</h3>
				<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{branch.location}</p>

				<div class="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
					<div class="flex justify-between">
						<span>Manager:</span>
						<span class="font-medium">{branch.manager}</span>
					</div>
					<div class="flex justify-between">
						<span>Contact:</span>
						<span class="font-medium">{branch.contact}</span>
					</div>
				</div>

				<div class="flex gap-2">
					<button
						onclick={() => openEditModal(branch)}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
					>
						<Pencil class="h-4 w-4" /> Edit
					</button>
					<button
						onclick={() => handleDelete(branch.id)}
						class="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-red-600 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-900/20"
						aria-label="Delete"
					>
						<Trash2 class="h-4 w-4" />
					</button>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredBranches.length === 0}
		<div class="py-12 text-center text-gray-500">
			<p>No branches found matching your search.</p>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
			role="document"
		>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">
					{editingBranch ? 'Edit Branch' : 'Add New Branch'}
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
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
						<input
							type="text"
							bind:value={formName}
							required
							class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
						<input
							type="text"
							bind:value={formLocation}
							required
							class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Manager</label>
						<input
							type="text"
							bind:value={formManager}
							class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contact</label>
						<input
							type="text"
							bind:value={formContact}
							class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
					<select
						bind:value={formStatus}
						class="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					>
						<option value="Active">Active</option>
						<option value="Inactive">Inactive</option>
					</select>
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
						{editingBranch ? 'Update Branch' : 'Add Branch'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
