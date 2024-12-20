import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Config = {
  style: "default" | "compact";
  theme: "zinc" | "copper" | "silver";
  radius: number;
};

const configAtom = atomWithStorage<Config>("config", {
  style: "default",
  theme: "zinc",
  radius: 0.5,
});

export function useConfig() {
  return useAtom(configAtom);
}
