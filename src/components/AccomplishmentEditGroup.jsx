import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getDefaultKeyBinding, KeyBindingUtil } from "draft-js";

import GroupIndexer from "./GroupIndexer";

const { hasCommandModifier } = KeyBindingUtil;

export default function AccomplishmentEditGroup(props) {
	let initialDescriptionState = null;
	if (!!props.value.description) {
		const blocksFromHtml = htmlToDraft(props.value.description);
		const { contentBlocks, entityMap } = blocksFromHtml;
		const contentState = ContentState.createFromBlockArray(
			contentBlocks,
			entityMap
		);
		initialDescriptionState = EditorState.createWithContent(contentState);
	}

	const [editorState, setEditorState] = useState(
		initialDescriptionState ?? EditorState.createEmpty()
	);

	const keyBindings = (e) => {
		if (!hasCommandModifier(e)) return;

		switch (e.keyCode) {
			case 83: // S
				e.preventDefault(); // Block page save
				break;
			default:
				return getDefaultKeyBinding(e);
		}
	};

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
						InputProps={{
							inputProps: {
								max: 100,
								min: 0,
							},
						}}
					/>
				</Stack>
				<Editor
					spellCheck={true}
					editorState={editorState}
					toolbarClassName='toolbarClassName'
					wrapperClassName='wrapperClassName'
					editorClassName='editorClassName'
					stripPastedStyles={true}
					toolbar={{
						options: [
							"inline",
							"fontSize",
							"list",
							"textAlign",
							"colorPicker",
							"link",
							"image",
							"embedded",
							"history",
						],
					}}
					// keyBindingFn={keyBindings}
					onEditorStateChange={(newSate) => {
						setEditorState(newSate);
						props.handleInputChange({
							target: {
								name: `*obj-in-array;${props.groupKey};description;${props.index}`,
								value: draftToHtml(
									convertToRaw(newSate.getCurrentContent())
								),
							},
						});
					}}
				/>
			</Stack>
		</Stack>
	);
}
