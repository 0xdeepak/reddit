import { Post } from "@/atoms/postAtom";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { BsFire, BsRocketFill } from "react-icons/bs";

interface SortPostsProps {
	defaultType: string;
	posts: Post[];
	onSort: (posts: Post[]) => void;
}

const SortPosts: FunctionComponent<SortPostsProps> = ({
	posts,
	onSort,
	defaultType,
}) => {
	const [sortType, setSortType] = useState(defaultType);

	const changeSorting = (type: string) => {
		const updatedPosts = [...posts];
		updatedPosts.sort((postA, postB) => {
			if (type === "new") {
				return postB.createdAt.seconds - postA.createdAt.seconds;
			} else if (type === "top") {
				return postB.voteCount - postA.voteCount;
			}
			return 0;
		});
		setSortType(type);
		onSort(updatedPosts);
	};

	useEffect(() => {
		setSortType(defaultType);
	}, [defaultType]);

	return (
		<Flex
			marginBottom="20px"
			borderRadius="6px"
			backgroundColor="#fff"
			padding="10px 12px 10px 0"
			justifyContent="left"
			flexDirection={defaultType === "new" ? "row" : "row-reverse"}
		>
			<Button
				height="36px"
				padding="0 14px"
				width="auto"
				marginLeft="12px"
				backgroundColor={sortType === "new" ? "gray.100" : "#fff"}
				onClick={() => changeSorting("new")}
			>
				<Icon
					as={BsFire}
					height="22px"
					width="22px"
					color={sortType === "new" ? "#0079d3" : "gray.400"}
				/>
				<Text
					fontSize="14px"
					fontWeight="600"
					color={sortType === "new" ? "#0079d3" : "gray.400"}
				>
					&nbsp;New
				</Text>
			</Button>
			<Button
				height="36px"
				padding="0 14px"
				width="auto"
				marginLeft="12px"
				backgroundColor={sortType === "top" ? "gray.100" : "#fff"}
				onClick={() => changeSorting("top")}
			>
				<Icon
					as={BsRocketFill}
					height="22px"
					width="22px"
					color={sortType === "top" ? "#0079d3" : "gray.400"}
				/>
				<Text
					fontSize="14px"
					fontWeight="600"
					color={sortType === "top" ? "#0079d3" : "gray.400"}
				>
					&nbsp;Top
				</Text>
			</Button>
		</Flex>
	);
};

export default SortPosts;
