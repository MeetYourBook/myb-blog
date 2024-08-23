import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import { ThemeProvider } from "next-themes";

const notoSansKr = Noto_Sans_KR({
    weight: ["500"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MYB-Blog",
    description: "MYB 기술 블로그",
    icons: {
        icon: "/titleIcon.png",
    },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html
            lang="ko"
            className={notoSansKr.className}
            suppressHydrationWarning
        >
            <body className="flex flex-col min-h-screen">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Header />
                    <main className="flex-grow dark:bg-customBlack">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
