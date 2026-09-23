import { UUID } from "./uuid";

export interface JwtPayload {
    id: UUID;
    email: string;
    level: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}