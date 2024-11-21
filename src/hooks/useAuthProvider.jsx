import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthProvider = () => {
  const { user, setUser } = useContext(AuthContext);

  return { user, setUser };
};

export default useAuthProvider;
