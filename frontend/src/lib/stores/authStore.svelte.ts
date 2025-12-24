// Auth store for managing user authentication state
const API_URL = 'http://localhost:5000/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Pharmacist' | 'Staff';
    branchId?: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

// Create reactive state
let user = $state<User | null>(null);
let token = $state<string | null>(null);
let isLoading = $state(false);
let error = $state<string | null>(null);

// Initialize from localStorage
if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('kipharma_token');
    const storedUser = localStorage.getItem('kipharma_user');
    if (storedToken && storedUser) {
        token = storedToken;
        try {
            user = JSON.parse(storedUser);
        } catch (e) {
            localStorage.removeItem('kipharma_user');
        }
    }
}

// Login function
async function login(accessCode: string, email: string, password: string): Promise<{ success: boolean; redirectTo: string }> {
    isLoading = true;
    error = null;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ accessCode, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store in state
        user = data.user;
        token = data.token;

        // Persist to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('kipharma_token', data.token);
            localStorage.setItem('kipharma_user', JSON.stringify(data.user));
        }

        isLoading = false;

        // Return redirect path based on role
        const redirectTo = data.user.role === 'Admin' ? '/admin' : '/manager';
        return { success: true, redirectTo };

    } catch (err: any) {
        error = err.message || 'Login failed';
        isLoading = false;
        return { success: false, redirectTo: '' };
    }
}

// Logout function
function logout() {
    user = null;
    token = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('kipharma_token');
        localStorage.removeItem('kipharma_user');
    }
    // Call logout endpoint
    fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    }).catch(() => { });
}

// Check if user is authenticated
function isAuthenticated(): boolean {
    return !!token && !!user;
}

// Check if user has specific role
function hasRole(roles: string | string[]): boolean {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
}

// Get auth header for API calls
function getAuthHeader(): { Authorization: string } | {} {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Export the store
export const authStore = {
    get user() { return user; },
    get token() { return token; },
    get isLoading() { return isLoading; },
    get error() { return error; },
    get isAuthenticated() { return isAuthenticated(); },
    get isAdmin() { return user?.role === 'Admin'; },
    get isManager() { return user?.role === 'Manager'; },
    login,
    logout,
    hasRole,
    getAuthHeader
};
