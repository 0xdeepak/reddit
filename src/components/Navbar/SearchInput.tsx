import { FunctionComponent, useState } from "react";
import {
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Input,
	Flex,
} from "@chakra-ui/react";
import { Search2Icon, SmallCloseIcon } from "@chakra-ui/icons";

interface SearchInputProps {}

const SearchInput: FunctionComponent<SearchInputProps> = () => {
	const [searchString, setSearchString] = useState("");

	return (
		<InputGroup
			margin="0 16px"
			flexGrow={1}
			alignItems="center"
			width="auto"
			maxWidth="654px"
		>
			<InputLeftElement pointerEvents="none">
				<Search2Icon color="gray.300"></Search2Icon>
			</InputLeftElement>
			<Input
				placeholder="Search Reddit"
				type="text"
				fontSize="14px"
				color="#1c1c1c"
				backgroundColor={searchString.length > 0 ? "#FFFF" : "#F6F7F8"}
				border="1px solid #EDEFF1"
				borderRadius="2em"
				value={searchString}
				onChange={(event) => {
					setSearchString(event.target.value);
				}}
				_hover={{ backgroundColor: "#FFFF", border: "1px solid #0079D3" }}
				_focusWithin={{ backgroundColor: "#FFFF", border: "0px" }}
			/>
			<InputRightElement>
				<Flex
					border="1px solid"
					borderRadius="1.5em"
					height="20px"
					width="20px"
					justifyContent="center"
					alignItems="center"
					visibility={searchString.length > 0 ? "visible" : "hidden"}
				>
					<button
						onClick={() => {
							setSearchString("");
						}}
					>
						<SmallCloseIcon marginBottom="4px"></SmallCloseIcon>
					</button>
				</Flex>
			</InputRightElement>
		</InputGroup>
	);
};

export default SearchInput;
