import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { SetStateAction, PropsWithChildren } from 'react';

const LOCAL_STORAGE_USER_KEY = 'userEmail';

const loadUser = () => {
  return localStorage.getItem(LOCAL_STORAGE_USER_KEY);
};

const saveUser = (email: string | null) => {
  if (email == null) {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  } else {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, email);
  }
};

const Context = createContext<
  [string | null, Dispatch<SetStateAction<string | null>>]
>([null, () => {}]);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    setUser(loadUser());
  }, []);
  const saveAndSetUser: any = (value: any) => {
    setUser(value);
    saveUser(value);
  };
  return (
    <Context.Provider value={[user, saveAndSetUser]}>
      {children}
    </Context.Provider>
  );
};

export function useUserContext() {
  return useContext(Context);
}
