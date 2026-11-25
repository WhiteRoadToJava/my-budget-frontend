import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPreferences, updatePreferences } from "../api/preferencesService"
import { weekStartsOnFor } from "../utils/dates";
import { isArchived } from "../utils/accounts/accountList";
import i18n from "../configuration/i18n";


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

// Reads the saved preferences without fetching them: UserLayout fetches them, and pages
// outside it (admin, sign-in) simply get nothing.
const useSavedPreferences = () =>
    useQuery({ queryKey: ["preferences"], queryFn: getPreferences, enabled: false }).data ?? NONE;

// first day of the week for date-fns (0 Sunday, 1 Monday, 6 Saturday)
export const useWeekStart = () => weekStartsOnFor(useSavedPreferences().firstDayOfWeek, i18n.language);

// the base currency, or null
export const useBaseCurrency = () => useSavedPreferences().baseCurrency;

// how amounts are shown: "CODE" (also when nothing is chosen) or "SYMBOL"
export const useAmountDisplay = () => useSavedPreferences().amountDisplay ?? "CODE";

// the default account among the given ones, when it is still active
export const useDefaultAccount = (accounts = []) => {
    const id = useSavedPreferences().defaultAccountId;
    return accounts.find((account) => account.id === id && !isArchived(account));
};
