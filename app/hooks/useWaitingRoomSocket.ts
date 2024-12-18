import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { ParticipantsInfo } from '@/app/types/Game';

export function useWaitingRoomSocket(waitingRoomId: string, initialUser: ParticipantsInfo) {
    const [users, setUsers] = useState<ParticipantsInfo[]>([]);
    const [currentUser, setCurrentUser] = useState<ParticipantsInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);
    const { stompClient, setStompClient, isConnected, error } = useWebSocket(waitingRoomId);

    const handleMessageReceived = useCallback((data: ParticipantsInfo[]) => {
        if (!data) return;
        const updatedUsers = data.map(user => ({
        ...user,
        status: user.userStatus || '대기중'
        }));
        setUsers(updatedUsers.sort((a, b) => a.orderNum - b.orderNum));
        setIsLoading(false);
        const currentUserInfo = updatedUsers.find(u => u.userId === currentUser?.userId);
        if (currentUserInfo) {
        setCurrentUser(prev => ({
            ...prev!,
            userStatus: currentUserInfo.userStatus
        }));
        }
    }, [currentUser]);

    useEffect(() => {
        if (!stompClient || !isConnected) return;

        const setupConnection = async () => {
        try {
            subscriptionIds.forEach(id => {
            if (stompClient.active) {
                stompClient.unsubscribe(id);
            }
            });
            setSubscriptionIds([]);

            const subscription = stompClient.subscribe(
            `/topic/waiting-room/${waitingRoomId}`,
            (message) => {
                const participantsList: ParticipantsInfo[] = JSON.parse(message.body);
                handleMessageReceived(participantsList);
            }
            );
            setSubscriptionIds([subscription.id]);

            await new Promise(resolve => setTimeout(resolve, 10));

            stompClient.publish({
            destination: `/app/waiting-room/${waitingRoomId}`,
            body: JSON.stringify(initialUser)
            });

            setIsLoading(false);
        } catch (error) {
            console.log('연결 설정 중 오류가 발생했습니다:', error);
            setIsLoading(false);
        }
        };

        setupConnection();

        return () => {
        if (stompClient?.active) {
            subscriptionIds.forEach(id => {
            try {
                stompClient.unsubscribe(id);
            } catch (error) {
                console.error('Error unsubscribing:', error);
            }
            });
            setSubscriptionIds([]);
        }
        };
    }, [stompClient, isConnected, waitingRoomId, initialUser, handleMessageReceived]);

    return { users, setUsers, currentUser, setCurrentUser, isLoading, stompClient };
}

