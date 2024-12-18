import {
  allBuiltinInfos,
  allLibraryInfos,
  allStructInfos,
} from "contentlayer/generated";

export function getGenDocMethods(source: string, key: string) {
  switch (source) {
    case "types":
      return allStructInfos.find((s) => s.Name === key)?.Methods;
    case "library":
      return allLibraryInfos.find((l) => l.Name.toLocaleLowerCase() === key)
        ?.Methods;
    case "builtin":
      const data = allBuiltinInfos
        .flatMap((b) => b.Data)
        .flatMap((d) => d.Functions);
      return data;
    default:
      return null;
  }
}

export function getGenDocTOC(source: string, key: string) {
  const functions = getGenDocMethods(source, key);
  if (!functions || functions.length === 0) {
    return [];
  }

  return [
    {
      url: "#methods",
      title: "Methods",
      items: functions.map((f) => ({
        url: `#${f.Name}`,
        title: f.Name,
      })),
    },
  ];
}
