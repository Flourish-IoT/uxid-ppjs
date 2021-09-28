import DeleteIcon from "@mui/icons-material/Delete";
import { Typography, Stack, IconButton } from "@mui/material";

export default function GroupIndexer(props) {
	const parentProps = props.parentProps;

	return (
		<Stack
			spacing={1}
			direction='column'
			sx={{
				borderRight: "2px solid black",
				paddingRight: 1,
				width: "28px",
			}}
		>
			{parentProps.index > 0 && (
				<IconButton
					aria-label='delete'
					onClick={() => {
						parentProps.deletePostGroup();
					}}
					sx={{
						padding: 0,
					}}
				>
					<DeleteIcon />
				</IconButton>
			)}
			<Typography
				variant='h6'
				sx={{
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					height:
						parentProps.index > 0 ? "calc(100% - 48px)" : "100%",
				}}
			>
				{parentProps.index + 1}
			</Typography>
		</Stack>
	);
}
