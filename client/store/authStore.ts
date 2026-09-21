import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

interface UserData {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}

interface AuthState {
    user: UserData | null;
    token: string | null;       
    loading: boolean;
    setLoginData: (user: UserData, token: string) => void; // 
    fetchUser: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: true,

            setLoginData: (user, token) => {
                set({ user, token, loading: false });
            },

            fetchUser: async () => {
                set({ loading: true });
                try {
                    const res = await api.get('/auth/getme');
                    set({ user: res.data.user, loading: false });
                } catch {
                    set({ user: null, token: null, loading: false });
                }
            },

            logout: () => {
                set({ user: null, token: null });
            }
        }),
        {
            name: 'auth-storage', 
            partialize: (state) => ({ token: state.token, user: state.user }), 
        }
    )
);