import { StyleFunctionProps, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { Button } from "./button";

export const theme = extendTheme({
	brand: {
		100: "FF3c00",
	},
	fonts: {
		body: "Open Sans, sans-serif",
	},
	styles: {
		global: (props: StyleFunctionProps) => ({
			body: {
				bg: mode("gray.200", "gray.200")(props),
			},
		}),
	},
	components: { Button },
});
