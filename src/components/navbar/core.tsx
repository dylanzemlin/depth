import DesktopNav from "./desktop";
import MobileNav from "./mobile";

export default function Navbar() {
    return (
        <nav className="border-gray-200 border min-w-56 p-2 px-4">
            <DesktopNav />
            <MobileNav />
        </nav>
    )
}