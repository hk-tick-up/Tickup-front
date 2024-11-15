'use client'

import Link from 'next/link'
import React from 'react'
import styles from '../css/TopNavBar.module.css'

export default function TopNavBar() {
  return (
    <nav className={styles.topNavBar}>
      <div className={styles.navContainer}>
        <Link 
          href="/gamelogic/myinvest"
          className={`${styles.navLink} ${styles.navLinkActive}`}
        >
          내 투자
        </Link>
        <Link 
          href="/gamelogic/stockinfo"
          className={styles.navLink}
        >
          시장
        </Link>
        <Link 
          href="/gamelogic/ranking"
          className={styles.navLink}
        >
          랭킹
        </Link>
        <Link 
          href="/gamelogic/ticki"
          className={styles.navLink}
        >
          티키
        </Link>
      </div>
    </nav>
  )
}