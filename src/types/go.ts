export type DuweWasmEventDetail = {
  level: "info" | "warn" | "error" | "log" | "debug";
  message: string;
  type: "parser" | "compiler" | "runtime";
};

export type DuweWasmEvent = {
  detail: DuweWasmEventDetail;
} & Event;

