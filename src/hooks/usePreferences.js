import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPreferences, updatePreferences } from "../api/preferencesService"


const NONE = {language: null, baseCurrency: null, firstDayOfWeek: null, defaultAccountId: null};

export const usePreferences = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ["preferences"],
        queryFn: getPreferences,
        staleTime: 5  * 60 * 1000,
    });
    return { preferences: data ?? NONE, isLoading, isError, isLoaded: Boolean(data) };
}

export const useUpdatePreferences= () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePreferences,
        onSuccess: (saved) => queryClient.setQueryData(["preferences"], saved),
    });
};