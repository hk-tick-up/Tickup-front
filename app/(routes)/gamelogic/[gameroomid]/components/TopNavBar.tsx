'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import React from 'react';
import styles from '../css/TopNavBar.module.css';

export default function TopNavBar() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const { gameroomid } = useParams(); // 동적 경로에서 gameroomid 가져오기

  // gameroomid가 없으면 에러 처리 (optional)
  // if (!gameroomid) {
  //   return <div>Invalid Game Room ID</div>;
  // }

  // 링크 정보 배열
  const links = [
    { href: `/gamelogic/${gameroomid}/myinvest`, label: '내 투자' },
    { href: `/gamelogic/${gameroomid}/stockinfo`, label: '시장' },
    { href: `/gamelogic/${gameroomid}/rank`, label: '랭킹' },
    { href: `/gamelogic/${gameroomid}/ticki`, label: '티키' },
  ];

  return (
    <nav className={styles.topNavBar}>
      <div className={styles.navContainer}>
        {links.map((link) => {
          // 현재 경로와 링크 비교
          const isActive = pathname === link.href; // 정확히 일치하는 경우에만 active
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
