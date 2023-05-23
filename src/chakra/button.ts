import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
	baseStyle: {
		fontSize: "14px",
		fontWeight: "700",
		borderRadius: "2rem",
		width: "76px",
    height: "32px"
	},
	sizes: {
		lg: {
			width: "116px",
		},
	},
	variants: {
		brandSolid: {
			backgroundColor: "#FF4500",
			color: "#FFFF",
		},
		filled: {
			backgroundColor: "#edeff1",
		},
	},
};
