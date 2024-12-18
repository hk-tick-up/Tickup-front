'use client';

import RankingList from './RankingList';
import styles from '../css/RankingPage.module.css';
import { useEffect } from 'react';
import { useRankingStore } from '../lib/store/useRankingStore';
import { usePathname } from 'next/navigation';
import { useWebSocket } from '../context/WebSocketContext';

export default function RankingPage() {
    const { getRankings, setRankings } = useRankingStore();
    const pathname = usePathname();
    const gameRoomId = pathname.split('/')[2]; // 경로에서 gameRoomId 추출

    const rankings = getRankings(gameRoomId); // 현재 gameRoomId에 해당하는 랭킹 데이터 가져오기

    const {subscribe, unsubscribe} = useWebSocket();


    useEffect(() => {
        const destination = `/topic/gameRoom/${gameRoomId}/rankings`;

        const onRankingUpdate = (message) => {
            try {
                const data = JSON.parse(message.body); // 메시지에서 데이터 파싱
                setRankings(gameRoomId, data); // 랭킹 정보 업데이트
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        // WebSocket 구독 설정
        subscribe(destination, onRankingUpdate);

        // Clean-up
        return () => {
            unsubscribe(destination); // WebSocket 구독 해제
        };
    }, [gameRoomId, subscribe, unsubscribe, setRankings]);

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
