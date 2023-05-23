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
import { useCreateUserWithEmailAndPassword, useUpdateProfile, useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";

interface CreateProfileModalProps {}

const CreateProfileModal: FunctionComponent<CreateProfileModalProps> = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [userInput, setUserInput] = useState({ username: "", password: "" });
	const [createUserWithEmailAndPassword, user, loading, userError] =
		useCreateUserWithEmailAndPassword(auth);
		const [updateProfile, updating, updateError] = useUpdateProfile(auth);
		const [signedInUser, userLoading, userFetchError] = useAuthState(auth);

		useEffect(() => {
			setUserInput({
				username: "",
				password: "",
			});
		}, [modalState]);

		useEffect(() => {
			if(signedInUser) {
				setModalState((prevState) => ({
					...prevState,
					open: false
				}))
			}
		}, [signedInUser]);

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
		createUserWithEmailAndPassword(modalState.user.email, userInput.password).then((res) => {
			updateProfile({displayName: userInput.username});
		});
	};

	return (
		<>
			<Modal
				isOpen={modalState.open && modalState.view === "createProfile"}
				onClose={handleClose}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					width="400px"
					height="640px"
					borderRadius="12px"
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
										{FIREBASE_ERRORS[userError?.code.split("/").pop() as keyof typeof FIREBASE_ERRORS] || updateError?.message || userError?.message}
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
										userInput["username"] === "" || userInput["password"] === ""
									}
									_disabled={{ backgroundColor: "#F7D8CC" }}
								>
									Sign Up
								</Button>
							</form>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreateProfileModal;
