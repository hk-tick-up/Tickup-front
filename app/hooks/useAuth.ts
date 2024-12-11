import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('bearer');
        if(!token) {
            router.push('/signin');
        }
    }, []);

    return {
        isAuthenticated : !!localStorage.getItem('bearer'),
        token : localStorage.getItem('bearer'),
        userId : localStorage.getItem('id'),
        nickname : localStorage.getItem('nickname')
    };
}
