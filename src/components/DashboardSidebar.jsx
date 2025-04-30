import React from 'react';
import Image from 'next/image';
import useAuthStore from '../stores/authStore';

const DashboardSidebar = ({
    userData,
    sidebarOpen,
    toggleSidebar,
    mobileMenuOpen,
    handleLogout,
    navigateToHome,
    navigateToAlQuran,
    navigateToPresensi,
    navigateToTugas,
    navigateToProfile,
    navigateToMY,
    navigateToScan,
    navigateToECard,
    navigateToPeserta
}) => {
    const { role } = useAuthStore();

    // Fungsi untuk mendapatkan menu items yang dinamis berdasarkan role
    const getMenuItems = () => {
        const baseItems = [
            {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                ),
                label: "Profile",
                onClick: navigateToProfile
            },
            {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                ),
                label: "Mutaba'ah Yaumiyah",
                onClick: navigateToMY
            },
            {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                ),
                label: "Al-Quran",
                onClick: navigateToAlQuran
            },
            {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
                label: "Presensi",
                onClick: navigateToPresensi
            },
            {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                ),
                label: "Tugas",
                onClick: navigateToTugas
            }
        ];

        // Tambahkan item khusus berdasarkan role
        const roleSpecificItems = [];

        if (role === '2a') {
            roleSpecificItems.push({
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                ),
                label: "Scan QR",
                onClick: navigateToScan
            });
        }

        // Tambahkan item untuk spesifik role lainnya
        if (role === '1a') {
            roleSpecificItems.push({
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                ),
                label: "E-Card",
                onClick: navigateToECard
            });
        }

        if (role === '0a') {
            roleSpecificItems.push({
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ),
                label: "Peserta",
                onClick: navigateToPeserta
            });
        }

        return [...baseItems, ...roleSpecificItems];
    };

    // Dapatkan menu items yang sesuai dengan role
    const menuItems = getMenuItems();

    return (
        <aside
            className={`fixed md:relative top-0 left-0 h-full 
                ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
                bg-white md:bg-blue-900 
                text-gray-800 md:text-white 
                shadow-xl z-50 
                transition-all duration-300 ease-in-out 
                overflow-hidden`}
        >
            {/* Mobile close button */}
            {sidebarOpen && (
                <div className="md:hidden absolute top-2 right-2 z-50">
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-700 hover:bg-gray-100 rounded-full p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Sidebar Header dengan Toggle */}
            <div className="flex items-center justify-end p-4 border-b border-gray-200 md:border-blue-800">
                {/* Hamburger Menu Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="text-gray-700 md:text-white hover:bg-gray-100 md:hover:bg-blue-800 rounded-full p-2 transition-colors duration-300 hidden md:block"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Logo Section - Hanya terlihat saat sidebar terbuka */}
            {sidebarOpen && (
                <div className="flex items-center justify-center p-4 border-b border-gray-200 md:border-blue-800">
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/img/logossg_white.png"
                            alt="Logo Santri Siap Guna"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <span className="text-lg font-bold text-gray-800 md:text-white truncate">SANTRI SIAP GUNA</span>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="py-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => {
                                    item.onClick();
                                    if (window.innerWidth < 768) {
                                        toggleSidebar();
                                    }
                                }}
                                className={`flex items-center w-full 
                                    ${sidebarOpen ? 'p-3 px-4 justify-start' : 'p-3 justify-center'} 
                                    hover:bg-gray-100 md:hover:bg-blue-800 
                                    text-gray-800 md:text-white 
                                    transition-colors duration-300 group`}
                                title={!sidebarOpen ? item.label : ""}
                            >
                                <span className={`${sidebarOpen ? 'mr-3' : ''}`}>{item.icon}</span>
                                {sidebarOpen && (
                                    <span className="text-sm truncate">{item.label}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Section */}
            <div className="border-t border-gray-200 md:border-blue-800">
                <button
                    onClick={handleLogout}
                    className={`flex items-center w-full 
                        ${sidebarOpen ? 'p-3 px-4 justify-start' : 'p-3 justify-center'} 
                        text-gray-800 md:text-white 
                        transition-colors duration-300 
                        hover:bg-gray-100 md:hover:bg-blue-800`}
                    title={!sidebarOpen ? "Logout" : ""}
                >
                    <span className={`${sidebarOpen ? 'mr-3' : ''}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </span>
                    {sidebarOpen && <span className="text-sm truncate">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;