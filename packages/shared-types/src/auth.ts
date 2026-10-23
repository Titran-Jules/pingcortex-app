import type { UserResponse, LoginRequest, UserRegister } from "@pingcortex/shared-types";

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface Session {
    status: AuthStatus;
    user: UserResponse | null;
}

export interface AuthContextType extends Session {
    login: (credential: LoginRequest) => Promise<void>;
    register: (data: UserRegister) => Promise<'logged-in' | 'registered'>;
    logout: () => Promise<void>;
}