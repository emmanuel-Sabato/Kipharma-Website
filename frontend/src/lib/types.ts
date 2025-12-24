export interface Branch {
    id: string;
    name: string;
    location: string;
    manager: string;
    status: 'Active' | 'Inactive';
    contact: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Pharmacist' | 'Staff';
    branchId: string; // references Branch.id
    status: 'Active' | 'Inactive';
    phone: string;
    avatar?: string;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    branchId: string;
    image: string;
}

export interface Notification {
    id: string;
    type: 'low_stock' | 'general';
    productId: string;
    productName: string;
    branchId: string;
    branchName: string;
    managerName: string;
    currentStock: number;
    message: string;
    createdAt: Date;
    read: boolean;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    image: string;
    bio: string;
    status: 'Active' | 'Inactive';
}

export interface Partner {
    id: string;
    name: string;
    type: 'Supplier' | 'Distributor' | 'Healthcare' | 'Technology' | 'Other';
    logo: string;
    website: string;
    contactPerson: string;
    email: string;
    phone: string;
    status: 'Active' | 'Inactive';
}

export interface Career {
    id: string;
    title: string;
    department: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    description: string;
    requirements: string;
    salary: string;
    postedDate: Date;
    status: 'Open' | 'Closed';
}
