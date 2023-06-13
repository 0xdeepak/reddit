"use client";

import { authModalState } from "@/atoms/authModalAtom";
import { Button, Flex, Heading, Link } from "@chakra-ui/react";
import Error from "next/error";
import { FunctionComponent, useEffect } from "react";

interface ErrorPageProps {
	error?: Error;
	reset?: () => void;
}

const ErrorPage: FunctionComponent<ErrorPageProps> = ({ error, reset }) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Flex
			justifyContent="center"
			alignItems="center"
			flexGrow="1"
			direction="column"
			height="150vh"
			backgroundColor="gray.200"
		>
			<Heading as="h1" fontSize="18px" fontWeight="500">
				{"Something went wrong!"}
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
					onClick={() => reset!()}
				>
					Retry
				</Button>
			</Link>
		</Flex>
	);
};

export default ErrorPage;
