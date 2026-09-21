import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface AddPocketPayload {
    userId: string;
    name: string;
    limit: number;
    initialLimit: number;
    icon: string;
    isActive: boolean;
}

export interface Pockets {
    id: string;
    userId?: string;
    name: string;
    initialLimit: number;
    limit: number;
    icon: string;
    isActive: boolean;
}

interface EditPocketNamePayload {
    id: string;
    name: string;
}

interface EditPocketLimitPayload {
    id: string;
    newLimit: number;
    userId?: string;
    oldLimit: number;
}

interface DeletePocketPayload {
    id: string;
    userId?: string;
}

export const useAddPocket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newPocketData: AddPocketPayload) => {
            const res = await api.post('/pocket/add', newPocketData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pockets'] });
            queryClient.invalidateQueries({ queryKey: ['balance'] });
        },
    });
};

export const useEditPocketName = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, name }: EditPocketNamePayload) => {
            const res = await api.put(`/pocket/${id}/name`, { name });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pockets'] });
        },
    });
};

export const useEditPocketLimit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, newLimit, userId, oldLimit }: EditPocketLimitPayload) => {
            const res = await api.put(`/pocket/${id}/limit`, { newLimit, userId, oldLimit });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pockets'] });
            queryClient.invalidateQueries({ queryKey: ['balance'] }); 
        },
    });
};

export const useDeletePocket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, userId }: DeletePocketPayload) => {
            const res = await api.delete(`/pocket/${id}`, { data: { userId } })
            return res.data;
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({ queryKey: ['pockets'] });
            queryClient.invalidateQueries({ queryKey: ['balance'] }); 
            queryClient.invalidateQueries({ queryKey: ['transactions'] }); 
        }
    })
}

export const usePocketHook = () => {
    return useQuery({
        queryKey: ['pockets'],
        queryFn: async () => {
            const res = await api.get('/pocket');
            return res.data as Pockets[];
        },
        refetchOnWindowFocus: false,
    });
};