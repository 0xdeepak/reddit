"use client";

import { authModalState } from "@/atoms/authModalAtom";
import { Button, Flex, Heading, Link } from "@chakra-ui/react";
import Error from "next/error";
import { FunctionComponent, useEffect } from "react";
import { useSetRecoilState } from "recoil";

interface ErrorPageProps {
	error?: Error;
	reset?: () => void;
	isUserNoSignedIn?: boolean;
	isCommunityNotJoined?: boolean;
	communityId: string;
}

const ErrorPage: FunctionComponent<ErrorPageProps> = ({
	error,
	reset,
	isUserNoSignedIn = false,
	isCommunityNotJoined = false,
	communityId,
}) => {
	const setAuthModalState = useSetRecoilState(authModalState);

	const openAuthModal = () => {
		setAuthModalState((prevVal) => ({
			...prevVal,
			open: true,
			view: "login",
		}));
	};

	useEffect(() => {
		console.error(error);
	}, [error]);

	if (isUserNoSignedIn) {
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
					{"Please Login / Signup to Continue"}
				</Heading>
				<Button
					marginTop="16px"
					borderRadius="2rem"
					padding="0 16px"
					backgroundColor="blue.400"
					_hover={{ backgroundColor: "blue.400" }}
					width="auto"
					color="#FFF"
					onClick={openAuthModal}
				>
					Login/Signup
				</Button>
			</Flex>
		);
	} else if (isCommunityNotJoined) {
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
					{`Join r/${communityId} to post into the community`}
				</Heading>
				<Link href={`/r/${communityId}`}>
					<Button
						marginTop="16px"
						borderRadius="2rem"
						padding="0 16px"
						backgroundColor="blue.400"
						_hover={{ backgroundColor: "blue.400" }}
						width="auto"
						color="#FFF"
					>
						{`Go to r/${communityId}`}
					</Button>
				</Link>
			</Flex>
		);
	}
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
