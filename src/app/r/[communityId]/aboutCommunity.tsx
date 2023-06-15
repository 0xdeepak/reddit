import { Community } from "@/atoms/communityAtom";
import AboutCommSkeleton from "@/components/Community/AboutCommSkeleton";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent, useRef, useState } from "react";

interface AboutCommunityProps {
	communityData: Community | null;
	communityId: string;
	userRole: string;
}

const AboutCommunity: FunctionComponent<AboutCommunityProps> = ({
	communityData,
	communityId,
	userRole,
}) => {
	const { changeCommunityLogo, changeCommunityBanner } = useCommunityData();
	const [selectedFile, setSelectedFile] = useState({
		type: "",
		value: "",
	});
	const [changingLogo, setChangingLogo] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSelectFile = (
		event: React.ChangeEvent<HTMLInputElement>,
		type: string
	) => {
		const reader = new FileReader();
		reader.onload = (readerEvent) => {
			if (readerEvent.target?.result) {
				setSelectedFile({
					type: type,
					value: readerEvent.target.result as string,
				});
			}
		};

		if (event.target.files?.[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}
	};

	const saveFileChange = async (type: string) => {
		setChangingLogo(true);
		if (type === "logo") {
			await changeCommunityLogo(selectedFile.value, communityId);
		} else if (type === "banner") {
			await changeCommunityBanner(selectedFile.value, communityId);
		}
		setChangingLogo(false);
		setSelectedFile({
			type: "",
			value: "",
		});
	};

	if (!communityData) {
		return <AboutCommSkeleton />;
	}
	return (
		<Box
			width="302px"
			display={{ base: "none", lg: "block" }}
			marginLeft="24px"
			flexShrink="0"
		>
			<Box
				borderRadius="6px"
				overflow="hidden"
				backgroundColor="#fff"
				border="1px solid"
				borderColor="gray.400"
				marginBottom="20px"
			>
				<Box padding="12px" backgroundColor="#0079d3">
					<Text fontSize="14px" fontWeight="600" color="#FFF">
						About Community
					</Text>
				</Box>
				<Box padding="0 12px">
					<Text fontSize="14px" padding="12px 0px">
						{communityData?.about || "-"}
					</Text>
					<Flex marginBottom="12px" alignItems="center">
						<Text
							fontSize="12px"
							fontWeight="600"
							borderRadius="2rem"
							padding="3px 8px"
							color="blue.500"
							backgroundColor="blue.100"
						>
							{communityData.communityType.charAt(0).toUpperCase() +
								communityData.communityType.slice(1)}
						</Text>
						{communityData.isNsfw && (
							<Text
								fontSize="12px"
								fontWeight="600"
								borderRadius="2rem"
								padding="2px 8px"
								color="red.400"
								backgroundColor="red.100"
								marginLeft="8px"
							>
								NSFW
							</Text>
						)}
					</Flex>
					<Text
						fontSize="14px"
						color="gray.5 00"
						fontWeight="500"
						paddingBottom="12px"
						borderBottom="1px solid"
						borderColor="gray.200"
					>
						Created{" "}
						{communityData?.createdAt.toDate().toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</Text>
					<Flex padding="12px 0" borderBottom="1px" borderColor="gray.200">
						<Flex direction="column" alignItems="center">
							<Text fontSize="16px" fontWeight="600">
								{communityData?.membersCount}
							</Text>
							<Text fontSize="12px" color="gray.500">
								Members
							</Text>
						</Flex>
					</Flex>
					<Link href={`/r/${communityId}/submit`}>
						<Button
							fontSize="14px"
							color="#FFF"
							fontWeight="700"
							height="32px"
							width="full"
							backgroundColor="#0079d3"
							_hover={{ backgroundColor: "#0079d3" }}
							borderRadius="2rem"
							margin="12px 0"
						>
							Create Post
						</Button>
					</Link>
				</Box>
			</Box>
			{userRole === "admin" && (
				<Box
					borderRadius="6px"
					overflow="hidden"
					backgroundColor="#fff"
					border="1px solid"
					borderColor="gray.400"
					padding="0 12px 12px"
				>
					<Text fontSize="14px" fontWeight="600" marginTop="12px">
						Admin
					</Text>
					<Flex
						justifyContent={"space-between"}
						alignItems="center"
						margin="8px 0"
					>
						<Text
							fontSize="14px"
							color="blue.500"
							cursor="pointer"
							_hover={{ textDecoration: "underline" }}
							onClick={() => document.getElementById("logo-upload")?.click()}
						>
							Change Logo
						</Text>
						<input
							id="logo-upload"
							type="file"
							accept="image/x-png,image/gif,image/jpeg"
							hidden
							ref={fileInputRef}
							onChange={(event) => handleSelectFile(event, "logo")}
						/>
						<Image
							alt="community logo"
							src={
								(selectedFile.type === "logo" && selectedFile.value) ||
								communityData.logoUrl ||
								"/images/redditUserLogo.svg"
							}
							borderRadius="100%"
							border="1px solid"
							borderColor="gray.400"
							objectFit="cover"
							objectPosition="center"
							backgroundColor="#fff"
							height="38px"
							width="38px"
						/>
					</Flex>
					{selectedFile.type === "logo" && selectedFile.value && (
						<Flex marginBottom="8px">
							<Text
								fontSize="14px"
								fontWeight="600"
								color="#0079d3"
								padding="0 8px"
								border="1px solid #0079d3"
								borderRadius="2rem"
								cursor="pointer"
								_hover={{ backgroundColor: "gray.100" }}
								onClick={() => saveFileChange("logo")}
							>
								{changingLogo ? "Saving.." : "Save"}
							</Text>
							<Text
								fontSize="14px"
								fontWeight="600"
								color="red.400"
								padding="0 8px"
								border="1px solid"
								borderColor="red.400"
								marginLeft="8px"
								borderRadius="2rem"
								cursor="pointer"
								_hover={{ backgroundColor: "gray.100" }}
								onClick={() => setSelectedFile({ type: "", value: "" })}
							>
								Discard{" "}
							</Text>
						</Flex>
					)}
					<Box>
						<Text
							fontSize="14px"
							color="blue.500"
							cursor="pointer"
							_hover={{ textDecoration: "underline" }}
							onClick={() => document.getElementById("banner-upload")?.click()}
						>
							Change Banner
						</Text>
						<input
							id="banner-upload"
							type="file"
							accept="image/x-png,image/gif,image/jpeg"
							hidden
							ref={fileInputRef}
							onChange={(event) => handleSelectFile(event, "banner")}
						/>
						{((selectedFile.type === "banner" && selectedFile.value) ||
							communityData.bannerUrl) && (
							<Image
								alt="community banner"
								src={
									(selectedFile.type === "banner" && selectedFile.value) ||
									communityData.bannerUrl
								}
								border="1px solid"
								borderColor="gray.400"
								objectFit="contain"
								objectPosition="center"
								backgroundColor="#fff"
								width="full"
								maxHeight="250px"
								margin="12px 0"
							/>
						)}
						{selectedFile.type === "banner" && selectedFile.value && (
							<Flex>
								<Text
									fontSize="14px"
									fontWeight="600"
									color="#0079d3"
									padding="0 8px"
									border="1px solid #0079d3"
									borderRadius="2rem"
									cursor="pointer"
									_hover={{ backgroundColor: "gray.100" }}
									onClick={() => saveFileChange("banner")}
								>
									{changingLogo ? "Saving.." : "Save"}
								</Text>
								<Text
									fontSize="14px"
									fontWeight="600"
									color="red.400"
									padding="0 8px"
									border="1px solid"
									borderColor="red.400"
									marginLeft="8px"
									borderRadius="2rem"
									cursor="pointer"
									_hover={{ backgroundColor: "gray.100" }}
									onClick={() => setSelectedFile({ type: "", value: "" })}
								>
									Discard{" "}
								</Text>
							</Flex>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default AboutCommunity;
