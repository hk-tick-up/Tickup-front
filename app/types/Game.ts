export interface ParticipantsInfo {
    orderNum: number;
    userId: string;
    nickname: string;
    gameType: 'Basic' | 'Private' | 'Contest';
    currentRoomId: number;
    userStatus : UserStatus;
}

export type UserStatus = '대기중' | '준비완료';

export const createInitialUser = (
    userId: string,
    nickname: string,
    gameRoomId: string,
    gameType: 'Basic' | 'Private' | 'Contest' = 'Basic'
): ParticipantsInfo => ({
    orderNum: 1,
    userId,
    nickname,
    gameType,
    currentRoomId: parseInt(gameRoomId),
    userStatus: '대기중'
});