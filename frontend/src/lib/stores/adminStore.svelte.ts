import type { Branch, User, Product, Notification, TeamMember, Partner, Career } from '$lib/types';

// Initial Mock Data
const initialBranches: Branch[] = [
    {
        id: '1',
        name: 'Kigali Main HQ',
        location: 'Kigali, Nyarugenge',
        manager: 'Dr. Alex Doe',
        status: 'Active',
        contact: '+250 788 000 001'
    },
    {
        id: '2',
        name: 'Musanze Branch',
        location: 'Musanze, Town Center',
        manager: 'Sarah Smith',
        status: 'Active',
        contact: '+250 788 000 002'
    },
    {
        id: '3',
        name: 'Huye Outlet',
        location: 'Huye, Near University',
        manager: 'Jean Paul',
        status: 'Inactive',
        contact: '+250 788 000 003'
    }
];

const initialUsers: User[] = [
    {
        id: '1',
        name: 'Dr. Alex Doe',
        email: 'alex@kipharma.com',
        role: 'Manager',
        branchId: '1',
        status: 'Active',
        phone: '+250 700 000 001'
    },
    {
        id: '2',
        name: 'John Admin',
        email: 'admin@kipharma.com',
        role: 'Admin',
        branchId: '1',
        status: 'Active',
        phone: '+250 700 000 000'
    }
];

const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Paracetamol 500mg',
        category: 'Medicine',
        price: 500,
        stock: 1200,
        status: 'In Stock',
        branchId: '1',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: '2',
        name: 'Vitamin C Serum',
        category: 'Skincare',
        price: 15000,
        stock: 45,
        status: 'Low Stock',
        branchId: '1',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200'
    }
];

const initialTeamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Dr. Marie Claire',
        role: 'Chief Pharmacist',
        department: 'Pharmacy',
        email: 'marie@kipharma.com',
        phone: '+250 788 111 001',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
        bio: 'Over 15 years of experience in pharmaceutical sciences.',
        status: 'Active'
    },
    {
        id: '2',
        name: 'Jean Baptiste',
        role: 'Operations Manager',
        department: 'Operations',
        email: 'jean@kipharma.com',
        phone: '+250 788 111 002',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
        bio: 'Expert in supply chain and logistics management.',
        status: 'Active'
    }
];

const initialPartners: Partner[] = [
    {
        id: '1',
        name: 'Rwanda Medical Supplies',
        type: 'Supplier',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
        website: 'https://rwandamed.rw',
        contactPerson: 'Alice Uwimana',
        email: 'contact@rwandamed.rw',
        phone: '+250 788 222 001',
        status: 'Active'
    },
    {
        id: '2',
        name: 'HealthCare International',
        type: 'Healthcare',
        logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
        website: 'https://hci.org',
        contactPerson: 'Dr. Peter Nkurunziza',
        email: 'info@hci.org',
        phone: '+250 788 222 002',
        status: 'Active'
    }
];

const initialCareers: Career[] = [
    {
        id: '1',
        title: 'Pharmacist',
        department: 'Pharmacy',
        location: 'Kigali',
        type: 'Full-time',
        description: 'We are looking for a licensed pharmacist to join our team.',
        requirements: 'Bachelor in Pharmacy, 2+ years experience, valid license',
        salary: '500,000 - 800,000 RWF',
        postedDate: new Date('2024-12-01'),
        status: 'Open'
    },
    {
        id: '2',
        title: 'Sales Representative',
        department: 'Sales',
        location: 'Musanze',
        type: 'Full-time',
        description: 'Looking for an energetic sales rep to grow our customer base.',
        requirements: 'Bachelor degree, excellent communication skills',
        salary: '300,000 - 500,000 RWF',
        postedDate: new Date('2024-12-10'),
        status: 'Open'
    }
];

// Svelte 5 Rune-based Store
export class AdminStore {
    branches = $state<Branch[]>(initialBranches);
    users = $state<User[]>(initialUsers);
    products = $state<Product[]>(initialProducts);
    notifications = $state<Notification[]>([]);
    teamMembers = $state<TeamMember[]>(initialTeamMembers);
    partners = $state<Partner[]>(initialPartners);
    careers = $state<Career[]>(initialCareers);

    // Derived: unread notification count
    unreadCount = $derived(this.notifications.filter(n => !n.read).length);

    // Branch Actions
    addBranch(branch: Omit<Branch, 'id'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.branches.push({ ...branch, id });
    }

    deleteBranch(id: string) {
        this.branches = this.branches.filter((b) => b.id !== id);
    }

    // User Actions
    addUser(user: Omit<User, 'id'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.users.push({ ...user, id });
    }

    deleteUser(id: string) {
        this.users = this.users.filter((u) => u.id !== id);
    }

    // Product Actions
    addProduct(product: Omit<Product, 'id'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.products.push({ ...product, id });
    }

    deleteProduct(id: string) {
        this.products = this.products.filter((p) => p.id !== id);
    }

    // Notification Actions
    addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.notifications.unshift({
            ...notification,
            id,
            createdAt: new Date(),
            read: false
        });
    }

    markAsRead(id: string) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
    }

    deleteNotification(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    // Team Member Actions
    addTeamMember(member: Omit<TeamMember, 'id'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.teamMembers.push({ ...member, id });
    }

    deleteTeamMember(id: string) {
        this.teamMembers = this.teamMembers.filter(m => m.id !== id);
    }

    // Partner Actions
    addPartner(partner: Omit<Partner, 'id'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.partners.push({ ...partner, id });
    }

    deletePartner(id: string) {
        this.partners = this.partners.filter(p => p.id !== id);
    }

    // Career Actions
    addCareer(career: Omit<Career, 'id' | 'postedDate'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.careers.push({ ...career, id, postedDate: new Date() });
    }

    deleteCareer(id: string) {
        this.careers = this.careers.filter(c => c.id !== id);
    }
}

export const adminStore = new AdminStore();
