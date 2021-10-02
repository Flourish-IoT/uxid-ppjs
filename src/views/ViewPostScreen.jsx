import { useCookies } from "react-cookie";
import { Divider, Stack, Button } from "@mui/material";

export default function ViewPostScreen({
	post,
	openAddEditPostModal,
	...rest
}) {
	const [cookies, setCookie] = useCookies({});

	return (
		<>
			<Stack spacing={1} direction='row'>
				<h1>{post.fullName}</h1>
				{rest.loggedIn && cookies.userId == post.author && (
					<Button
						sx={{ alignSelf: "center" }}
						variant='contained'
						onClick={() => {
							openAddEditPostModal("edit", post);
						}}
					>
						Edit Post
					</Button>
				)}
			</Stack>

			<h4>Post # {post.week}</h4>
			<h4>Total Hours: {post.totalHours}</h4>

			<Divider light></Divider>

			<h2>Accomplishments</h2>
			{post.accomplishments.map((a, index) => (
				<div
					key={index}
					style={{
						borderLeft: "2px solid black",
						paddingLeft: "1rem",
					}}
				>
					<h3>{a.title}</h3>
					<p dangerouslySetInnerHTML={{ __html: a.description }} />
					<h4>Hours: {a.hours}</h4>
				</div>
			))}

			<Divider light></Divider>

			<h2>Plans</h2>
			<ul>
				{post.plans.map((p, index) => (
					<li key={index} dangerouslySetInnerHTML={{ __html: p }} />
				))}
			</ul>

			<Divider light></Divider>

			<h2>Obstacles</h2>
			<ul>
				{post.obstacles.map((o, index) => (
					<li key={index} dangerouslySetInnerHTML={{ __html: o }} />
				))}
			</ul>
		</>
	);
}
