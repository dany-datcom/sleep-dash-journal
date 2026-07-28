"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home"},
    { href: "/login", label: "Login"},
    { href: "/profile/register", label: "Register" }
];

export default function Nav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-row justify-around p-6">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={pathname === link.href ? "underline" : ""}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}