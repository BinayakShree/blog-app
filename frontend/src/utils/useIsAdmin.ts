import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function useIsAdmin() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser?.isAdmin;
}
