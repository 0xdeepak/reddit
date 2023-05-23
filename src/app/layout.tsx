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
			<body>
				<Providers>
					<Navbar></Navbar>
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
