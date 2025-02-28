"use client";

import dynamic from "next/dynamic";
import Footer from "./components/Footer";

const SkeletonGenerator = dynamic(
  () => import("./components/SkeletonGenerator"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <>
      <SkeletonGenerator />
      <Footer />
    </>
  );
}
