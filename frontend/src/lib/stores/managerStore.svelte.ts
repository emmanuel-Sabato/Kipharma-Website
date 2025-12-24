import { adminStore } from './adminStore.svelte';
import type { User, Product } from '$lib/types';

// Mock Manager Data (assuming logged in as Dr. Alex Doe from Kigali Main HQ)
const MOCK_MANAGER: User = {
    id: '1',
    name: 'Dr. Alex Doe',
    email: 'alex@kipharma.com',
    role: 'Manager',
    branchId: '1',
    status: 'Active',
    phone: '+250 700 000 001'
};

export class ManagerStore {
    currentManager = $state<User>(MOCK_MANAGER);

    // Derived state for products in this manager's branch
    myProducts = $derived(
        adminStore.products.filter(p => p.branchId === this.currentManager.branchId)
    );

    // Derived state for low stock items (threshold < 50 for demo)
    lowStockItems = $derived(
        this.myProducts.filter(p => p.stock < 50)
    );

    updateStock(productId: string, quantity: number, type: 'in' | 'out') {
        const product = adminStore.products.find(p => p.id === productId);
        if (product) {
            if (type === 'in') {
                product.stock += quantity;
            } else {
                if (product.stock >= quantity) {
                    product.stock -= quantity;
                } else {
                    console.error('Insufficient stock');
                    return false;
                }
            }
            // Update status based on new stock
            if (product.stock === 0) product.status = 'Out of Stock';
            else if (product.stock < 50) product.status = 'Low Stock';
            else product.status = 'In Stock';

            return true;
        }
        return false;
    }

    notifyAdmin(productId: string) {
        const product = adminStore.products.find(p => p.id === productId);
        const branch = adminStore.branches.find(b => b.id === this.currentManager.branchId);

        if (product && branch) {
            adminStore.addNotification({
                type: 'low_stock',
                productId: product.id,
                productName: product.name,
                branchId: branch.id,
                branchName: branch.name,
                managerName: this.currentManager.name,
                currentStock: product.stock,
                message: `Low stock alert: "${product.name}" has only ${product.stock} units remaining at ${branch.name}.`
            });
            return true;
        }
        return false;
    }
}

export const managerStore = new ManagerStore();
