import {
  ComputedFields,
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { Options as PrettyOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { codeImport } from "remark-code-import";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import fs from "fs";
import { codeHighlighter } from "@/lib/highlihter";

const duwa = JSON.parse(
  fs.readFileSync("./src/lang/duwa.tmLanguage.json", "utf8")
);

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

const LinksProperties = defineNestedType(() => ({
  name: "LinksProperties",
  fields: {
    doc: {
      type: "string",
    },
    api: {
      type: "string",
    },
  },
}));

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    source: {
      type: "string",
      required: false,
    },
    infoKey: {
      type: "string",
      required: false,
    },
    published: {
      type: "boolean",
      default: true,
    },
    links: {
      type: "nested",
      of: LinksProperties,
    },
    featured: {
      type: "boolean",
      default: false,
      required: false,
    },
    component: {
      type: "boolean",
      default: false,
      required: false,
    },
    toc: {
      type: "boolean",
      default: true,
      required: false,
    },
  },
  computedFields,
}));

const ArgumentData = defineNestedType(() => ({
  name: "ArgumentData",
  fields: {
    Name: { type: "string", required: true },
    Type: { type: "string", required: true },
  },
}));

const FunctionInfo = defineNestedType(() => ({
  name: "FunctionInfo",
  fields: {
    Name: { type: "string", required: true },
    Arguments: { type: "list", of: ArgumentData, default: [] },
    RetunType: { type: "string", required: true },
    Doc: { type: "mdx", required: true },
  },
}));

const BuiltinInfoData = defineNestedType(() => ({
  name: "BuiltinInfoData",
  fields: {
    Functions: { type: "list", of: FunctionInfo, default: [] },
    SourceFile: { type: "string", required: true },
  },
}));

export const LibraryInfo = defineDocumentType(() => ({
  name: "LibraryInfo",
  filePathPattern: `generated/libraries/*.json`,
  contentType: "data",
  fields: {
    Name: { type: "string", required: true },
    Doc: { type: "mdx", required: true },
    Methods: { type: "list", of: FunctionInfo, default: [] },
    SourceFile: { type: "string", required: true },
  },
}));

export const BuiltinInfo = defineDocumentType(() => ({
  name: "BuiltinInfo",
  filePathPattern: `generated/builtins.json`,
  contentType: "data",
  fields: {
    Data: { type: "list", of: BuiltinInfoData, default: [] },
  },
}));

export const StructInfo = defineDocumentType(() => ({
  name: "StructInfo",
  filePathPattern: `generated/types/*.json`,
  contentType: "data",
  fields: {
    Name: { type: "string", required: true },
    Alternatives: { type: "list", of: { type: "string" }, default: [] },
    Doc: { type: "mdx", required: true },
    Methods: { type: "list", of: FunctionInfo, default: [] },
    SourceFile: { type: "string", required: true },
  },
}));

export default makeSource(async () => {
  const lighter = await codeHighlighter(duwa);
  const prettyCodeOpts: PrettyOptions = {
    theme: "one-dark-pro",
    defaultLang: "duwa",
    bypassInlineCode: true,
    onVisitLine(node) {
      // Prevent lines from collapsing in `display: grid` mode, and allow empty
      // lines to be copy/pasted
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    onVisitHighlightedLine(node) {
      node?.properties?.className?.push("line--highlighted");
    },
    onVisitHighlightedChars(node) {
      node.properties.className = ["word--highlighted"];
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getHighlighter(opts) {
      return lighter;
    },
  };
  return {
    contentDirPath: "./content",
    documentTypes: [Doc, StructInfo, LibraryInfo, BuiltinInfo],
    mdx: {
      remarkPlugins: [remarkGfm, codeImport],
      rehypePlugins: [
        rehypeSlug,
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;
              if (codeEl.tagName !== "code") {
                return;
              }

              if (codeEl.data?.meta) {
                // Extract event from meta and pass it down the tree.
                const regex = /event="([^"]*)"/;
                const match = codeEl.data?.meta.match(regex);
                if (match) {
                  node.__event__ = match ? match[1] : null;
                  codeEl.data.meta = codeEl.data.meta.replace(regex, "");
                }
              }

              node.__rawString__ = codeEl.children?.[0].value;
              node.__src__ = node.properties?.__src__;
              node.__style__ = node.properties?.__style__;
            }
          });
        },
        [rehypePrettyCode, prettyCodeOpts],
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "div") {
              if (!("data-rehype-pretty-code-fragment" in node.properties)) {
                return;
              }

              const preElement = node.children.at(-1);
              if (preElement.tagName !== "pre") {
                return;
              }

              preElement.properties["__withMeta__"] =
                node.children.at(0).tagName === "div";
              preElement.properties["__rawString__"] = node.__rawString__;

              if (node.__src__) {
                preElement.properties["__src__"] = node.__src__;
              }

              if (node.__event__) {
                preElement.properties["__event__"] = node.__event__;
              }

              if (node.__style__) {
                preElement.properties["__style__"] = node.__style__;
              }
            }
          });
        },
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["subheading-anchor"],
              ariaLabel: "Link to section",
            },
          },
        ],
      ],
    },
  };
});
