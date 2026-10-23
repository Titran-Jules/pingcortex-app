export const SESSION_HINT_KEY = 'pingcortex:hasSession';

export const sessionHint = {
    has: () => { try { return localStorage.getItem(SESSION_HINT_KEY) === '1'; } catch { return false; } },
    set: () => { try { localStorage.setItem(SESSION_HINT_KEY, '1'); } catch {} },
    clear: () => { try { localStorage.removeItem(SESSION_HINT_KEY); } catch {} },
};
