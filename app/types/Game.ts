export type UserStatus = '대기중' | '준비완료'

export interface User {
    id : number;
    nickName: string;
    status: UserStatus;
}

export type GameType = 'Basic' | 'Contest'

export interface WaitingRoom {
    id: string;
    gameType: GameType;
    isPublic: boolean;
    users: User[];
}
