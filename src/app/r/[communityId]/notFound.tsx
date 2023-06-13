"use client";

import { theme } from "@/chakra/theme";
import { Button, ChakraProvider, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface ErrorProps {
	communityId: string;
}

const Error: FunctionComponent<ErrorProps> = ({ communityId }) => {
	return (
		<ChakraProvider theme={theme}>
			<Flex
				justifyContent="center"
				alignItems="center"
				flexGrow="1"
				direction="column"
				height="150vh"
				backgroundColor="gray.200"
			>
				<Heading as="h1" fontSize="18px" fontWeight="500">
					{"404 | r/"}
					<span style={{ fontWeight: "600" }}>{communityId}</span>
					{" doesn't exist"}
				</Heading>
				<Link href="/">
					<Button
						marginTop="16px"
						borderRadius="2rem"
						padding="0 16px"
						backgroundColor="blue.400"
						_hover={{ backgroundColor: "blue.300" }}
						width="auto"
						color="#FFF"
					>
						Go Home
					</Button>
				</Link>
			</Flex>
		</ChakraProvider>
	);
};

export default Error;
