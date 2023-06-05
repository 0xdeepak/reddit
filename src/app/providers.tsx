"use client";

import { theme } from "@/chakra/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CacheProvider>
			<ChakraProvider>
				<RecoilRoot>{children}</RecoilRoot>
			</ChakraProvider>
		</CacheProvider>
	);
}
