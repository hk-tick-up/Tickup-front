import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RankingResponse {
    userId: string;
    userName: string;
    rank: number;
    returnRate: number;
}

interface RankingStore {
    rankings: RankingResponse[];
    setRankings: (data: RankingResponse[]) => void;
}

export const useRankingStore = create(
    persist<RankingStore>(
        (set) => ({
            rankings: [],
            setRankings: (data) => set({ rankings: data })
        }),
        {
            name: 'ranking-storeage'
        }
    )
);

// export default useRankingStore;