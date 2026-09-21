import Link from 'next/link';

export interface MenuItemType {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    path?: string; // เปลี่ยนเป็น optional เพราะปุ่ม Logout ไม่มี path
    onClick?: () => void | Promise<void>;
}

export interface MenuProps {
    menu: MenuItemType[];
    isOpen: boolean;
}

export const DesktopMenu = ({ menu, isOpen }: MenuProps) => {
    return (
        <div className='flex flex-col gap-3'>
            {menu.map((item, index) => {
                const Icon = item.icon;
                
                if (item.onClick && item.name === 'Expand') {
                    return (
                        <button key={index} onClick={item.onClick}
                            className={`relative flex group items-center pl-3 w-12 h-12 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors cursor-pointer text-left`}
                        >
                            <Icon className="transition-all duration-300 ease-in" />
                            {isOpen ? (
                                <></>
                            ) : (
                                <div className="absolute right-full mr-3 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    );
                } else if (item.onClick) {
                    return (
                        <button key={index} onClick={item.onClick}
                            className={`relative flex group items-center pl-3 h-12 w-full bg-white rounded-lg shadow hover:bg-gray-100 transition-colors cursor-pointer`}
                        >
                            <Icon className="" />
                            {isOpen ? (
                                <span className="capitalize font-medium ml-3 truncate">{item.name}</span>
                            ) : (
                                <div className="absolute right-full mr-3 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    );
                }

                return (
                    <Link href={item.path || '#'} key={index} className="w-full">
                        <button 
                            className="relative group flex items-center pl-3 h-12 w-full bg-white rounded-lg shadow hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <Icon className="mr-3" />
                            {isOpen ? (
                                <span className="capitalize font-medium ml-3 truncate">{item.name}</span>
                            ) : (
                                <div className="absolute right-full mr-3 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    </Link>
                );
            })}
        </div>
    );
};