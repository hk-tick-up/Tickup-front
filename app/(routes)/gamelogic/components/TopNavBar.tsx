'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import styles from '../css/TopNavBar.module.css';

export default function TopNavBar() {
  const pathname = usePathname(); // 현재 경로 가져오기

  // 링크 정보 배열
  const links = [
    { href: '/gamelogic/myinvest', label: '내 투자' },
    { href: '/gamelogic/stockinfo', label: '시장' },
    { href: '/gamelogic/rank', label: '랭킹' },
    { href: '/gamelogic/ticki', label: '티키' },
  ];

  return (
    <nav className={styles.topNavBar}>
      <div className={styles.navContainer}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              pathname === link.href ? styles.navLinkActive : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
