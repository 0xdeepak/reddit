"use client";

import { Box, Icon } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { BsCodeSlash } from "react-icons/bs";
import Link from "next/link";

interface GithubLinkProps {}

const GithubLink: FunctionComponent<GithubLinkProps> = () => {
	return (
		<Link href="https://github.com/0xdeepak/reddit" target="_blank">
			<Box
				position="fixed"
				bottom="32px"
				left="32px"
				zIndex="500"
				background="#0079d3"
				borderRadius="50%"
				overflow="hidden"
				_hover={{ transform: "scale(1.1)" }}
				transition="transform 0.1s"
			>
				<Icon
					as={BsCodeSlash}
					height="24px"
					width="24px"
					margin="8px 8px 0"
					color="#fff"
					borderRadius="50%"
				/>
			</Box>
		</Link>
	);
};

export default GithubLink;
