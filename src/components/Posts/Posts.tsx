import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { communityState } from "@/atoms/communityAtom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import Error from "./Error";
import usePostsData from "@/hooks/usePostsData";
import Post from "./Post";
import { userState } from "@/atoms/userAtom";
import SkeletonLoader from "./Loader";
import { UserVote } from "@/atoms/postAtom";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/navigation";
import SortPosts from "./SortPosts";

interface PostsProps {
	communityData: communityState;
	currentUser: userState;
	userRole: string;
}

const Posts: FunctionComponent<PostsProps> = ({
	communityData,
	currentUser,
	userRole,
}) => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const [postsDataFetching, setPostsDataFetching] = useState(true);
	const [dataFetchingError, setDataFetchingError] = useState(false);
	const {
		postsData,
		setPostsData,
		setuserVotesData,
		onChangePostVote,
		onSelectPost,
		onDeletePost,
	} = usePostsData();
	const router = useRouter();

	// fetch posts on initial render
	const fetchPostsData = useCallback(async () => {
		if (!communityData.currentCommunity?.name) {
			return;
		}
		setPostsDataFetching(true);
		try {
			const postsQuery = query(
				collection(firestore, "posts"),
				where("communityId", "==", communityData.currentCommunity?.name),
				orderBy("createdAt", "desc")
			);
			const postDocs = await getDocs(postsQuery);
			const posts = postDocs.docs.map((doc) => doc.data() as Post);
			setPostsData(posts);
		} catch (error: any) {
			console.log("error fetching posts", error.message);
			setDataFetchingError(true);
		} finally {
			setPostsDataFetching(false);
		}
	}, [communityData.currentCommunity?.name, setPostsData]);

	useEffect(() => {
		fetchPostsData();
	}, [fetchPostsData]);

	useEffect(() => {
		if (currentUser.user && communityData.currentCommunity?.name) {
			const fetchuserVotes = async () => {
				const votesQuery = query(
					collection(firestore, `users/${currentUser.user.uid}/userVotes`),
					where(
						"communityId",
						"==",
						communityData.currentCommunity?.name.toLowerCase()
					)
				);
				const snapshot = await getDocs(votesQuery);
				const userVotes = snapshot.docs.map((doc) => doc.data() as UserVote);
				setuserVotesData(userVotes);
			};
			fetchuserVotes();
		} else {
			setuserVotesData([]);
		}
	}, [
		communityData.currentCommunity?.name,
		currentUser.user,
		setuserVotesData,
	]);

	const handleSelectPost = (post: Post) => {
		onSelectPost(post);
		router.push(
			`/r/${communityData.currentCommunity?.name}/comments/${post.id}`
		);
	};

	const handleSorting = (updatedPosts: Post[]) => {
		setPostsData(updatedPosts);
	};

	if (
		communityData.currentCommunity?.communityType === "private" &&
		userRole === "none"
	) {
		return (
			<Flex
				justifyContent="center"
				alignItems="center"
				height="250px"
				flexGrow="1"
			>
				<Text fontSize="14px" color="gray.600" textAlign="center">
					This community is private.
					<br />
					Join to view / create posts in the community.
				</Text>
			</Flex>
		);
	}

	if (dataFetchingError) {
		return <Error retry={fetchPostsData} />;
	}

	return (
		<Box flexGrow="1">
			<SortPosts posts={postsData.posts} onSort={handleSorting} />
			{postsDataFetching && <SkeletonLoader count={2} />}
			{!postsDataFetching && postsData.posts.length === 0 && (
				<Flex justifyContent="center" alignItems="center" height="250px">
					<Text fontSize="14px" color="gray.600">
						No Posts Yet
					</Text>
				</Flex>
			)}
			{postsData.posts.map((post, index) => {
				return (
					<Post
						key={post.id}
						postData={post}
						userId={currentUser.user?.uid || ""}
						communityName={communityData.currentCommunity!.name}
						isUserCreatorOrAdmin={
							currentUser.user &&
							((userRole === "member" &&
								post.creatorId === currentUser.user.uid) ||
								userRole === "admin")
						}
						userVote={
							postsData.userVotes.find(
								(userVote) =>
									userVote.type === "post" && userVote.parentId === post.id
							)?.value || 0
						}
						onChangePostVote={onChangePostVote}
						onSelectPost={handleSelectPost}
						onDeletePost={onDeletePost}
						openAuthModal={() =>
							setAuthModalState((prevVal) => ({
								...prevVal,
								open: true,
								view: "login",
							}))
						}
					/>
				);
			})}
		</Box>
	);
};

export default Posts;
