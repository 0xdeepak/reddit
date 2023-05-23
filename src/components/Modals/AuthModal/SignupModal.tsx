import React, { FunctionComponent, useState } from "react";
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
	Box,
	Input,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import GoogleLogo from "public/images/icons/google.svg";
import {
	useSignInWithGoogle,
	useSignInWithApple,
} from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";

interface SignupModalProps {}

const SignupModal: FunctionComponent<SignupModalProps> = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [signInWithGoogle, googoleUser, googleLoading, googleSignInError] =
		useSignInWithGoogle(auth);
	const [signInWithApple, appleUser, appleLoading, appleSignInError] =
		useSignInWithApple(auth);
	const [email, setEmail] = useState("");

	const handleClose = () => {
		setModalState((prevState) => ({
			...prevState,
			open: false,
		}));
	};

	const goToLogIn = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "login",
		}));
	};

	const handleEmailChange = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setEmail(event.target.value);
	};

	const handleEmailSignup = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "createProfile",
			user: {
				...prevState.user,
				email: email,
			},
		}));
	};

	const handleGoogleSignIn = () => {
		signInWithGoogle();
	};

	const handleAppleSignIn = () => {
		signInWithApple();
	};

	const isEmailValid = () => {
		const regEx =
			/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		return email != "" && regEx.test(email);
	};

	return (
		<>
			<Modal
				isOpen={modalState.open && modalState.view === "signup"}
				onClose={handleClose}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					width="400px"
					height="640px"
					borderRadius="12px"
					padding="100px 60px"
				>
					<ModalCloseButton
						color="#878a8c"
						_hover={{ backgroundColor: "#FFFF" }}
					/>
					<ModalBody padding="0 0">
						<Flex
							flexDirection="column"
							justifyContent="space-between"
							height="full"
						>
							<div>
								<Heading as="h1" fontSize="20px" fontWeight="500">
									Sign Up
								</Heading>
								<Text fontSize="12px" marginTop="8px">
									By continuing, you are setting up a Reddit account and agree
									to our User Agreement and Privacy Policy.
								</Text>
							</div>
							<div>
								<Button
									padding="12px"
									border="1px solid #dadce0"
									borderRadius="2rem"
									width="full"
									justifyContent="start"
									backgroundColor="#FFFF"
									_hover={{ backgroundColor: "gray.100" }}
									isLoading={googleLoading}
									onClick={handleGoogleSignIn}
								>
									<Image src={GoogleLogo} alt="Google Logo" height={18} />
									<Box flex="1" textAlign="center">
										<Text fontSize="14px" fontWeight="500">
											Continue with Google
										</Text>
									</Box>
								</Button>
								<Button
									onClick={handleAppleSignIn}
									padding="12px"
									border="1px solid #dadce0"
									borderRadius="2rem"
									width="full"
									justifyContent="start"
									backgroundColor="#FFFF"
									_hover={{ backgroundColor: "gray.100" }}
									marginTop="8px"
									isLoading={appleLoading}
								>
									<Image
										src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
										alt="Google Logo"
										height={18}
										width="18"
									/>
									<Box flex="1" textAlign="center">
										<Text fontSize="14px" fontWeight="500">
											Continue with Apple
										</Text>
									</Box>
								</Button>
							</div>
							<Flex alignItems="center" justifyContent="space-between">
								<span
									style={{ border: "1px solid #edeff1", width: "40%" }}
								></span>
								<Text fontSize="14px" fontWeight="700" color="#787c7e">
									OR
								</Text>
								<span
									style={{ border: "1px solid #edeff1", width: "40%" }}
								></span>
							</Flex>
							<Input
								placeholder="Email"
								value={email}
								_placeholder={{
									fontSize: "14px",
									fontWeight: "500",
									color: "#787c7e",
								}}
								padding="15px"
								fontSize="14px"
								borderRadius="2rem"
								border="0px"
								backgroundColor="#f6f7f8"
								_hover={{ border: "1px solid #00000033" }}
								_focusVisible={{ border: "1px solid #00000033" }}
								onChange={handleEmailChange}
							></Input>
							<Button
								fontSize="14px"
								fontWeight="700"
								backgroundColor="#FF4500"
								color="#FFFF"
								borderRadius="2rem"
								height="40px"
								_hover={{ backgroundColor: "#FF4500" }}
								isDisabled={!isEmailValid()}
								_disabled={{ backgroundColor: "#F7D8CC" }}
								onClick={handleEmailSignup}
							>
								Continue
							</Button>
							<Text fontSize="12px">
								Already a redditor?{" "}
								<Text
									color="#0079d3"
									fontWeight="700"
									as="u"
									onClick={goToLogIn}
									cursor="pointer"
								>
									Log In
								</Text>
							</Text>
							{(googleSignInError || appleSignInError) && (
								<Text fontSize="12px" color="red.400">
									{FIREBASE_ERRORS[
										googleSignInError?.code
											.split("/")
											.pop() as keyof typeof FIREBASE_ERRORS
									] ||
										FIREBASE_ERRORS[
											appleSignInError?.code
												.split("/")
												.pop() as keyof typeof FIREBASE_ERRORS
										] ||
										googleSignInError?.message ||
										appleSignInError?.message}
								</Text>
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default SignupModal;
