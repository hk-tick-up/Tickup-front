export interface ParticipantsInfo {
    orderNum: number;
    userId: string;
    nickname: string;
    gameType: 'Basic' | 'Private' | 'Contest';
    waitingRoomId: number;
    userStatus: UserStatus;
}

export type UserStatus = '대기중' | '준비완료';

export interface InitGameRoom {
    gameRoomsId: number;
    totalTurns: number;
    currentTurn: number;
    currentEndTime: string;
}

export interface GameStartRequest {
    gameRoomId: string;
    participants: ParticipantsInfo[];
}

export interface GameStartMessage {
    type: 'START_GAME';
    gameRoomId: string;
    gameRoomsId: number;
}

export const createInitialUser = (
    userId: string,
    nickname: string,
    waitingRoomId: string,
    gameType: 'Basic' | 'Private' | 'Contest' = 'Basic'
): ParticipantsInfo => ({
    orderNum: 1,
    userId,
    nickname,
    gameType,
    waitingRoomId: parseInt(waitingRoomId),
    userStatus: '대기중'
});