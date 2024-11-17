import DuwaEditor from "@/components/editor";
import React from "react";
import Script from "next/script";

const Page = () => {
  return (
    <>
      <Script src="/wasm_exec.js" strategy="beforeInteractive" />
      <DuwaEditor />
    </>
  );
};

export default Page;
