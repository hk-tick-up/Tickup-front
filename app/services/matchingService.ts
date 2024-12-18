import * as StompJs from "@stomp/stompjs";

export async function matchUser(token: string, userId: string, nickname: string) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/waiting-room/random-join`;

    const requestBody = {
        GameType: "Basic",
        userRole: "User"
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": token.startsWith('Bearer ') ? token : `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.waitingRoomId) {
        throw new Error('방 정보를 받을 수 없습니다.');
    }

    sessionStorage.setItem('waitingRoomId', data.waitingRoomId.toString());
    sessionStorage.setItem('gameType', data.gameType);
    sessionStorage.setItem('shouldTriggerUserJoined', 'true');

    return data;
    }

    export function connectToWaitingRoom(token: string, waitingRoomId: number, userId: string, nickname: string) {
    const stompClient = new StompJs.Client({
        brokerURL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
        connectHeaders: {
        Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        console.log('STOMP 연결 성공:', frame);
        stompClient.subscribe(`/topic/waiting-room/${waitingRoomId}`, (message) => {
        console.log('메시지 수신:', message.body);
        });

        stompClient.publish({
        destination: `/app/waiting-room/${waitingRoomId}/join`,
        body: JSON.stringify({ userId, nickname })
        });
    };

    stompClient.activate();
    return stompClient;
}

