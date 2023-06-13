import {
	Box,
	Button,
	Checkbox,
	Flex,
	Input,
	InputGroup,
	InputLeftAddon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Stack,
	Text,
} from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { firestore } from "../../../firebase/clientApp";
import {
	doc,
	getDoc,
	serverTimestamp,
	runTransaction,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

interface CreateCommunityModalProps {
	user?: any | null;
	closeModal: () => void;
	closeWithNavigate: (arg0: any) => void;
}

const CreateCommunityModal: FunctionComponent<CreateCommunityModalProps> = (
	props
) => {
	const [communityName, setCommunityName] = useState("");
	const [radioValue, setRadioValue] = useState("public");
	const [checkboxValue, setCheckboxValue] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleCommunityNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCommunityName(event.target.value);
	};

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (error) {
			setError("");
		}
		const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (regex.test(communityName)) {
			setError("");
			return;
		}
		setIsLoading(true);
		try {
			const communityDocRef = doc(
				firestore,
				"communities",
				communityName.toLowerCase()
			);

			await runTransaction(firestore, async (transaction) => {
				// find community with given name in firestore
				const res = await transaction.get(communityDocRef);
				if (res.exists()) {
					throw new Error(
						`${communityName} is taken. Please try a different name.`
					);
				}

				// if not exists already, create a new community doc in firestore
				transaction.set(communityDocRef, {
					name: communityName,
					creatorId: props.user?.uid,
					createdAt: serverTimestamp(),
					membersCount: 1,
					communityType: radioValue,
					isNsfw: checkboxValue,
				});
				// add community to community-snippets sub collection of current user in firestore
				transaction.set(
					doc(
						firestore,
						`users/${props.user?.uid}/communitySnippets/`,
						communityName.toLowerCase()
					),
					{
						communityName: communityName,
						isModerator: true,
					}
				);
			});
			// close modal and navigate to community page
			props.closeWithNavigate(() => {
				router.push(`/r/${communityName}`);
			});
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		}
		setIsLoading(false);
	};

	return (
		<>
			<Modal
				isOpen={true}
				onClose={props.closeModal}
				closeOnOverlayClick={false}
				isCentered
			>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="auto"
					backdropBlur="5px"
				/>
				<ModalContent
					width="auto"
					height="min(500px, calc(100vh - 84px))"
					overflowY="auto"
					overflowX="hidden"
					marginTop="60px"
					marginBottom="18px"
					maxWidth="600px"
				>
					<form
						onSubmit={handleFormSubmit}
						style={{
							display: "flex",
							flexDirection: "column",
							width: "520px",
							minHeight: "500px",
						}}
					>
						<ModalHeader
							borderBottom="1px solid"
							borderColor="gray.300"
							marginBottom="16px"
							padding="16px"
							fontSize="16px"
						>
							Create a Community
						</ModalHeader>
						<Box onClick={props.closeModal}>
							<ModalCloseButton />
						</Box>
						<ModalBody padding="0px 16px">
							<Flex
								direction="column"
								justifyContent="space-between"
								height="full"
							>
								<div>
									<Text fontSize="16px" fontWeight="600">
										Name
									</Text>
									<Text fontSize="12px" fontWeight="400" color="gray.500">
										Community names including capitalization cannot be changed.
									</Text>
									<InputGroup marginTop="24px">
										<InputLeftAddon paddingRight="2px" backgroundColor="#FFFF">
											r/
										</InputLeftAddon>
										<Input
											required
											type="text"
											minLength={3}
											maxLength={21}
											placeholder=""
											paddingLeft="0"
											borderLeft="0px"
											value={communityName}
											onChange={handleCommunityNameChange}
											_focusVisible={{
												border: "1px solid rgb(226, 232, 240)",
												borderLeft: "0px",
											}}
										/>
									</InputGroup>
									{error != "" && (
										<Text color="red.300" fontSize="12px" marginTop="8px">
											{error
												? error
												: "Community name can't contain special characters."}
										</Text>
									)}
								</div>
								<div>
									<Text fontSize="16px" fontWeight="600" marginBottom="8px">
										Community type
									</Text>
									<RadioGroup onChange={setRadioValue} value={radioValue}>
										<Stack direction="column">
											<Radio value="public">
												<Flex alignItems="center">
													<Text
														fontSize="14px"
														fontWeight="600"
														marginRight="8px"
													>
														Public
													</Text>
													<Text
														fontSize="12px"
														fontWeight="400"
														color="gray.500"
													>
														Anyone can view, post, and comment to this community
													</Text>
												</Flex>
											</Radio>
											<Radio value="restricted">
												<Flex alignItems="center">
													<Text
														fontSize="14px"
														fontWeight="600"
														marginRight="8px"
													>
														Restricted
													</Text>
													<Text
														fontSize="12px"
														fontWeight="400"
														color="gray.500"
													>
														Anyone can view this community, but only approved
														users can post
													</Text>
												</Flex>
											</Radio>
											<Radio value="private">
												<Flex alignItems="center">
													<Text
														fontSize="14px"
														fontWeight="600"
														marginRight="8px"
													>
														Private
													</Text>
													<Text
														fontSize="12px"
														fontWeight="400"
														color="gray.500"
													>
														Only approved users can view and submit to this
														community
													</Text>
												</Flex>
											</Radio>
										</Stack>
									</RadioGroup>
								</div>
								<div>
									<Text fontSize="16px" fontWeight="600" marginBottom="8px">
										Adult content
									</Text>
									<Checkbox
										isChecked={checkboxValue}
										onChange={(e) => setCheckboxValue(e.target.checked)}
									>
										<Flex alignItems="center">
											<Text
												fontSize="12px"
												color="#FFFF"
												padding="0px 3px"
												backgroundColor="red.400"
												marginLeft="8px"
											>
												NSFW
											</Text>
											<Text fontSize="14px" fontWeight="600" marginLeft="8px">
												18+ year old community
											</Text>
										</Flex>
									</Checkbox>
								</div>
							</Flex>
						</ModalBody>

						<ModalFooter
							padding="16px"
							marginTop="16px"
							backgroundColor="gray.100"
						>
							<Button
								fontSize="14px"
								fontWeight="700"
								background="transparent"
								borderRadius="2rem"
								height="32px"
								border="1px solid #0079D3"
								onClick={props.closeModal}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								fontSize="14px"
								fontWeight="700"
								backgroundColor="#0079D3"
								borderRadius="2rem"
								height="32px"
								color="#FFFF"
								marginLeft="16px"
								_hover={{ backgroundColor: "#0079D3" }}
								isLoading={isLoading}
							>
								Create Community
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreateCommunityModal;
