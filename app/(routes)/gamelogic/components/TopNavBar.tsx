import Link from 'next/link';
import React from 'react';
import '../css/TopNavBar.css'

const TopNavBar = () => {
  return (
    <nav className="top-nav-bar">
      <div className="nav-container">
        <NavLink href="/gamelogic/myinvest" active>내 투자</NavLink>
        <NavLink href="/gamelogic/market">주식</NavLink>
        <NavLink href="/gamelogic/ranking">랭킹</NavLink>
        <NavLink href="/gamelogic/ticki">티키(챗봇)</NavLink>
      </div>
    </nav>
  );
};

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

const NavLink = ({ href, children, active = false }: NavLinkProps) => {
  return (
    <Link href={href} passHref>
      <div className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}>
        {children}
      </div>
    </Link>
  );
};

export default TopNavBar;