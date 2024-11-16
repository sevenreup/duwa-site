export interface ConsoleEvent extends Event {
    detail: {
        message: string;
        level: "log" | "warn" | "error" | "info" | "debug";
    }
}