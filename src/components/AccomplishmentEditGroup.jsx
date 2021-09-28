import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
// import { useState } from "react";
// import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import GroupIndexer from "./GroupIndexer";

export default function AccomplishmentEditGroup(props) {
	// const [editorState, setEditorState] = useState(() =>
	// 	EditorState.createEmpty()
	// );

	// const onEditorStateChange = () => {};

	return (
		<Stack spacing={2} direction='row'>
			<GroupIndexer parentProps={props}></GroupIndexer>
			<Stack
				spacing={2}
				direction='column'
				sx={{
					width: "calc(100% - 38px)",
				}}
			>
				<Stack spacing={2} direction='row'>
					<TextField
						variant='outlined'
						required
						label='Title'
						name={`*obj-in-array;${props.groupKey};title;${props.index}`}
						value={props.value.title}
						onInput={props.handleInputChange}
						sx={{
							width: "50%",
						}}
					/>
					<TextField
						variant='outlined'
						type='number'
						required
						label='Hours'
						name={`*obj-in-array;${props.groupKey};hours;${props.index}`}
						value={props.value.hours}
						onInput={props.handleInputChange}
						sx={{
							width: "50%",
						}}
					/>
				</Stack>
				{/* <Editor
					editorClassName='react-draft-wysiwyg-editor'
					editorState={editorState}
					onChange={onEditorStateChange}
				/> */}
				<TextField
					variant='outlined'
					multiline
					rows={4}
					required
					label='Description'
					name={`*obj-in-array;${props.groupKey};description;${props.index}`}
					value={props.value.description}
					onInput={props.handleInputChange}
				/>
			</Stack>
		</Stack>
	);
}
