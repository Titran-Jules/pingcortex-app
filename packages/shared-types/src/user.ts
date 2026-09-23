import { UUID } from "./uuid";

export interface UserRegister {
    email: string;
    name: string;
    password: string;
    level: string;
}

export interface UserUpdate {
    level: string;
    alertThreshold: number;
}

export interface UserResponse {
    id: UUID;
    email: string;
    name: string;
    level: string;
    alertThreshold: number;
    createdAt: string
}