"use client";

import { Image } from "@chakra-ui/image";
import { Flex } from "@chakra-ui/layout";
import { FunctionComponent } from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import {useAuthState} from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import CommunitySection from "./CommunitySection/CommunitySection"

type NavbarProps = {};

const Navbar: FunctionComponent<NavbarProps> = () => {
	const [signedInUser, userLoading, userError] = useAuthState(auth);

	return (
		<Flex bg="white" height="48px" padding="0px 20px" align="center" justifyContent="space-between">
			<Flex align="center">
				<Image
					src="/images/redditFace.svg"
					height="48px"
					padding="8px 0px"
					alt="reddit logo"
					minWidth="32px"
				></Image>
				<Image
					src="/images/redditText.svg"
					height="48px"
					display={{ base: "none", md: "unset" }}
					alt="reddit logo text"
				></Image>
			</Flex>
			<CommunitySection></CommunitySection>
			<SearchInput></SearchInput>
			<RightContent user={signedInUser}></RightContent>
		</Flex>
	);
};

export default Navbar;
