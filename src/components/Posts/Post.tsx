import React, { FunctionComponent, useEffect, useState } from "react";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Skeleton,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import {
	BsArrowUpCircle,
	BsArrowDownCircle,
	BsChatLeft,
	BsBookmark,
	BsArrowUpCircleFill,
	BsArrowDownCircleFill,
	BsLink45Deg,
} from "react-icons/bs";
import { IoArrowRedoOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { DateTime } from "luxon";
import { Post } from "@/atoms/postAtom";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostProps {
	postData: Post;
	userId: string;
	communityName: string;
	isUserCreatorOrAdmin: boolean;
	isPostSelected?: boolean;
	isHomepage?: boolean;
	userVote: number;
	onChangePostVote: (
		postId: string,
		userId: string,
		userVote: number,
		communityId: string,
		value: number
	) => Promise<boolean>;
	onDeletePost: (post: Post) => Promise<boolean>;
	onSelectPost?: (post: Post) => void;
	openAuthModal: () => void;
}

const Post: FunctionComponent<PostProps> = ({
	postData,
	userId,
	communityName,
	isUserCreatorOrAdmin,
	isPostSelected,
	isHomepage,
	userVote,
	onChangePostVote,
	onDeletePost,
	onSelectPost,
	openAuthModal,
}) => {
	const router = useRouter();
	const [isImageLoading, setIsImageLoading] = useState(!!postData.imageUrl);
	const [loading, setLoading] = useState({ action: "", value: false });
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [error, setError] = useState("");

	const handlePostDelete = async (event: React.MouseEvent) => {
		event.stopPropagation();
		setError("");
		setLoading({ action: "delete", value: true });
		const res = await onDeletePost(postData);
		if (!res) {
			setError("Failed to delete post");
		}
		setLoading({ action: "", value: false });
		if (isPostSelected) {
			router.push(`/r/${communityName}`);
		}
	};

	const handleUpvote = async (event: React.MouseEvent) => {
		event.stopPropagation();
		if (!userId) {
			openAuthModal();
			return;
		}
		await onChangePostVote(
			postData.id,
			userId,
			userVote,
			communityName.toLowerCase(),
			1
		);
	};

	const handleDownvote = async (event: React.MouseEvent) => {
		event.stopPropagation();
		if (!userId) {
			openAuthModal();
			return;
		}
		await onChangePostVote(
			postData.id,
			userId,
			userVote,
			communityName.toLowerCase(),
			-1
		);
	};

	return (
		<Flex
			backgroundColor="#fff"
			borderRadius={isPostSelected ? "8px 8px 0 0" : "8px"}
			borderWidth="1px"
			borderStyle={isPostSelected ? "none" : "solid"}
			borderColor="gray.400"
			marginBottom="16px"
			overflow="hidden"
			cursor={isPostSelected ? "auto" : "pointer"}
			onClick={() => {
				if (onSelectPost) {
					onSelectPost(postData);
				}
			}}
		>
			<Flex
				width="38px"
				direction="column"
				alignItems="center"
				backgroundColor={isPostSelected ? "#FFF" : "gray.100"}
				flexShrink="0"
				padding="16px 0"
			>
				<button onClick={handleUpvote}>
					<Icon
						height="24px"
						width="24px"
						as={userVote === 1 ? BsArrowUpCircleFill : BsArrowUpCircle}
						color={userVote === 1 ? "rgba(255, 60, 0, 0.8)" : "gray.500"}
						_hover={{
							color: userVote === 1 ? "rgba(255, 60, 0, 0.8)" : "gray.900",
						}}
						borderRadius="100%"
						backgroundColor={userVote === 1 ? "#fff" : "inherit"}
					/>
				</button>
				<Text fontSize="14px" fontWeight="700" padding="4px 0 8px">
					{postData.voteCount}
				</Text>
				<button onClick={handleDownvote}>
					<Icon
						as={userVote === -1 ? BsArrowDownCircleFill : BsArrowDownCircle}
						height="24px"
						width="24px"
						color={userVote === -1 ? "blue.500" : "gray.500"}
						backgroundColor={userVote === -1 ? "#fff" : "inherit"}
						_hover={{
							color: userVote === -1 ? "blue.500" : "gray.900",
						}}
						borderRadius="100%"
					/>
				</button>
			</Flex>
			<Box flexGrow="1">
				{error && (
					<Alert status="error" height="32px">
						<AlertIcon />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<Flex padding="8px" alignItems="center">
					{isHomepage && (
						<Link href={`r/${communityName}`}>
							<Flex
								alignItems="center"
								marginRight="8px"
								onClick={(event) => event.stopPropagation()}
							>
								<Image
									src={
										postData.communityLogoUrl || "/images/redditUserLogo.svg"
									}
									alt={`${communityName} logo`}
									height="20px"
									width="20px"
									objectFit="cover"
									borderRadius="50%"
								/>
								&nbsp;&nbsp;
								<Text
									fontSize="12px"
									fontWeight="600"
									_hover={{ textDecoration: "underline" }}
								>
									{`r/${postData.communityId}`}
								</Text>
							</Flex>
						</Link>
					)}
					<Text fontSize="12px" color="gray.500">
						Posted by u/{postData.creatorUsername}{" "}
						{DateTime.fromMillis(postData.createdAt.toMillis()).toRelative()}
					</Text>
				</Flex>
				<Heading as="h3" fontSize="18px" fontWeight="600" marginLeft="8px">
					{postData.title}
				</Heading>
				<Text padding="12px 8px" fontSize="16px">
					{postData.body}
				</Text>
				{isImageLoading && <Skeleton maxWidth="full" height="350px" />}
				{postData.imageUrl && (
					<Flex justifyContent="center">
						<Image
							id="post-image"
							src={postData.imageUrl}
							alt="post-image"
							maxWidth="full"
							maxHeight="500px"
							objectFit="contain"
							objectPosition="center"
							display={isImageLoading ? "none" : "unset"}
							onLoad={() => setIsImageLoading(false)}
						></Image>
					</Flex>
				)}
				<Flex padding="4px 8px">
					<Button
						padding="0 4px"
						color="gray.500"
						fontSize="14px"
						fontWeight="500"
						width="auto"
						height="30px"
						borderRadius="2px"
						backgroundColor="#fff"
					>
						<Icon
							as={BsChatLeft}
							marginRight="8px"
							height="18px"
							width="18px"
						/>
						{`${postData.commentsCount} Comments`}
					</Button>
					<Button
						padding="0 4px"
						color="gray.500"
						fontSize="14px"
						fontWeight="500"
						width="auto"
						height="30px"
						borderRadius="2px"
						backgroundColor="#fff"
						marginLeft="8px"
						onClick={(event) => {
							event.stopPropagation();
							onOpen();
						}}
					>
						<Icon
							as={IoArrowRedoOutline}
							marginRight="8px"
							height="20px"
							width="20px"
						/>
						Share
					</Button>
					<Button
						padding="0 4px"
						color="gray.500"
						fontSize="14px"
						fontWeight="500"
						width="auto"
						height="30px"
						borderRadius="2px"
						backgroundColor="#fff"
						marginLeft="8px"
					>
						<Icon
							as={BsBookmark}
							marginRight="8px"
							height="18px"
							width="18px"
						/>
						Save
					</Button>
					{isUserCreatorOrAdmin && (
						<Button
							padding="0 4px"
							color="gray.500"
							fontSize="14px"
							fontWeight="500"
							width="auto"
							height="30px"
							borderRadius="2px"
							backgroundColor="#fff"
							marginLeft="8px"
							isLoading={loading.action == "delete" && loading.value}
							onClick={handlePostDelete}
						>
							<Icon
								as={AiOutlineDelete}
								marginRight="8px"
								height="20px"
								width="20px"
							/>
							Delete
						</Button>
					)}
				</Flex>
			</Box>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="auto"
					backdropBlur="5px"
				/>
				<ModalContent maxWidth="500px" width="auto">
					<ModalHeader fontSize="16px">Share</ModalHeader>
					<ModalCloseButton />
					<ModalBody paddingBottom="20px">
						<Flex
							borderRadius="6px"
							overflow="hidden"
							border="1px solid"
							borderColor="gray.300"
							borderLeft="none"
						>
							<Box overflowX="auto" flexGrow="1">
								<Text
									padding="8px 16px 8px 12px"
									fontSize="14px"
									borderLeft="4px solid"
									borderLeftColor="blue.500"
								>
									{`${process.env.NEXT_PUBLIC_REACT_SERVER_URL}/r/${communityName}/comments/${postData.id}`}
								</Text>
							</Box>
							<Button
								id="copy-link"
								backgroundColor="#fff"
								borderRadius="0"
								height="auto"
								width="auto"
								title="Copy"
								minWidth="0"
								padding="0 8px"
								onClick={async () => {
									await navigator.clipboard.writeText(
										`${process.env.NEXT_PUBLIC_REACT_SERVER_URL}/r/${communityName}/comments/${postData.id}`
									);
									document.getElementById("copy-link")!.title = "Copied";
								}}
							>
								<Icon
									as={BsLink45Deg}
									height="24px"
									width="24px"
									color="gray.600"
								/>
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default Post;
