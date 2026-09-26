let memoryAccessToken: string | null = null;

export const tokenScore = {
    getAccessToken: (): string | null => memoryAccessToken,
    setAccessToken: (token: string | null): void => {
        memoryAccessToken = token;
    },
    clearAccessToken: (): void => {
        memoryAccessToken = null;
    },
};