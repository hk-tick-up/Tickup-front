// app/components/BottomNav.tsx

'use client';

import '@/app/css/components/bottom-nav.css';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Gamepad2, Home, Users, User } from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
    return pathname === path;
    };

    return (
        <nav className="fixed nav-main">
            <div className="nav-standardization">
                <Link href="/study" className="flex flex-col items-center">
                    <Book 
                    className={`icon-custom ${isActive('/study') ? 'custom-blue' : 'text-gray-500'}`} 
                    />
                    <span className={`icon-title-custom ${isActive('/study') ? 'custom-blue' : 'text-gray-500'}`}>
                    금융 학습
                    </span>
                </Link>

                <Link href="/game" className="flex flex-col items-center">
                    <Gamepad2 
                        className={`icon-custom ${isActive('/game') ? 'custom-blue' : 'text-gray-500'}`} 
                    />
                    <span className={`icon-title-custom ${isActive('/game') ? 'custom-blue' : 'text-gray-500'}`}>
                    투자 게임
                    </span>
                </Link>

                <Link href="/" className="flex flex-col items-center">
                    <Home 
                        className={`icon-custom ${isActive('/') ? 'custom-blue' : 'text-gray-500'}`} 
                    />
                    <span className={`icon-title-custom ${isActive('/') ? 'custom-blue' : 'text-gray-500'}`}>
                        Home
                    </span>
                </Link>

                <Link href="/community" className="flex flex-col items-center">
                    <Users 
                        className={`icon-custom ${isActive('/community') ? 'custom-blue' : 'text-gray-500'}`} 
                    />    
                    <span className={`icon-title-custom ${isActive('/community') ? 'custom-blue' : 'text-gray-500'}`}>
                        커뮤니티
                    </span>
                </Link>

                <Link href="/my" className="flex flex-col items-center">
                    <User 
                        className={`icon-custom ${isActive('/my') ? 'custom-blue' : 'text-gray-500'}`} 
                    />
                    <span className={`icon-title-custom ${isActive('/my') ? 'custom-blue' : 'text-gray-500'}`}>
                        My
                    </span>
                </Link>
            </div>
        </nav>
    );
}

export default BottomNav;