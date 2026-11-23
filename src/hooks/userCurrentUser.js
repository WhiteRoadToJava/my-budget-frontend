import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/userService';

export const useCurrentUser = () => 
    useQuery({
        queryKey: ['user'],
        queryFn: async () => (await getUser()).data,
    });