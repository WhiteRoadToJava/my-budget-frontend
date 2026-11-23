import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/userService";

// The signed-in user: { username, firstname, lastname, fullname, phone, expireDate }.
export const useCurrentUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => (await getUser()).data,
  });