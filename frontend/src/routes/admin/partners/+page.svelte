<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import type { Partner } from '$lib/types';
	import { Plus, Search, Trash2, Edit, X, Handshake, ExternalLink } from 'lucide-svelte';

	let searchQuery = $state('');
	let showModal = $state(false);
	let editingPartner = $state<Partner | null>(null);

	// Form state
	let formName = $state('');
	let formType = $state<Partner['type']>('Supplier');
	let formLogo = $state('');
	let formWebsite = $state('');
	let formContactPerson = $state('');
	let formEmail = $state('');
	let formPhone = $state('');
	let formStatus = $state<'Active' | 'Inactive'>('Active');

	let filteredPartners = $derived(
		adminStore.partners.filter(
			(p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.type.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function openAddModal() {
		editingPartner = null;
		formName = '';
		formType = 'Supplier';
		formLogo =
			'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200';
		formWebsite = '';
		formContactPerson = '';
		formEmail = '';
		formPhone = '';
		formStatus = 'Active';
		showModal = true;
	}

	function openEditModal(partner: Partner) {
		editingPartner = partner;
		formName = partner.name;
		formType = partner.type;
		formLogo = partner.logo;
		formWebsite = partner.website;
		formContactPerson = partner.contactPerson;
		formEmail = partner.email;
		formPhone = partner.phone;
		formStatus = partner.status;
		showModal = true;
	}

	function handleSubmit() {
		if (editingPartner) {
			editingPartner.name = formName;
			editingPartner.type = formType;
			editingPartner.logo = formLogo;
			editingPartner.website = formWebsite;
			editingPartner.contactPerson = formContactPerson;
			editingPartner.email = formEmail;
			editingPartner.phone = formPhone;
			editingPartner.status = formStatus;
		} else {
			adminStore.addPartner({
				name: formName,
				type: formType,
				logo: formLogo,
				website: formWebsite,
				contactPerson: formContactPerson,
				email: formEmail,
				phone: formPhone,
				status: formStatus
			});
		}
		showModal = false;
	}

	function deletePartner(id: string) {
		if (confirm('Are you sure you want to delete this partner?')) {
			adminStore.deletePartner(id);
		}
	}

	const typeColors: Record<Partner['type'], string> = {
		Supplier: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		Distributor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
		Healthcare: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
		Technology: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
		Other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
	};
</script>

<svelte:head>
	<title>Partners | Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Partners Management</h1>
			<p class="text-slate-500">Manage suppliers, distributors, and business partners</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
		>
			<Plus class="h-5 w-5" />
			Add Partner
		</button>
	</div>

	<!-- Search -->
	<div class="relative">
		<Search class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search partners..."
			class="w-full rounded-2xl border-0 bg-white py-3.5 pr-4 pl-12 text-slate-900 shadow-lg ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
		/>
	</div>

	<!-- Partners Grid -->
	<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredPartners as partner (partner.id)}
			<div
				class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:ring-slate-800"
			>
				<!-- Status Indicator -->
				<div class="absolute top-4 right-4 flex items-center gap-1.5">
					<span
						class="h-2.5 w-2.5 rounded-full {partner.status === 'Active'
							? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
							: 'bg-slate-400'}"
					></span>
					<span class="text-[10px] font-medium tracking-wide text-slate-400 uppercase"
						>{partner.status}</span
					>
				</div>

				<div class="flex gap-4">
					<div
						class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 p-2 dark:from-indigo-900/30 dark:to-blue-900/30"
					>
						<img
							src={partner.logo}
							alt={partner.name}
							class="h-full w-full rounded-xl object-cover"
						/>
					</div>
					<div class="flex-1 overflow-hidden pr-16">
						<h3 class="truncate font-bold text-slate-900 dark:text-white">{partner.name}</h3>
						<span
							class="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium {typeColors[
								partner.type
							]}"
						>
							{partner.type}
						</span>
					</div>
				</div>

				<div class="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-400">
					<p><span class="font-medium">Contact:</span> {partner.contactPerson}</p>
					<p>{partner.email}</p>
				</div>

				<div
					class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"
				>
					<a
						href={partner.website}
						target="_blank"
						rel="noopener"
						class="flex items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
					>
						<ExternalLink class="h-3 w-3" />
						Website
					</a>
					<div class="flex gap-1">
						<button
							onclick={() => openEditModal(partner)}
							class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
						>
							<Edit class="h-4 w-4" />
						</button>
						<button
							onclick={() => deletePartner(partner.id)}
							class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredPartners.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800"
		>
			<Handshake class="h-16 w-16 text-slate-300 dark:text-slate-700" />
			<h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">No partners found</h3>
			<p class="text-slate-500">Add your first partner to get started</p>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-slate-900 dark:text-white">
					{editingPartner ? 'Edit Partner' : 'Add Partner'}
				</h3>
				<button
					onclick={() => (showModal = false)}
					class="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
				>
					<X class="h-5 w-5 text-slate-500" />
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
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
						<input
							type="text"
							bind:value={formName}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
						<select
							bind:value={formType}
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						>
							<option value="Supplier">Supplier</option>
							<option value="Distributor">Distributor</option>
							<option value="Healthcare">Healthcare</option>
							<option value="Technology">Technology</option>
							<option value="Other">Other</option>
						</select>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300"
							>Contact Person</label
						>
						<input
							type="text"
							bind:value={formContactPerson}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
						<select
							bind:value={formStatus}
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						>
							<option value="Active">Active</option>
							<option value="Inactive">Inactive</option>
						</select>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
						<input
							type="email"
							bind:value={formEmail}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
						<input
							type="text"
							bind:value={formPhone}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Website</label>
					<input
						type="url"
						bind:value={formWebsite}
						class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
					/>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Logo URL</label>
					<input
						type="url"
						bind:value={formLogo}
						class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
					/>
				</div>

				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={() => (showModal = false)}
						class="flex-1 rounded-xl bg-slate-100 py-2.5 font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 py-2.5 font-medium text-white shadow-lg"
					>
						{editingPartner ? 'Save Changes' : 'Add Partner'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
