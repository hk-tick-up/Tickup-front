'use client';

import RankingList from './RankingList';
import styles from '../css/RankingPage.module.css';
import { useEffect } from 'react';
import { useRankingStore } from '../lib/store/useRankingStore';
import { usePathname } from 'next/navigation';

export default function RankingPage() {
    const { getRankings, setRankings } = useRankingStore();
    const pathname = usePathname();
    const gameRoomId = pathname.split('/')[2]; // 경로에서 gameRoomId 추출

    const rankings = getRankings(gameRoomId); // 현재 gameRoomId에 해당하는 랭킹 데이터 가져오기

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const BASE_URL = 'http://localhost:8080';
                const token = sessionStorage.getItem('jwtToken');
                const response = await fetch(`${BASE_URL}/api/v1/gamelogic/${gameRoomId}/rankings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch rankings');
                const data = await response.json();
                setRankings(gameRoomId, data); // gameRoomId에 맞는 데이터 저장
            } catch (error) {
                console.error('Error fetching rankings:', error);
            }
        };

        fetchRankings();
    }, [gameRoomId, setRankings]);

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
