import { Stack, TextField } from "@mui/material";

import GroupIndexer from "./GroupIndexer";

export default function ObstacleEditGroup(props) {
	return (
		<Stack spacing={1} direction='row'>
			<GroupIndexer parentProps={props}></GroupIndexer>
			<TextField
				sx={{
					width: "100%",
				}}
				variant='outlined'
				multiline
				rows={4}
				required
				label='Description'
				name={`*1d-array;;${props.groupKey};${props.index}`}
				value={props.value}
				onInput={props.handleInputChange}
			/>
		</Stack>
	);
}
