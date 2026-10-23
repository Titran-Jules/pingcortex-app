import type { LoginRequest, UserRegister } from "@pingcortex/shared-types";
import { UNAUTHENTICATED_EVENT } from "../api/api";
import { AuthContext } from "./AuthContext";
import type { Session, AuthStatus } from "@pingcortex/shared-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { sessionHint } from "../api/sessionHint";
import { api } from "../api/api";
import { tokenStore } from "@pingcortex/api-client";
import { toast } from "@pingcortex/ui";

const SIGNED_OUT: Session = { status: 'unauthenticated', user: null };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session>(() => 
        sessionHint.has() ? { status: 'loading', user: null } : SIGNED_OUT
    );

    const statusRef = useRef<AuthStatus>(session.status);
    useEffect(() => {
        statusRef.current = session.status;
    }, [session.status]);

    useEffect(() => {
        let ignore = false;
        const restoreSession = async () => {
            if (!sessionHint.has()) {
                return;
            }
            try {
                const user = await api.user.getProfile();
                if (!ignore) {
                    setSession({ status: 'authenticated', user: user});
                }
            } catch {
                if (!ignore) {
                    tokenStore.clearAccessToken();
                    sessionHint.clear();
                    setSession(SIGNED_OUT);
                }
            }
        };

        if (session.status === 'loading') {
            restoreSession();
        }

        const handleUnauthenticated = () => {
            if (statusRef.current === 'authenticated') {
                toast.warning("Votre session a expiré, veuillez vous reconnecter.");
            }
            tokenStore.clearAccessToken();
            sessionHint.clear();
            setSession(SIGNED_OUT);
        };

        window.addEventListener(UNAUTHENTICATED_EVENT, handleUnauthenticated);
        return () => {
            ignore = true;
            window.removeEventListener(UNAUTHENTICATED_EVENT, handleUnauthenticated);
        }
    }, [session.status]);

    const login = useCallback(async (crendentials: LoginRequest) => {
        const response = await api.auth.login(crendentials);
        tokenStore.setAccessToken(response.accessToken);

        try {
            const user = await api.user.getProfile();
            sessionHint.set();
            setSession({ status: 'authenticated', user: user });
        } catch (error) {
            tokenStore.clearAccessToken();
            try { await api.auth.logout(); } catch {return;}
            sessionHint.clear();
            setSession(SIGNED_OUT);
            throw error;
        }
    }, []);

    const register = useCallback(async (data: UserRegister): Promise<'logged-in' | 'registered'> => {
        await api.auth.register(data);
        try {
            await login({ email: data.email, password: data.password });
            return 'logged-in';
        } catch {
            return 'registered';
        }
    }, [login]);

    const logout = useCallback(async () => {
        tokenStore.clearAccessToken();
        sessionHint.clear();
        setSession(SIGNED_OUT);

        api.auth.logout().catch(() => {
            return;
        });
    }, []);

    return (
        <AuthContext.Provider value={{...session, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
