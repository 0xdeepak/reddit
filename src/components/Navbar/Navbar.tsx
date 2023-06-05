"use client";

import { Image } from "@chakra-ui/image";
import { Flex } from "@chakra-ui/layout";
import { FunctionComponent, useEffect } from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import CommunitySection from "./CommunitySection/CommunitySection";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import {
	DocumentData,
	DocumentSnapshot,
	QuerySnapshot,
	collection,
	doc,
	getDoc,
	getDocs,
} from "firebase/firestore";

type NavbarProps = {};

const Navbar: FunctionComponent<NavbarProps> = () => {
	const [signedInUser, userLoading, userError] = useAuthState(auth);
	const [currentUser, setCurrentUser] = useRecoilState(userAtom);

	useEffect(() => {
		if (signedInUser && signedInUser.displayName != "") {
			const userDocRef = doc(firestore, "users", signedInUser.uid);
			getDoc(userDocRef).then((res) => {
				if (res.exists()) {
					setCurrentUser({
						user: res.data(),
					});
				}
			});
		} else {
			setCurrentUser(() => ({
				user: null,
				communitySnippets: null,
			}));
		}
	}, [setCurrentUser, signedInUser]);

	return (
		<Flex
			bg="white"
			height="48px"
			padding="0px 20px"
			align="center"
			justifyContent="space-between"
			position="fixed"
			top="0"
			width="full"
			zIndex="2000"
		>
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
			<CommunitySection user={currentUser.user}></CommunitySection>
			<SearchInput></SearchInput>
			<RightContent user={currentUser.user}></RightContent>
		</Flex>
	);
};

export default Navbar;
