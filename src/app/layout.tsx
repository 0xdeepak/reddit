import { Providers } from "./providers";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
	title: "RedDot (Reddit Clone)",
	description: "Reddit Clone Using NextJs",
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
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
