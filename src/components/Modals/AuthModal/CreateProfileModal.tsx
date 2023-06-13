import React, { FunctionComponent, useEffect, useState } from "react";
import {
	Modal,
	ModalContent,
	ModalOverlay,
	ModalCloseButton,
	ModalBody,
	Heading,
	Text,
	Button,
	Flex,
	Input,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	useCreateUserWithEmailAndPassword,
	useUpdateProfile,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { UserCredential } from "@firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { userAtom } from "@/atoms/userAtom";

interface CreateProfileModalProps {}

const CreateProfileModal: FunctionComponent<CreateProfileModalProps> = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [userInput, setUserInput] = useState({ username: "", password: "" });
	const [createUserWithEmailAndPassword, user, loading, userError] =
		useCreateUserWithEmailAndPassword(auth);
	const [updateProfile, updating, updateError] = useUpdateProfile(auth);
	const [currentUser, setCurrentUser] = useRecoilState(userAtom);

	useEffect(() => {
		setUserInput({
			username: "",
			password: "",
		});
	}, [modalState]);

	useEffect(() => {
		if (currentUser.user) {
			setModalState((prevState) => ({
				...prevState,
				open: false,
			}));
		}
	}, [currentUser, setModalState]);

	const handleClose = () => {
		setModalState((prevState) => ({
			...prevState,
			open: false,
		}));
	};

	const handleUsernameChange = (event: { target: { value: any } }) => {
		setUserInput((prevState) => ({
			...prevState,
			username: event.target.value,
		}));
	};

	const handlePasswordChange = (event: { target: { value: any } }) => {
		setUserInput((prevState) => ({
			...prevState,
			password: event.target.value,
		}));
	};

	const goToSignup = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "signup",
		}));
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		//	create a user in firebase
		createUserWithEmailAndPassword(
			modalState.user.email,
			userInput.password
		).then((res?: UserCredential) => {
			if (res?.user) {
				// update display name of firebase user to username
				updateProfile({ displayName: userInput.username }).then((val) => {
					if (val) {
						// add firebase user to firestore
						setDoc(
							doc(firestore, "users", res?.user.uid!),
							JSON.parse(JSON.stringify(res?.user))
						).then(() => {
							// retreive user document from firestore and set to global user
							const userDocRef = doc(firestore, "users", res?.user.uid);
							getDoc(userDocRef).then((arg) => {
								if (arg.exists()) {
									setCurrentUser({ user: arg.data() });
								}
							});
						});
					}
				});
			}
		});
	};

	return (
		<>
			<Modal
				isOpen={modalState.open && modalState.view === "createProfile"}
				onClose={handleClose}
				isCentered
			>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="auto"
					backdropBlur="5px"
				/>
				<ModalContent
					width="auto"
					borderRadius="12px"
					maxWidth="600px"
					height="min(640px, calc(100vh - 84px))"
					overflowY="auto"
					overflowX="hidden"
					marginTop="60px"
					marginBottom="18px"
				>
					<Flex
						direction="column"
						width="400px"
						minHeight="640px"
						padding="30px 60px"
					>
						<ModalCloseButton
							color="#878a8c"
							_hover={{ backgroundColor: "#FFFF" }}
						/>
						<ModalBody padding="0 0">
							<Flex
								flexDirection="column"
								justifyContent="center"
								height="full"
								position="relative"
							>
								<Button
									position="absolute"
									onClick={goToSignup}
									top="0"
									left="0"
									padding="0"
									backgroundColor="#FFFF"
									_hover={{ backgroundColor: "#FFFF" }}
								>
									<ArrowBackIcon boxSize={6} color="#787c7e"></ArrowBackIcon>
								</Button>
								<form onSubmit={handleFormSubmit}>
									<div>
										<Heading as="h1" fontSize="20px" fontWeight="500">
											Create your username and password
										</Heading>
										<Text fontSize="12px" marginTop="8px">
											Reddit is anonymous, so your username is what you’ll go by
											here. Choose wisely—because once you get a name, you can’t
											change it.
										</Text>
									</div>
									<div>
										<Input
											placeholder="Username"
											type="text"
											value={userInput["username"]}
											_placeholder={{
												fontSize: "14px",
												fontWeight: "500",
												color: "#787c7e",
											}}
											padding="15px"
											fontSize="14px"
											borderRadius="2rem"
											border="0px"
											marginTop="28px"
											backgroundColor="#f6f7f8"
											_hover={{ border: "1px solid #00000033" }}
											_focusVisible={{ border: "1px solid #00000033" }}
											onChange={handleUsernameChange}
										></Input>
										<Input
											placeholder="Password"
											type="password"
											value={userInput["password"]}
											_placeholder={{
												fontSize: "14px",
												fontWeight: "500",
												color: "#787c7e",
											}}
											padding="15px"
											fontSize="14px"
											borderRadius="2rem"
											border="0px"
											marginTop="16px"
											backgroundColor="#f6f7f8"
											_hover={{ border: "1px solid #00000033" }}
											_focusVisible={{ border: "1px solid #00000033" }}
											onChange={handlePasswordChange}
										></Input>
									</div>
									{(userError || updateError) && (
										<Text fontSize="12px" marginTop="16px" color="red.400">
											{FIREBASE_ERRORS[
												userError?.code
													.split("/")
													.pop() as keyof typeof FIREBASE_ERRORS
											] ||
												updateError?.message ||
												userError?.message}
										</Text>
									)}
									<Button
										type="submit"
										isLoading={loading || updating}
										fontSize="14px"
										fontWeight="700"
										backgroundColor="#FF4500"
										width="full"
										color="#FFFF"
										borderRadius="2rem"
										height="40px"
										marginTop="28px"
										_hover={{ backgroundColor: "#FF4500" }}
										isDisabled={
											userInput["username"] === "" ||
											userInput["password"] === ""
										}
										_disabled={{ backgroundColor: "#F7D8CC" }}
									>
										Sign Up
									</Button>
								</form>
							</Flex>
						</ModalBody>
					</Flex>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreateProfileModal;
