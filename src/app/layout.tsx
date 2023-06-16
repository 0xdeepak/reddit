import { Providers } from "./providers";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
	title: "RedDot (Reddit Clone)",
	description: "Reddit Clone Webapp | Deepak Yadav",
	icons: {
		icons: "./favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body style={{ height: "100vh", backgroundColor: "gray.200" }}>
				<Providers>
					<Navbar />
					<main
						style={{ height: "100%", display: "flex", flexDirection: "column" }}
					>
						<div style={{ height: "48px", flexShrink: "0" }}></div>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
