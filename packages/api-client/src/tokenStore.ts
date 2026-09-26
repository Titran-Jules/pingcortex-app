let memoryAccessToken: string | null = null;

export const tokenStore = {
    getAccessToken: (): string | null => memoryAccessToken,
    setAccessToken: (token: string | null): void => {
        memoryAccessToken = token;
    },
    clearAccessToken: (): void => {
        memoryAccessToken = null;
    },
};