import type { UUID } from "@pingcortex/shared-types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string | undefined): value is UUID => {
    return typeof value === 'string' && UUID_PATTERN.test(value);
};
