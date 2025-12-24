<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import type { TeamMember } from '$lib/types';
	import { Plus, Search, Trash2, Edit, X, UserCircle } from 'lucide-svelte';

	let searchQuery = $state('');
	let showModal = $state(false);
	let editingMember = $state<TeamMember | null>(null);

	// Form state
	let formName = $state('');
	let formRole = $state('');
	let formDepartment = $state('');
	let formEmail = $state('');
	let formPhone = $state('');
	let formImage = $state('');
	let formBio = $state('');
	let formStatus = $state<'Active' | 'Inactive'>('Active');

	let filteredMembers = $derived(
		adminStore.teamMembers.filter(
			(m) =>
				m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.department.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function openAddModal() {
		editingMember = null;
		formName = '';
		formRole = '';
		formDepartment = '';
		formEmail = '';
		formPhone = '';
		formImage =
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200';
		formBio = '';
		formStatus = 'Active';
		showModal = true;
	}

	function openEditModal(member: TeamMember) {
		editingMember = member;
		formName = member.name;
		formRole = member.role;
		formDepartment = member.department;
		formEmail = member.email;
		formPhone = member.phone;
		formImage = member.image;
		formBio = member.bio;
		formStatus = member.status;
		showModal = true;
	}

	function handleSubmit() {
		if (editingMember) {
			editingMember.name = formName;
			editingMember.role = formRole;
			editingMember.department = formDepartment;
			editingMember.email = formEmail;
			editingMember.phone = formPhone;
			editingMember.image = formImage;
			editingMember.bio = formBio;
			editingMember.status = formStatus;
		} else {
			adminStore.addTeamMember({
				name: formName,
				role: formRole,
				department: formDepartment,
				email: formEmail,
				phone: formPhone,
				image: formImage,
				bio: formBio,
				status: formStatus
			});
		}
		showModal = false;
	}

	function deleteMember(id: string) {
		if (confirm('Are you sure you want to delete this team member?')) {
			adminStore.deleteTeamMember(id);
		}
	}
</script>

<svelte:head>
	<title>Team Management | Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
			<p class="text-slate-500">Manage your team members and staff</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-pink-500/25 transition-transform hover:scale-105"
		>
			<Plus class="h-5 w-5" />
			Add Team Member
		</button>
	</div>

	<!-- Search -->
	<div class="relative">
		<Search class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search team members..."
			class="w-full rounded-2xl border-0 bg-white py-3.5 pr-4 pl-12 text-slate-900 shadow-lg ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-pink-500 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
		/>
	</div>

	<!-- Team Grid -->
	<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredMembers as member (member.id)}
			<div
				class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:ring-slate-800"
			>
				<!-- Status Indicator -->
				<div class="absolute top-4 right-4 flex items-center gap-1.5">
					<span
						class="h-2.5 w-2.5 rounded-full {member.status === 'Active'
							? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
							: 'bg-slate-400'}"
					></span>
					<span class="text-[10px] font-medium tracking-wide text-slate-400 uppercase"
						>{member.status}</span
					>
				</div>

				<div class="flex gap-4">
					<div
						class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30"
					>
						<img src={member.image} alt={member.name} class="h-full w-full object-cover" />
					</div>
					<div class="flex-1 overflow-hidden pr-16">
						<h3 class="truncate font-bold text-slate-900 dark:text-white">{member.name}</h3>
						<p class="text-sm text-pink-600 dark:text-pink-400">{member.role}</p>
						<p class="text-xs text-slate-500">{member.department}</p>
					</div>
				</div>

				<p class="mt-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>

				<div
					class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"
				>
					<div class="text-xs text-slate-500">
						<p>{member.email}</p>
					</div>
					<div class="flex gap-1">
						<button
							onclick={() => openEditModal(member)}
							class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
						>
							<Edit class="h-4 w-4" />
						</button>
						<button
							onclick={() => deleteMember(member.id)}
							class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredMembers.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800"
		>
			<UserCircle class="h-16 w-16 text-slate-300 dark:text-slate-700" />
			<h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">No team members found</h3>
			<p class="text-slate-500">Add your first team member to get started</p>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-slate-900 dark:text-white">
					{editingMember ? 'Edit Team Member' : 'Add Team Member'}
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
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
						<input
							type="text"
							bind:value={formRole}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
						<input
							type="text"
							bind:value={formDepartment}
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
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
					<input
						type="url"
						bind:value={formImage}
						class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
					/>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
					<textarea
						bind:value={formBio}
						rows="3"
						class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
					></textarea>
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
						class="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 py-2.5 font-medium text-white shadow-lg"
					>
						{editingMember ? 'Save Changes' : 'Add Member'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
