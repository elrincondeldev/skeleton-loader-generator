import Github from "./icons/Github";

function Info() {
  return (
    <section className="flex flex-col items-center justify-center px-4 mt-8 mb-16 text-center">
      <h1 className="text-3xl sm:text-[3rem] md:text-[5rem] md:leading-[5rem] font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
        Skeleton Loaders React
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl">
        Generate a skeleton loader with only a component. All snippets are
        generated with Tailwind CSS.
      </p>
      <a
        href="https://github.com/elrincondeldev/skeleton-loader-generator"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-400 text-gray-600 rounded-lg font-medium hover:border-gray-800 transition-colors text-sm sm:text-base"
      >
        Star on GitHub
        <Github className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    </section>
  );
}

export default Info;
