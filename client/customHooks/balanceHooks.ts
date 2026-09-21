import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface TotalBalance {
    userId : string,
    amount : number
}

export const useBalanceHook = () => {
    return useQuery({
        queryKey: ['balance'],

        queryFn: async () => {
            const res = await api.get('/balance');
            return res.data as TotalBalance;
        },

        refetchOnWindowFocus: false,
    });
}

