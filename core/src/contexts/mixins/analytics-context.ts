import { createContext } from "@lit/context";

export const analyticsContext = createContext<
  Record<string, string> | undefined
>(Symbol("analytics"));
