const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createRoom(token: string) {
    const url = `${API_BASE_URL}/api/v1/waiting-room/create-private`;
    const requestBody = {
    GameType: "Private",
    userRole: "User"
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": token.startsWith('Bearer ') ? token : `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = '/signin';
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        const errorText = await response.text();
        throw new Error(errorText || '방 생성에 실패했습니다.');
    }

    const data = await response.json();

    if (!data || !data.waitingRoomId) {
        throw new Error('방 생성에 에러가 발생했습니다. 다시 시도해주세요.');
    }

    return data;
}

export async function joinRoom(token: string, gameRoomCode: string) {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/waiting-room/join/${gameRoomCode}`, 
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error(`방을 찾을 수 없습니다. (${response.status})`);
    }

    const data = await response.json();

    if (!data || !data.waitingRoomId) {
        throw new Error("존재하지 않는 방입니다.");
    }

    return data;
}

