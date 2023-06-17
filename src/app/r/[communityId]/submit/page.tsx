"use client";

import { theme } from "@/chakra/theme";
import useCommunityData from "@/hooks/useCommunityData";
import {
	Box,
	Button,
	ChakraProvider,
	Flex,
	Input,
	Text,
	Textarea,
	Alert,
	AlertDescription,
	Image,
	AlertIcon,
} from "@chakra-ui/react";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import AboutCommunity from "./aboutCommunity";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import ErrorPage from "./error";
import { useRouter } from "next/navigation";
import { Post } from "@/atoms/postAtom";
import {
	Timestamp,
	collection,
	doc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

interface CreatePostPageProps {
	params: { communityId: string };
}

const postTypes = [
	{ name: "Text", icon: "" },
	{ name: "Images", icon: "" },
];

const CreatePostPage: FunctionComponent<CreatePostPageProps> = ({
	params: { communityId },
}) => {
	const router = useRouter();
	const currentUser = useRecoilValue(userAtom);
	const { communityData } = useCommunityData();
	const [selectedPostType, setSelectedPostType] = useState("text");
	const [canUserPost, setCanUserPost] = useState(true);
	const [selectedFile, setSelectedFile] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (communityData.currentCommunity) {
			if (communityData.currentCommunity.communityType === "public") {
				setCanUserPost(true);
				return;
			}
			for (const comSnippet of communityData.userCommunitySnippets) {
				if (
					comSnippet.communityName.toLowerCase() ===
					communityData.currentCommunity?.name.toLowerCase()
				) {
					setCanUserPost(true);
					return;
				}
			}
			setCanUserPost(false);
		}
	}, [communityData]);

	const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(false);
		setLoading(true);

		const formData = new FormData(event.target as HTMLFormElement);
		const postDocRef = doc(collection(firestore, "posts"));
		const newPost: Post = {
			id: postDocRef.id,
			communityId: communityId,
			communityLogoUrl: communityData.currentCommunity?.logoUrl || "",
			communityType: communityData.currentCommunity!.communityType,
			creatorId: currentUser.user.uid,
			creatorUsername: currentUser.user.displayName,
			title: formData.get("title") as string,
			body: description,
			imageUrl: "",
			commentsCount: 0,
			voteCount: 0,
			createdAt: serverTimestamp() as Timestamp,
		};

		try {
			// create post document in firestore
			const postDoc = await setDoc(postDocRef, newPost);

			// if image is included in post
			if (selectedFile) {
				// add image to cloud storage
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
				await uploadString(imageRef, selectedFile, "data_url");
				// get public download url for image
				const downloadUrl = await getDownloadURL(imageRef);

				// update downloadUrl in post document firestore
				await updateDoc(postDocRef, {
					imageUrl: downloadUrl,
				});
			}
			router.push(`/r/${communityId}`);
		} catch (error: any) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();
		reader.onload = (readerEvent) => {
			if (readerEvent.target?.result) {
				setSelectedFile(readerEvent.target.result as string);
			}
		};

		if (event.target.files?.[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}
	};

	if (!currentUser.user) {
		return <ErrorPage communityId={communityId} isUserNoSignedIn={true} />;
	} else if (!canUserPost) {
		return <ErrorPage communityId={communityId} isCommunityNotJoined={true} />;
	}
	return (
		<ChakraProvider theme={theme}>
			<Box flexGrow="1" backgroundColor="gray.300">
				<Flex
					maxWidth="1008px"
					width="full"
					margin="auto"
					padding="50px 16px 24px"
				>
					<Box flexGrow="1">
						<Text
							fontSize="18px"
							fontWeight="500"
							borderBottom="1px solid #FFF"
							padding="12px 0"
							marginBottom="12px"
						>
							Create a post
						</Text>
						<Box borderRadius="6px" overflow="hidden" background="#fff">
							<Box borderBottom="1px solid" borderBottomColor="gray.200">
								{postTypes.map((postType) => {
									return (
										<Button
											key={postType.name}
											fontSize="16px"
											fontWeight="400"
											height="50px"
											width="full"
											maxWidth="185px"
											backgroundColor="#FFF"
											_hover={{ backgroundColor: "gray.100" }}
											borderRadius="0"
											borderBottom="3px #0079d3"
											borderRight="1px solid"
											borderRightColor="gray.200"
											borderBottomStyle={
												postType.name.toLowerCase() ===
												selectedPostType.toLowerCase()
													? "solid"
													: "none"
											}
											onClick={() =>
												setSelectedPostType(postType.name.toLowerCase())
											}
										>
											{postType.name}
										</Button>
									);
								})}
							</Box>
							<Box padding="16px">
								<form onSubmit={handleCreatePost}>
									<Input
										type="text"
										maxLength={300}
										isRequired
										name="title"
										placeholder="Title"
										fontSize="14px"
										fontWeight="400"
										padding="8px 16px"
										border="1px solid"
										borderColor="gray.300"
										_focusVisible={{ borderColor: "#000" }}
									/>
									{selectedPostType.toLowerCase() === "text" && (
										<Textarea
											placeholder="Text (optional)"
											rows={6}
											name="description"
											value={description}
											onChange={(res) => setDescription(res.target.value)}
											fontSize="14px"
											fontWeight="400"
											padding="8px 16px"
											marginTop="16px"
											border="1px solid"
											borderColor="gray.300"
											_focusVisible={{ borderColor: "#000" }}
										/>
									)}
									{selectedPostType.toLowerCase() === "images" && (
										<Flex
											padding="16px"
											marginTop="16px"
											border="1px solid"
											borderColor="gray.300"
											borderRadius="4px"
											height="280px"
											flexDirection="column"
											justifyContent="center"
											alignItems="center"
										>
											{selectedFile && (
												<Image
													src={selectedFile}
													alt={""}
													width={300}
													height={170}
													objectFit="contain"
													objectPosition="center"
												></Image>
											)}
											<Box marginTop="16px">
												<Button
													borderRadius="2rem"
													padding="0 16px"
													backgroundColor="#fff"
													color="#0079d3"
													border="1px solid #0079d3"
													width="100px"
													onClick={() => fileInputRef.current?.click()}
												>
													{selectedFile ? "Change" : "Upload"}
												</Button>
												<input
													id="file-upload"
													type="file"
													accept="image/x-png,image/gif,image/jpeg"
													hidden
													ref={fileInputRef}
													onChange={onSelectImage}
												/>
												{selectedFile && (
													<Button
														borderRadius="2rem"
														padding="0 16px"
														marginLeft="16px"
														backgroundColor="#ffff"
														color="#0079d3"
														border="1px solid #0079d3"
														width="100px"
														onClick={() => setSelectedFile("")}
													>
														Remove
													</Button>
												)}
											</Box>
										</Flex>
									)}
									{error && (
										<Alert status="error" height="36px" marginTop="12px">
											<AlertIcon />
											<AlertDescription>
												An error occured while creating post.
											</AlertDescription>
										</Alert>
									)}
									<Box
										display="flex"
										justifyContent="flex-end"
										marginTop="16px"
									>
										<Button
											type="submit"
											borderRadius="2rem"
											padding="0 16px"
											backgroundColor="blue.400"
											_hover={{ backgroundColor: "#0079d3" }}
											color="#fff"
											width="120px"
											isDisabled={
												selectedPostType.toLowerCase() == "images" &&
												!selectedFile
											}
											isLoading={loading}
										>
											Post
										</Button>
									</Box>
								</form>
							</Box>
						</Box>
					</Box>
					<AboutCommunity
						communityData={communityData.currentCommunity}
					></AboutCommunity>
				</Flex>
			</Box>
		</ChakraProvider>
	);
};

export default CreatePostPage;
