import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#5F4A8B", // Deep Purple
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F0FFF0", // Honeydew
                    foreground: "#5F4A8B",
                },
                accent: {
                    DEFAULT: "#7B4B3A", // Russet
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#F5F5F5",
                    foreground: "#737373",
                },
            },
        },
    },
    plugins: [],
};
export default config;
