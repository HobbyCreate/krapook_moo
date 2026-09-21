import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeState {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const useDarkModeStore = create<DarkModeState>()(
    persist(
        (set) => ({
            isDarkMode : true,
            toggleDarkMode: () => {set((state) => ({isDarkMode: !state.isDarkMode })) }
        }),
        {
            name: 'darkmode-state'
        }
    )
)