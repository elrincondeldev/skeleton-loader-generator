import Link from "next/link";
import Github from "./icons/Github";
import Instagram from "./icons/Instagram";
import TikTok from "./icons/TikTok";
import YouTube from "./icons/YouTube";

function NavBar() {
  return (
    <nav className="flex items-center justify-center md:justify-end gap-5 px-10 py-5 w-full">
      <Link href="https://github.com/qodo-dev">
        <Github width={24} height={24} />
      </Link>
      <Link href="https://instagram.com/qodo.dev">
        <Instagram width={24} height={24} />
      </Link>
      <Link href="https://tiktok.com/@qodo.dev">
        <TikTok width={24} height={24} />
      </Link>
      <Link href="https://youtube.com/@qodo.dev">
        <YouTube width={24} height={24} />
      </Link>
    </nav>
  );
}

export default NavBar;
