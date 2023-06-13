"use client";

import { theme } from "@/chakra/theme";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import AboutCommunity from "./aboutCommunity";
import useCommunityData from "@/hooks/useCommunityData";
import usePostsData from "@/hooks/usePostsData";
import Post from "@/components/Posts/Post";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import { authModalState } from "@/atoms/authModalAtom";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { UserVote } from "@/atoms/postAtom";
import SkeletonLoader from "@/components/Posts/Loader";
import CommentsSection from "@/components/Posts/CommentsSection/CommentsSection";

interface PostPageProps {
	params: {
		communityId: string;
		postId: string;
	};
}

const PostPage: FunctionComponent<PostPageProps> = ({
	params: { communityId, postId },
}) => {
	const currentUser = useRecoilValue(userAtom);
	const { communityData } = useCommunityData();
	const {
		postsData,
		setuserVotesData,
		setSelectedPost,
		onChangeVote,
		onAddComment,
		onDeleteComment,
		onDeletePost,
	} = usePostsData();
	const setAuthModalState = useSetRecoilState(authModalState);
	const [userRole, setUserRole] = useState("none");

	// fetch posts voted by user
	useEffect(() => {
		if (postsData.userVotes.length === 0) {
			if (currentUser.user) {
				const fetchuserVotes = async () => {
					const userVotesRef = collection(
						firestore,
						`users/${currentUser.user.uid}/userVotes`
					);
					const snapshot = await getDocs(userVotesRef);
					const userVotes = snapshot.docs.map((doc) => doc.data() as UserVote);
					setuserVotesData(userVotes);
				};
				fetchuserVotes();
			}
		} else if (!currentUser.user) {
			setuserVotesData([]);
		}
	}, [currentUser.user, postsData.userVotes, setuserVotesData]);

	// check user role in current community
	useEffect(() => {
		if (communityData.currentCommunity) {
			if (communityData.myCommunitySnippets.length == 0 || !currentUser.user) {
				setUserRole("none");
				return;
			}
			for (const el of communityData.myCommunitySnippets) {
				if (el.communityName.toLowerCase() === communityId.toLowerCase()) {
					if (
						communityData.currentCommunity.creatorId === currentUser.user.uid
					) {
						setUserRole("admin");
					} else {
						setUserRole("member");
					}
					return;
				}
			}
			setUserRole("none");
		}
	}, [
		communityData.currentCommunity,
		communityData.myCommunitySnippets,
		communityId,
		currentUser.user,
	]);

	return (
		<ChakraProvider theme={theme}>
			<Box flexGrow="1" backgroundColor="gray.300">
				<Flex
					maxWidth="1064px"
					width="full"
					margin="auto"
					padding="32px 16px 24px 24px"
				>
					<Box
						flexGrow="1"
						background="#FFF"
						borderRadius="8px"
						overflow="hidden"
					>
						{!postsData.selectedPost && <SkeletonLoader count={1} />}
						{postsData.selectedPost && (
							<>
								<Post
									postData={postsData.selectedPost!}
									userId={currentUser.user?.uid || ""}
									communityName={communityData.currentCommunity?.name || ""}
									isUserCreatorOrAdmin={
										currentUser.user &&
										((userRole === "member" &&
											postsData.selectedPost!.creatorId ===
												currentUser.user.uid) ||
											userRole === "admin")
									}
									userVote={
										postsData.userVotes.find(
											(userVote) =>
												userVote.parentId === postsData.selectedPost!.id
										)?.value || 0
									}
									isPostSelected={true}
									onChangeVote={onChangeVote}
									onDeletePost={onDeletePost}
									openAuthModal={() =>
										setAuthModalState((prevVal) => ({
											...prevVal,
											open: true,
											view: "login",
										}))
									}
								/>
								<CommentsSection
									currentUser={currentUser}
									userRole={userRole}
									communityName={communityData.currentCommunity?.name || ""}
									postData={postsData.selectedPost}
									setPostData={setSelectedPost}
									onAddComment={onAddComment}
									onDeleteComment={onDeleteComment}
								/>
							</>
						)}
					</Box>
					<AboutCommunity communityData={communityData}></AboutCommunity>
				</Flex>
			</Box>
		</ChakraProvider>
	);
};

export default PostPage;
