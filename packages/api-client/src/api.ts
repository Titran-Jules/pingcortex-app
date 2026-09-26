import { LoginRequest, LoginResponse, UserRegister, UserResponse } from "@pingcortex/shared-types";
import { AxiosInstance } from "axios";

export class PingCortexApi {
    constructor(private client: AxiosInstance) {}

    auth = {
        login: (credentials: LoginRequest) =>
            this.client.post<LoginResponse>('/auth/login', credentials).then((res) => res.data),

        register: (data: UserRegister) =>
            this.client.post<UserResponse>('/auth/register', data).then((res) => res.data),

        logout: (refreshToken: string) =>
            this.client.post<void>('/auth/logout', { refreshToken }),
    };
}