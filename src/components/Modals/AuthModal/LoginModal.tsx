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
	useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { UserCredential } from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { userAtom } from "@/atoms/userAtom";

interface LoginModalProps {}

const LoginModal: FunctionComponent<LoginModalProps> = () => {
	const [userCredentials, setUserCredentials] = useState({
		email: "",
		password: "",
	});
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [signInWithGoogle, googleUser, googleLoading, googleSignInError] =
		useSignInWithGoogle(auth);
	const [signInWithApple, appleUser, appleLoading, appleSignInError] =
		useSignInWithApple(auth);
	const [
		signInWithEmailAndPassword,
		emailSignInUser,
		emailSignInLoading,
		emailSignInError,
	] = useSignInWithEmailAndPassword(auth);
	const [currentUser, setCurrentUser] = useRecoilState(userAtom);

	useEffect(() => {
		setUserCredentials({
			email: "",
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

	const handleEmailChange = (event: { target: { value: any } }) => {
		setUserCredentials((prevState) => ({
			...prevState,
			email: event.target.value,
		}));
	};

	const handlePasswordChange = (event: { target: { value: any } }) => {
		setUserCredentials((prevState) => ({
			...prevState,
			password: event.target.value,
		}));
	};

	const goToSignUp = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "signup",
		}));
	};

	const goToResetPassword = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "resetPassword",
		}));
	};

	const handleGoogleSignIn = () => {
		signInWithGoogle().then((res?: UserCredential) => {
			setDoc(
				doc(firestore, "users", res?.user.uid!),
				JSON.parse(JSON.stringify(res?.user))
			);
		});
	};

	const handleAppleSignIn = () => {
		signInWithApple().then((res?: UserCredential) => {
			setDoc(
				doc(firestore, "users", res?.user.uid!),
				JSON.parse(JSON.stringify(res?.user))
			);
		});
	};

	const handleSignInWithEmail = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		signInWithEmailAndPassword(userCredentials.email, userCredentials.password);
	};

	const isFormValid = () => {
		const regEx =
			/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		return (
			userCredentials["email"] != "" &&
			userCredentials["password"] != "" &&
			regEx.test(userCredentials["email"])
		);
	};

	return (
		<>
			<Modal
				isOpen={modalState.open && modalState.view === "login"}
				onClose={handleClose}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					width="auto"
					borderRadius="12px"
					maxWidth="600px"
					height="min(640px, calc(100vh - 84px))"
					overflow="auto"
					marginTop="60px"
					marginBottom="18px"
				>
					<Flex
						direction="column"
						width="400px"
						minHeight="600px"
						padding="80px 60px 50px 60px"
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
										Log In
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
									{googleSignInError && (
										<Text fontSize="12px" marginTop="8px" color="red.400">
											{FIREBASE_ERRORS[
												googleSignInError?.code
													.split("/")
													.pop() as keyof typeof FIREBASE_ERRORS
											] || googleSignInError.message}
										</Text>
									)}
									<Button
										padding="12px"
										border="1px solid #dadce0"
										borderRadius="2rem"
										width="full"
										justifyContent="start"
										backgroundColor="#FFFF"
										_hover={{ backgroundColor: "gray.100" }}
										marginTop="8px"
										isLoading={appleLoading}
										onClick={handleAppleSignIn}
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
									{appleSignInError && (
										<Text fontSize="12px" marginTop="8px" color="red.400">
											{FIREBASE_ERRORS[
												appleSignInError?.code
													.split("/")
													.pop() as keyof typeof FIREBASE_ERRORS
											] || appleSignInError.message}
										</Text>
									)}
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
								<form
									onSubmit={handleSignInWithEmail}
									style={{ display: "flex", flexDirection: "column" }}
								>
									<div>
										<Input
											placeholder="Email"
											value={userCredentials["email"]}
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
											autoFocus={true}
											onChange={handleEmailChange}
										></Input>
										<Input
											placeholder="Password"
											type="password"
											value={userCredentials["password"]}
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
											marginTop="16px"
											onChange={handlePasswordChange}
										></Input>
										{emailSignInError && (
											<Text fontSize="12px" marginTop="12px" color="red.400">
												{FIREBASE_ERRORS[
													emailSignInError?.code
														.split("/")
														.pop() as keyof typeof FIREBASE_ERRORS
												] || emailSignInError.message}
											</Text>
										)}
									</div>
									<Text fontSize="12px" marginTop="16px">
										Forgot your{" "}
										<Text
											color="#0079d3"
											fontWeight="700"
											as="u"
											onClick={goToResetPassword}
											cursor="pointer"
										>
											password
										</Text>
										?
									</Text>
									<Button
										type="submit"
										fontSize="14px"
										fontWeight="700"
										backgroundColor="#FF4500"
										color="#FFFF"
										borderRadius="2rem"
										height="40px"
										marginTop="24px"
										_hover={{ backgroundColor: "#FF4500" }}
										isDisabled={!isFormValid()}
										_disabled={{ backgroundColor: "#F7D8CC" }}
										isLoading={emailSignInLoading}
									>
										Log In
									</Button>
								</form>
								<Text fontSize="12px">
									New to Reddit?{" "}
									<Text
										color="#0079d3"
										fontWeight="700"
										as="u"
										onClick={goToSignUp}
										cursor="pointer"
									>
										Sign Up
									</Text>
								</Text>
							</Flex>
						</ModalBody>
					</Flex>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LoginModal;
