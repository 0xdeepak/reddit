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
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { UserVote } from "@/atoms/postAtom";
import SkeletonLoader from "@/components/Posts/Loader";
import CommentsSection from "@/components/Posts/CommentsSection/CommentsSection";
import Restricted from "./restricted";

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
		onChangePostVote,
		onAddComment,
		onDeleteComment,
		onDeletePost,
		onChangeCommentVote,
	} = usePostsData();
	const setAuthModalState = useSetRecoilState(authModalState);
	const [userRole, setUserRole] = useState("none");

	// fetch votes of user in current community
	useEffect(() => {
		if (currentUser.user) {
			const fetchuserVotes = async () => {
				const userVotesQuery = query(
					collection(firestore, `users/${currentUser.user.uid}/userVotes`),
					where("communityId", "==", communityId.toLowerCase())
				);
				const snapshot = await getDocs(userVotesQuery);
				const userVotes = snapshot.docs.map((doc) => doc.data() as UserVote);
				setuserVotesData(userVotes);
			};
			fetchuserVotes();
		} else {
			setuserVotesData([]);
		}
	}, [communityId, currentUser.user, setuserVotesData]);

	// check user role in current community
	useEffect(() => {
		if (communityData.currentCommunity) {
			if (
				communityData.userCommunitySnippets.length == 0 ||
				!currentUser.user
			) {
				setUserRole("none");
				return;
			}
			for (const el of communityData.userCommunitySnippets) {
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
		communityData.userCommunitySnippets,
		communityId,
		currentUser.user,
	]);

	if (
		communityData.currentCommunity?.communityType === "private" &&
		userRole === "none"
	) {
		return <Restricted communityId={communityData.currentCommunity.name} />;
	}

	return (
		<ChakraProvider theme={theme}>
			<Box flexGrow="1" backgroundColor="gray.300">
				<Flex
					maxWidth="1064px"
					width="full"
					margin="auto"
					padding="32px 16px 24px"
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
									onChangePostVote={onChangePostVote}
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
									onChangeCommentVote={onChangeCommentVote}
									userVotesData={postsData.userVotes}
								/>
							</>
						)}
					</Box>
					<AboutCommunity
						communityData={communityData.currentCommunity}
					></AboutCommunity>
				</Flex>
			</Box>
		</ChakraProvider>
	);
};

export default PostPage;
