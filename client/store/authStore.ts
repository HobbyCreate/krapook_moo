import { create } from 'zustand';
import api from '@/lib/axios';

interface UserData {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}

interface AuthState {
    user: UserData | null;      
    loading: boolean;           
    fetchUser: () => Promise<void>; 
    logout: () => void;         
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    
    fetchUser: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/auth/getme');
            set({ user: res.data.user, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },

    logout: () => {
        set({ user: null });
    }
}));