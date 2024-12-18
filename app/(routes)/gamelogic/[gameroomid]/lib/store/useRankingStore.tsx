import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RankingResponse {
    userId: string;
    userName: string;
    rank: number;
    returnRate: number;
    profileImage: string;
}

interface RankingStore {
    rankingsByGameRoom: Record<string, RankingResponse[]>; // gameRoomId별 랭킹 데이터 저장
    setRankings: (gameRoomId: string, data: RankingResponse[]) => void;
    getRankings: (gameRoomId: string) => RankingResponse[]; // 특정 gameRoomId 랭킹 가져오기
}

export const useRankingStore = create(
    persist<RankingStore>(
        (set, get) => ({
            rankingsByGameRoom: {}, // 초기 상태
            
            // 특정 gameRoomId의 랭킹 데이터를 설정
            setRankings: (gameRoomId, data) =>
                set((state) => ({
                    rankingsByGameRoom: {
                        ...state.rankingsByGameRoom,
                        [gameRoomId]: data,
                    },
                })),

            // 특정 gameRoomId의 랭킹 데이터를 가져오기
            getRankings: (gameRoomId) => get().rankingsByGameRoom[gameRoomId] || [],
        }),
        {
            name: 'ranking-storage', // 로컬 스토리지에 저장될 키
        }
    )
);

// export default useRankingStore;