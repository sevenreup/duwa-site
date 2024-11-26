import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FunctionInfo } from "contentlayer/generated";
import { getGenDocMethods } from "@/lib/generated-docs";
import { Mdx } from "../mdx-components";

const FunctionDocumentationComponent = ({
  functionInfo,
}: {
  functionInfo: FunctionInfo;
}) => {
  const { Name, Arguments = [], RetunType, Doc } = functionInfo;
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle id={Name} className="font-mono  scroll-m-20">
          {Name}(
          <span className="text-muted-foreground">
            {Arguments.map((arg, idx) => (
              <React.Fragment key={arg.Name}>
                {idx > 0 && ", "}
                <span>
                  {arg.Name}: <span className="text-primary">{arg.Type}</span>
                </span>
              </React.Fragment>
            ))}
          </span>
          )
          {RetunType && (
            <>
              → <span className="text-primary">{RetunType}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Arguments.length > 0 && (
            <div className="mt-0">
              <h4 className="text-sm font-semibold mb-2">Arguments</h4>
              <div className="flex flex-row flex-wrap gap-6">
                {Arguments.map((arg) => (
                  <div key={arg.Name} className="flex items-start gap-2">
                    <Badge variant="outline" className="font-mono">
                      {arg.Name}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">
                      {arg.Type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {RetunType && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold mb-2">Returns</h4>
              <Badge variant="outline" className="font-mono">
                {RetunType}
              </Badge>
            </div>
          )}
          <div className="pt-2">
            <Mdx code={Doc.code} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FunctionDocumentation = ({
  source,
  infoKey,
}: {
  infoKey: string;
  source: string;
}) => {
  const functions = getGenDocMethods(source, infoKey);
  if (!functions || functions.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-6 mt-6">
      <h1
        id="methods"
        className="font-heading mt-2 scroll-m-20 text-4xl font-bold"
      >
        Methods
      </h1>
      {functions.map((f) => (
        <FunctionDocumentationComponent key={f.Name} functionInfo={f} />
      ))}
    </div>
  );
};
