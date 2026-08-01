"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

interface NavProps {
  loggedIn: boolean;
}

export default function Nav({ loggedIn }: NavProps) {
    const pathname = usePathname();
    let links = [];
        if (!loggedIn) {
        links = [
            { href: "/", label: "Home" },
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
            ];
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
    } else {
        links = [
        { href: "/", label: "Home" },
        { href: "/profile", label: "Profile" },
        ];
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
                <SignOutButton />
                </nav>
            )
    }
}