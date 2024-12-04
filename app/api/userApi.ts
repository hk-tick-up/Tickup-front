import axious from '../utils/axios';

export const userApi = {
    getPoint: async() => {
        try {
            const response = await axious.get("/users/point");
            return response.data;
        } catch(error) {
            console.error("포인트 조회 실패", error);
            throw error;
        }
    },
};