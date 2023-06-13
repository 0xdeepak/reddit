import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";

interface NewCommmentProps {
	onCreateComment: (text: string) => Promise<void>;
	username: string | null;
}

const NewCommment: FunctionComponent<NewCommmentProps> = ({
	onCreateComment,
	username,
}) => {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleCreateComment = async () => {
		setLoading(true);
		await onCreateComment(text);
		setText("");
		setLoading(false);
	};

	if (!username) {
		return (
			<Text margin="24px 0" fontSize="14px" fontWeight="500" textAlign="center">
				Please Login or Signup to Leave a Comment
			</Text>
		);
	}

	return (
		<Box padding="24px 48px">
			<Text fontSize="12px" fontWeight="400" marginBottom="8px">
				{"Comment as "}
				<span style={{ fontWeight: "600" }}>{username}</span>
			</Text>
			<Box
				border="1px solid"
				borderRadius="6px"
				overflow="hidden"
				borderColor="gray.300"
				_focusWithin={{ borderColor: "gray.900" }}
			>
				<Textarea
					placeholder="What are your thoughts?"
					rows={5}
					name="comment-input"
					value={text}
					onChange={(res) => setText(res.target.value)}
					fontSize="14px"
					fontWeight="400"
					padding="8px 16px"
					border="none"
					_focusVisible={{ borderStyle: "none" }}
				/>
				<Flex
					padding="6px"
					justifyContent="flex-end"
					backgroundColor="gray.100"
				>
					<Button
						width="auto"
						minWidth="auto"
						height="30px"
						fontSize="14px"
						borderRadius="2rem"
						padding="0 16px"
						backgroundColor="#0079d3"
						_hover={{ backgroundColor: "#0079d3" }}
						color="#fff"
						onClick={handleCreateComment}
						isDisabled={!text}
						isLoading={loading}
					>
						Comment
					</Button>
				</Flex>
			</Box>
		</Box>
	);
};

export default NewCommment;
