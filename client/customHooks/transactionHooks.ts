import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface Transactions {
    id: string,
    userId: string,
    pocketId: string,
    pocketName: string,
    amount: number,
    deductPocket: number,
    deductMain: number,
    type: string,
    note: string,
    createdAt: string
}

interface AddNewTransactionPayload {
    userId: string,
    pocketId: string,
    amount: number,
    type: string,
    note?: string,
}

export const useTransactionsHook = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await api.get('/transactions');
            return (res.data.data || res.data) as Transactions[];
        },
        refetchOnWindowFocus: false,
    })
}

export const useAddNewTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTransactionData: AddNewTransactionPayload) => {
            const res = await api.post('/transactions/add', newTransactionData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['pockets'] });
            queryClient.invalidateQueries({ queryKey: ['balance'] });
        },
    });
}

export const useEditNewTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, transactionId, newNote, newPocketId, newAmount }: {
            userId: string;
            transactionId: string;
            newNote?: string;
            newPocketId?: string | null;
            newAmount?: number;
        }) => {
            const res = await api.put(`/transactions/${transactionId}`, { userId, newNote, newPocketId, newAmount, });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['pockets'] });
            queryClient.invalidateQueries({ queryKey: ['balance'] });
        },
    });
}