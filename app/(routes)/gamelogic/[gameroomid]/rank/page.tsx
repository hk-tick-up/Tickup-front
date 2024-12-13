'use client';

import RankingList from './RankingList';
import styles from '../css/RankingPage.module.css'; // module.css 스타일 가져오기
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';
import { usePathname } from 'next/navigation';
import { useRankingStore } from '../lib/store/useRankingStore';

// 더미 데이터 타입 정의
// type PortfolioItem = {
//   category: string;
//   amount: number;
//   percentage: number;
// };

// type UserRanking = {
//   id: number;
//   rank: number;
//   username: string;
//   profileImage: string;
//   totalAmount: number;
//   portfolio: PortfolioItem[];
//   trend: 'up' | 'down' | 'neutral';
// };

// // 더미 데이터
// const dummyRankings: UserRanking[] = [
//   {
//     id: 1,
//     rank: 1,
//     username: '경쾌한 콜리',
//     profileImage: '/placeholder.svg?height=40&width=40',
//     totalAmount: 1890000,
//     portfolio: [
//       { category: 'A IT', amount: 3526000, percentage: 20 },
//       { category: 'B 레버', amount: 980000, percentage: 10 },
//       { category: 'C 제약', amount: 1339000, percentage: 25 },
//       { category: 'D 유통', amount: 220443, percentage: -10 },
//     ],
//     trend: 'up',
//   },
//   {
//     id: 2,
//     rank: 2,
//     username: '깜찍한 강아지',
//     profileImage: '/placeholder.svg?height=40&width=40',
//     totalAmount: 1890000,
//     portfolio: [],
//     trend: 'down',
//   },
//   {
//     id: 3,
//     rank: 3,
//     username: '섬세한 허브',
//     profileImage: '/placeholder.svg?height=40&width=40',
//     totalAmount: 1890000,
//     portfolio: [],
//     trend: 'up',
//   },
//   {
//     id: 4,
//     rank: 4,
//     username: '깜찍한 강아지',
//     profileImage: '/placeholder.svg?height=40&width=40',
//     totalAmount: 1890000,
//     portfolio: [],
//     trend: 'neutral',
//   },
//   {
//     id: 5,
//     rank: 5,
//     username: '특별한 브런치',
//     profileImage: '/placeholder.svg?height=40&width=40',
//     totalAmount: 1890000,
//     portfolio: [],
//     trend: 'down',
//   },
// ];

export default function RankingPage() {
  const { rankings } = useRankingStore();

  return (
      <div className={styles.container}>
          <div className={styles.content}>
              <div className={styles.participantText}>총 {rankings.length}명 참여 중</div>
              <h1 className={styles.title}>누적 순위</h1>
              <RankingList rankings={rankings} />
          </div>
      </div>
  );
}