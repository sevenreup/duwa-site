// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { getGenDocTOC } from "./generated-docs";

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

function flattenNode(node) {
  const p = [];
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return;
    p.push(node.value);
  });
  return p.join(``);
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(node, current): Items {
  if (!node) {
    return {};
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        current.url = item.url;
        current.title = flattenNode(node);
      }

      if (item.type === "text") {
        current.title = flattenNode(node);
      }
    });

    return current;
  }

  if (node.type === "list") {
    current.items = node.children.map((i) => getItems(i, {}));

    return current;
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], {});

    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node, file) => {
  const table = toc(node);
  const items = getItems(table.map, {});

  file.data = items;
};

export type TableOfContents = Items;

export async function getTableOfContents(
  content: string,
  gen: { source?: string; infoKey?: string }
): Promise<TableOfContents> {
  console.log(gen);

  const result = (await remark().use(getToc).process(content)).data;
  if (gen.source && gen.infoKey) {
    const genToc = getGenDocTOC(gen.source.trim(), gen.infoKey.trim());
    if (genToc.length > 0) {
      result.items = [...(result.items ?? []), ...genToc];
    }
  }
  return result;
}
