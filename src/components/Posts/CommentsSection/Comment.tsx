import { Box, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import { FunctionComponent, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { BsArrowUpCircle, BsArrowDownCircle } from "react-icons/bs";

interface CommentProps {
	data: Comment;
	currentUserId: string;
	isAdmin: boolean;
	isOp: boolean;
	onDeleteComment: (value: Comment) => Promise<void>;
}

export interface Comment {
	id: string;
	creatorId: string;
	creatorUsername: string;
	communityId: string;
	postId: string;
	postTitle: string;
	text: string;
	createdAt: Timestamp;
}

const Comment: FunctionComponent<CommentProps> = ({
	data,
	currentUserId,
	isAdmin,
	isOp,
	onDeleteComment,
}) => {
	const [loading, setLoading] = useState(false);

	const handleDeleteComment = async () => {
		setLoading(true);
		await onDeleteComment(data);
		setLoading(false);
	};

	return (
		<Flex marginBottom="16px">
			<Icon
				as={FaReddit}
				height="28px"
				width="28px"
				color="gray.400"
				marginRight="8px"
			/>
			<Box flexGrow="1">
				<Flex alignItems="center">
					<Text fontSize="12px" fontWeight="600" margin="6px 0 8px">
						{data.creatorUsername}
						{isOp && (
							<span
								title="Original Poster"
								style={{ color: "rgb(0, 121, 211)", fontWeight: "700" }}
							>
								&nbsp;&nbsp;OP
							</span>
						)}
						<span
							style={{ fontWeight: "400", color: "#718096", marginLeft: "8px" }}
						>
							{DateTime.fromMillis(data.createdAt.toMillis()).toRelative()}
						</span>
					</Text>
					{loading && <Spinner size="xs" marginLeft="12px" color="gray.700" />}
				</Flex>
				<Text fontSize="14px">{data.text}</Text>
				<Flex alignItems="center" marginTop="8px">
					<Icon
						as={BsArrowUpCircle}
						height="16px"
						width="16px"
						color="gray.500"
						_hover={{ color: "gray.900" }}
					/>
					<Icon
						as={BsArrowDownCircle}
						height="16px"
						width="16px"
						marginLeft="8px"
						color="gray.500"
						_hover={{ color: "gray.900" }}
					/>
					{currentUserId === data.creatorId && (
						<Text
							fontSize="12px"
							cursor="pointer"
							color="gray.500"
							marginLeft="8px"
							_hover={{ color: "gray.900" }}
						>
							Edit
						</Text>
					)}
					{(currentUserId === data.creatorId || isAdmin) && (
						<Text
							fontSize="12px"
							cursor="pointer"
							color="gray.500"
							marginLeft="8px"
							_hover={{ color: "gray.900" }}
							onClick={handleDeleteComment}
						>
							Delete
						</Text>
					)}
				</Flex>
			</Box>
		</Flex>
	);
};

export default Comment;
