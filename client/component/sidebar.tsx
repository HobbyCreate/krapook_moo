import { DesktopMenu } from "./desktopmenu";
import { LayoutDashboard, Wallet, ArrowLeftRight , Settings, LogOut, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useSidebarStore } from '@/store/sidebarStore';

export const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);

    const isOpen = useSidebarStore((state) => state.isOpen);
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menus = [
        { name: 'Expand', icon: isOpen ? PanelLeftOpen : PanelRightOpen, onClick: toggleSidebar },
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Pocket', icon: Wallet, path: '/dashboard/pockets' },
        { name: 'Transactions', icon: ArrowLeftRight , path: '/dashboard/transactions' },
        // { name: 'Setting', icon: Settings, path: '/dashboard/settings' },
        { name: 'Logout', icon: LogOut, onClick: handleLogout },
    ];

    return (
        <div
            className={`fixed top-2/5 -translate-y-1/2 right-5 bg-[var(--color-sage-dark)]/90 slidebar z-50 py-6 rounded-xl opacity-15 hover:opacity-100 
                transition-all duration-300  ${isOpen ? 'w-[230px] px-3' : 'w-[70px] px-3' } `} >
            <DesktopMenu
                menu={menus}
                isOpen={isOpen}
            />
        </div>
    );
};