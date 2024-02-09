import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "@/hooks/supabaseConfig";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  session: null as Session | null,
  setSession: (session: Session) => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = (props: PropsWithChildren) => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session);
      if (!session) {
        router.push("/login");
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {props.children}
    </AuthContext.Provider>
  );
};
