"use client";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { ChakraProvider, Flex, Box, Text } from "@chakra-ui/react";
import { theme } from "@/chakra/theme";
import useCommunityData from "@/hooks/useCommunityData";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import usePostsData from "@/hooks/usePostsData";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/navigation";
import SortPosts from "@/components/Homepage/SortPosts";
import { Post, UserVote } from "@/atoms/postAtom";
import SkeletonLoader from "@/components/Posts/Loader";
import PostItem from "@/components/Posts/Post";
import Error from "@/components/Posts/Error";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import Recommendations from "@/components/Community/Recommendations";

interface HomepageProps {}

const Homepage: FunctionComponent<HomepageProps> = ({}) => {
	const currentUser = useRecoilValue(userAtom);
	const { communityData } = useCommunityData();
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
	const [retry, setRetry] = useState(0);
	const [defaultSortType, setDefaultSortType] = useState<string>("");

	// build public home feed
	const buildDefaultHomeFeed = useCallback(async () => {
		setDataFetchingError(false);
		setPostsDataFetching(true);
		try {
			const postsQuery = query(
				collection(firestore, "posts"),
				where("communityType", "!=", "private"),
				limit(15)
			);
			const postDocs = await getDocs(postsQuery);
			const posts = postDocs.docs
				.map((post) => post.data() as Post)
				.sort((a, b) => b.voteCount - a.voteCount);
			setPostsData(posts);
		} catch (error: any) {
			console.log("error fetching home feed", error.message);
			setDataFetchingError(true);
		} finally {
			setDefaultSortType("top");
			setPostsDataFetching(false);
		}
	}, [setPostsData]);

	// build home feed for user
	const buildUserHomeFeed = useCallback(async () => {
		if (communityData.userCommunitySnippets.length === 0) {
			buildDefaultHomeFeed();
			return;
		}
		setDataFetchingError(false);
		setPostsDataFetching(true);
		try {
			const userCommunityIds = communityData.userCommunitySnippets.map(
				(el) => el.communityName
			);
			const postsQuery = query(
				collection(firestore, "posts"),
				where("communityId", "in", userCommunityIds),
				limit(15)
			);
			const postDocs = await getDocs(postsQuery);
			const posts = postDocs.docs
				.map((post) => post.data() as Post)
				.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
			setPostsData(posts);
		} catch (error: any) {
			console.log("error fetching home feed", error.message);
			setDataFetchingError(true);
		} finally {
			setDefaultSortType("new");
			setPostsDataFetching(false);
		}
	}, [buildDefaultHomeFeed, communityData.userCommunitySnippets, setPostsData]);

	useEffect(() => {
		if (currentUser.user) {
			buildUserHomeFeed();
		} else {
			buildDefaultHomeFeed();
		}
	}, [buildDefaultHomeFeed, buildUserHomeFeed, currentUser.user, retry]);

	// fetch posts voted by user
	useEffect(() => {
		if (currentUser.user) {
			const fetchuserVotes = async () => {
				const snapshot = await getDocs(
					collection(firestore, `users/${currentUser.user.uid}/userVotes`)
				);
				const userVotes = snapshot.docs.map((doc) => doc.data() as UserVote);
				setuserVotesData(userVotes);
			};
			fetchuserVotes();
		} else {
			setuserVotesData([]);
		}
	}, [currentUser.user, setuserVotesData]);

	const handleSelectPost = (post: Post) => {
		onSelectPost(post);
		router.push(`/r/${post.communityId}/comments/${post.id}`);
	};

	const handleSorting = (updatedPosts: Post[]) => {
		setPostsData(updatedPosts);
	};

	return (
		<ChakraProvider theme={theme}>
			<Box flexGrow="1" backgroundColor="gray.300">
				<Flex
					maxWidth="1008px"
					// maxWidth="1320px"
					width="full"
					margin="auto"
					padding="20px 16px 20px 24px"
				>
					<Box flexGrow="1">
						<SortPosts
							posts={postsData.posts}
							onSort={handleSorting}
							defaultType={defaultSortType}
						/>
						{postsDataFetching && <SkeletonLoader count={2} />}
						{dataFetchingError && <Error retry={() => setRetry(retry + 1)} />}
						{!dataFetchingError &&
							!postsDataFetching &&
							postsData.posts.length === 0 && (
								<Flex
									justifyContent="center"
									alignItems="center"
									height="250px"
								>
									<Text fontSize="14px" color="gray.600">
										No Posts Yet
									</Text>
								</Flex>
							)}
						{postsData.posts.map((post, index) => {
							return (
								<PostItem
									key={post.id}
									postData={post}
									userId={currentUser.user?.uid || ""}
									communityName={post.communityId}
									isUserCreatorOrAdmin={false}
									isHomepage
									userVote={
										postsData.userVotes.find(
											(userVote) =>
												userVote.type === "post" &&
												userVote.parentId === post.id
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
					<Recommendations
						isUser={!!currentUser.user}
						userSnippets={communityData.userCommunitySnippets}
					/>
				</Flex>
			</Box>
		</ChakraProvider>
	);
};

export default Homepage;
