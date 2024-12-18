export type DuwaWasmEventDetail = {
  level: "info" | "warn" | "error" | "log" | "debug";
  message: string;
  type: "parser" | "compiler" | "runtime";
};

export type DuwaConsoleCommandEventDetail = {
  command: string;
};

export type DuweWasmEvent = {
  detail: {
    type: "duwaLogEvent" | "duwaConsoleCommandEvent" | "duwaRuntimeEvent";
    detail: DuwaWasmEventDetail | DuwaConsoleCommandEventDetail;
  };
} & Event;
