import Link from "next/link";
import Github from "./icons/Github";
import Instagram from "./icons/Instagram";
import TikTok from "./icons/TikTok";
import YouTube from "./icons/YouTube";

function NavBar() {
  return (
    <nav className="flex items-center justify-center md:justify-end gap-5 px-10 py-5 w-full">
      <Link
        href="https://github.com/elrincondeldev/backgrounds-hub"
        target="_blank"
      >
        <Github width={24} height={24} />
      </Link>
      <Link href="https://www.instagram.com/elrincondeldev/" target="_blank">
        <Instagram width={24} height={24} />
      </Link>
      <Link href="https://www.tiktok.com/@elrincondeldev" target="_blank">
        <TikTok width={24} height={24} />
      </Link>
      <Link href="https://www.youtube.com/@elrincondeldev" target="_blank">
        <YouTube width={24} height={24} />
      </Link>
    </nav>
  );
}

export default NavBar;
