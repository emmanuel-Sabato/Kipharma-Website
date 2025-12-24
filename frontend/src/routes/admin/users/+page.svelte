<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import {
		Plus,
		Pencil,
		Trash2,
		Search,
		X,
		Copy,
		RefreshCw,
		Check,
		ArrowLeft
	} from 'lucide-svelte';
	import type { User } from '$lib/types';

	let searchQuery = $state('');
	let showModal = $state(false);
	let editingUser = $state<User | null>(null);

	// Form State
	let formName = $state('');
	let formEmail = $state('');
	let formPhone = $state('');
	let formRole: User['role'] = $state('Staff');
	let formBranchId = $state('');
	let formPassword = $state(''); // Only for display during creation

	let copied = $state(false);

	// Computed
	let filteredUsers = $derived(
		adminStore.users.filter(
			(u) =>
				u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function generatePassword() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
		let pass = '';
		for (let i = 0; i < 12; i++) {
			pass += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		formPassword = pass;
	}

	function openAddModal() {
		editingUser = null;
		formName = '';
		formEmail = '';
		formPhone = '';
		formRole = 'Staff';
		formBranchId = adminStore.branches[0]?.id || '';
		generatePassword();
		showModal = true;
	}

	function openEditModal(user: User) {
		editingUser = user;
		formName = user.name;
		formEmail = user.email;
		formPhone = user.phone;
		formRole = user.role;
		formBranchId = user.branchId;
		formPassword = ''; // Don't show password on edit
		showModal = true;
	}

	function handleSubmit() {
		if (editingUser) {
			adminStore.users = adminStore.users.map((u) =>
				u.id === editingUser!.id
					? {
							...u,
							name: formName,
							email: formEmail,
							phone: formPhone,
							role: formRole,
							branchId: formBranchId
						}
					: u
			);
		} else {
			adminStore.addUser({
				name: formName,
				email: formEmail,
				phone: formPhone,
				role: formRole,
				branchId: formBranchId,
				status: 'Active'
			});
		}
		showModal = false;
	}

	function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this user?')) {
			adminStore.deleteUser(id);
		}
	}

	function copyCredentials() {
		const text = `
User Credentials Created:
Name: ${formName}
Email: ${formEmail}
Phone: ${formPhone}
Role: ${formRole}
Password: ${formPassword}
Branch: ${adminStore.branches.find((b) => b.id === formBranchId)?.name || 'N/A'}
		`.trim();

		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function getBranchName(branchId: string) {
		return adminStore.branches.find((b) => b.id === branchId)?.name || 'Unknown Branch';
	}
</script>

<svelte:head>
	<title>Manage Users | Kipharma Admin</title>
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
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
			<p class="text-gray-600 dark:text-gray-400">Manage staff and permissions</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
		>
			<Plus class="h-4 w-4" />
			Add New User
		</button>
	</div>

	<!-- List Table style for users -->
	<div
		class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
	>
		<div class="border-b border-gray-200 p-4 dark:border-gray-800">
			<div class="relative max-w-sm">
				<Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search users..."
					class="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 pl-10 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
				/>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
				<thead
					class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300"
				>
					<tr>
						<th class="px-6 py-3">Name</th>
						<th class="px-6 py-3">Role</th>
						<th class="px-6 py-3">Branch</th>
						<th class="px-6 py-3">Status</th>
						<th class="px-6 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredUsers as user}
						<tr
							class="border-b border-gray-100 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800/50"
						>
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900 dark:text-white">{user.name}</div>
								<div class="text-xs text-gray-500">{user.email}</div>
							</td>
							<td class="px-6 py-4">{user.role}</td>
							<td class="px-6 py-4">{getBranchName(user.branchId)}</td>
							<td class="px-6 py-4">
								<span
									class="rounded-full px-2 py-1 text-xs font-semibold {user.status === 'Active'
										? 'bg-green-100 text-green-700'
										: 'bg-red-100 text-red-700'}"
								>
									{user.status}
								</span>
							</td>
							<td class="px-6 py-4 text-right">
								<button
									onclick={() => openEditModal(user)}
									class="mr-2 text-blue-600 hover:underline">Edit</button
								>
								<button onclick={() => handleDelete(user.id)} class="text-red-600 hover:underline"
									>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">
					{editingUser ? 'Edit User' : 'Add New User'}
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
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
						<input
							type="text"
							bind:value={formName}
							required
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
						<input
							type="email"
							bind:value={formEmail}
							required
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
						<input
							type="text"
							bind:value={formPhone}
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
						<select
							bind:value={formRole}
							class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						>
							<option value="Staff">Staff</option>
							<option value="Pharmacist">Pharmacist</option>
							<option value="Manager">Manager</option>
							<option value="Admin">Admin</option>
						</select>
					</div>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Assign Branch</label>
					<select
						bind:value={formBranchId}
						class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-red-500 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					>
						{#each adminStore.branches as branch}
							<option value={branch.id}>{branch.name}</option>
						{/each}
					</select>
				</div>

				{#if !editingUser}
					<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
						<div class="mb-2 flex items-center justify-between">
							<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
								>Generated Password</label
							>
							<button
								type="button"
								onclick={generatePassword}
								class="text-xs text-red-600 hover:underline"
							>
								<RefreshCw class="mr-1 inline h-3 w-3" /> Regenerate
							</button>
						</div>
						<div class="flex items-center gap-2">
							<code
								class="flex-1 rounded border border-gray-200 bg-white p-2 font-mono text-lg text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
							>
								{formPassword}
							</code>
							<button
								type="button"
								onclick={copyCredentials}
								class="flex flex-col items-center justify-center rounded p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700"
								title="Copy All Credentials"
							>
								{#if copied}
									<Check class="h-5 w-5 text-green-500" />
								{:else}
									<Copy class="h-5 w-5" />
								{/if}
							</button>
						</div>
						<p class="mt-2 text-xs text-gray-500">
							Click the copy button to grab all user details (Name, Email, Password) to send to
							them.
						</p>
					</div>
				{/if}

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
						{editingUser ? 'Update User' : 'Create User'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
