<script lang="ts">
	import { adminStore } from '$lib/stores/adminStore.svelte';
	import type { Career } from '$lib/types';
	import { Plus, Search, Trash2, Edit, X, Briefcase, MapPin, Calendar } from 'lucide-svelte';

	let searchQuery = $state('');
	let showModal = $state(false);
	let editingCareer = $state<Career | null>(null);

	// Form state
	let formTitle = $state('');
	let formDepartment = $state('');
	let formLocation = $state('');
	let formType = $state<Career['type']>('Full-time');
	let formDescription = $state('');
	let formRequirements = $state('');
	let formSalary = $state('');
	let formStatus = $state<'Open' | 'Closed'>('Open');

	let filteredCareers = $derived(
		adminStore.careers.filter(
			(c) =>
				c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.location.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function openAddModal() {
		editingCareer = null;
		formTitle = '';
		formDepartment = '';
		formLocation = '';
		formType = 'Full-time';
		formDescription = '';
		formRequirements = '';
		formSalary = '';
		formStatus = 'Open';
		showModal = true;
	}

	function openEditModal(career: Career) {
		editingCareer = career;
		formTitle = career.title;
		formDepartment = career.department;
		formLocation = career.location;
		formType = career.type;
		formDescription = career.description;
		formRequirements = career.requirements;
		formSalary = career.salary;
		formStatus = career.status;
		showModal = true;
	}

	function handleSubmit() {
		if (editingCareer) {
			editingCareer.title = formTitle;
			editingCareer.department = formDepartment;
			editingCareer.location = formLocation;
			editingCareer.type = formType;
			editingCareer.description = formDescription;
			editingCareer.requirements = formRequirements;
			editingCareer.salary = formSalary;
			editingCareer.status = formStatus;
		} else {
			adminStore.addCareer({
				title: formTitle,
				department: formDepartment,
				location: formLocation,
				type: formType,
				description: formDescription,
				requirements: formRequirements,
				salary: formSalary,
				status: formStatus
			});
		}
		showModal = false;
	}

	function deleteCareer(id: string) {
		if (confirm('Are you sure you want to delete this job posting?')) {
			adminStore.deleteCareer(id);
		}
	}

	const typeColors: Record<Career['type'], string> = {
		'Full-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
		'Part-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		Contract: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
		Internship: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
	};
</script>

<svelte:head>
	<title>Careers | Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Careers Management</h1>
			<p class="text-slate-500">Manage job postings and recruitment</p>
		</div>
		<button
			onclick={openAddModal}
			class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-amber-500/25 transition-transform hover:scale-105"
		>
			<Plus class="h-5 w-5" />
			Post New Job
		</button>
	</div>

	<!-- Search -->
	<div class="relative">
		<Search class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search job postings..."
			class="w-full rounded-2xl border-0 bg-white py-3.5 pr-4 pl-12 text-slate-900 shadow-lg ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
		/>
	</div>

	<!-- Careers List -->
	<div class="space-y-4">
		{#each filteredCareers as career (career.id)}
			<div
				class="group overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200/50 transition-all hover:shadow-2xl dark:bg-slate-900 dark:ring-slate-800"
			>
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div class="flex-1">
						<div class="flex flex-wrap items-center gap-3">
							<h3 class="text-lg font-bold text-slate-900 dark:text-white">{career.title}</h3>
							<span
								class="rounded-full px-2.5 py-0.5 text-xs font-medium {typeColors[career.type]}"
							>
								{career.type}
							</span>
							<span
								class="rounded-full px-2.5 py-0.5 text-xs font-medium {career.status === 'Open'
									? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
									: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}"
							>
								{career.status}
							</span>
						</div>
						<div class="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
							<span class="flex items-center gap-1">
								<Briefcase class="h-4 w-4" />
								{career.department}
							</span>
							<span class="flex items-center gap-1">
								<MapPin class="h-4 w-4" />
								{career.location}
							</span>
							<span class="flex items-center gap-1">
								<Calendar class="h-4 w-4" />
								{career.postedDate.toLocaleDateString()}
							</span>
						</div>
						<p class="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
							{career.description}
						</p>
						<p class="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400">
							{career.salary}
						</p>
					</div>
					<div class="flex gap-2">
						<button
							onclick={() => openEditModal(career)}
							class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
						>
							<Edit class="h-4 w-4" />
						</button>
						<button
							onclick={() => deleteCareer(career.id)}
							class="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredCareers.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800"
		>
			<Briefcase class="h-16 w-16 text-slate-300 dark:text-slate-700" />
			<h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">No job postings found</h3>
			<p class="text-slate-500">Post your first job to attract talent</p>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
	>
		<div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-slate-900 dark:text-white">
					{editingCareer ? 'Edit Job Posting' : 'Post New Job'}
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
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title</label>
						<input
							type="text"
							bind:value={formTitle}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
						<input
							type="text"
							bind:value={formDepartment}
							required
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						/>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-3">
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
						<input
							type="text"
							bind:value={formLocation}
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
							<option value="Full-time">Full-time</option>
							<option value="Part-time">Part-time</option>
							<option value="Contract">Contract</option>
							<option value="Internship">Internship</option>
						</select>
					</div>
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
						<select
							bind:value={formStatus}
							class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
						>
							<option value="Open">Open</option>
							<option value="Closed">Closed</option>
						</select>
					</div>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Salary Range</label>
					<input
						type="text"
						bind:value={formSalary}
						placeholder="e.g. 500,000 - 800,000 RWF"
						class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
					/>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
					<textarea
						bind:value={formDescription}
						rows="3"
						required
						class="w-full rounded-lg border border-slate-200 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
					></textarea>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Requirements</label>
					<textarea
						bind:value={formRequirements}
						rows="3"
						required
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
						class="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 font-medium text-white shadow-lg"
					>
						{editingCareer ? 'Save Changes' : 'Post Job'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
