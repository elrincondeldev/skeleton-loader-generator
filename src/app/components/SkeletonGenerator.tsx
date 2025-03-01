"use client";

import React from "react";
import Info from "./Info";
import { ComponentInput } from "./skeleton/components/ComponentInput";
import { SkeletonPreview } from "./skeleton/components/SkeletonPreview";
import { GeneratedCode } from "./skeleton/components/GeneratedCode";

const SkeletonGenerator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
      <main className="flex-grow px-4 pb-8 sm:px-8 md:px-12 lg:px-20">
        <Info />
        <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-7xl mx-auto">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <ComponentInput />
            <SkeletonPreview />
          </section>
          <GeneratedCode />
        </div>
      </main>
    </div>
  );
};

export default SkeletonGenerator;
