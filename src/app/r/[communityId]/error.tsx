"use client";

import { theme } from "@/chakra/theme";
import { Button, ChakraProvider, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface ErrorProps {}

const Error: FunctionComponent<ErrorProps> = () => {
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
					{"This community doesn't exist"}
				</Heading>
				<Link href="/">
					<Button
						marginTop="16px"
						borderRadius="2rem"
						padding="0 16px"
						backgroundColor="blue.400"
						width="auto"
					>
						Go Home
					</Button>
				</Link>
			</Flex>
		</ChakraProvider>
	);
};

export default Error;
