import { createContext } from "react";
import type { AuthContextType } from "@pingcortex/shared-types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);