import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import LinkIcon from '@mui/icons-material/Link';
import { Divider, Stack, Button, IconButton, Tooltip, Box } from '@mui/material';

import { getDateRange } from '../data/common';

export default function ViewPostScreen({ post, openAddEditPostModal, ...rest }) {
	const [cookies, setCookie] = useCookies({});
	const [copiedText, setCopiedText] = useState();
	const postLink = `${window.location.origin}?id=${post.id}`;

	return (
		<>
			<Stack spacing={1} direction='row'>
				<h1>{post.fullName}</h1>

				{/* Spacer */}
				<Box sx={{ flexGrow: 1 }} />

				<CopyToClipboard text={postLink} onCopy={() => setCopiedText(postLink)}>
					<Tooltip placement='top' title={<h3>{copiedText === postLink ? 'Copied!' : 'Copy post link'}</h3>}>
						<IconButton color='primary' aria-label='Copy post link'>
							<LinkIcon />
						</IconButton>
					</Tooltip>
				</CopyToClipboard>

				{rest.loggedIn && Number(cookies.userId) === post.author && (
					<Button
						sx={{ alignSelf: 'center' }}
						variant='contained'
						onClick={() => {
							openAddEditPostModal('edit', post);
						}}
					>
						Edit Post
					</Button>
				)}
			</Stack>

			<h4>
				{post.term} | Post #{post.week} | {getDateRange(post.term, post.week)}
			</h4>
			<h4>Total Hours: {post.totalHours}</h4>

			<Divider light></Divider>

			<h2>Accomplishments</h2>
			{post.accomplishments.map((a, index) => (
				<div
					key={index}
					style={{
						borderLeft: '2px solid black',
						paddingLeft: '1rem',
					}}
				>
					<h3>{a.title}</h3>
					<p
						dangerouslySetInnerHTML={{ __html: a.description }}
						style={{
							lineHeight: '1.5rem',
						}}
					/>
					<h4>Hours: {a.hours}</h4>
				</div>
			))}

			<Divider light></Divider>

			<h2>Plans</h2>
			<ul>
				{post.plans.map((p, index) => (
					<li
						key={index}
						dangerouslySetInnerHTML={{ __html: p }}
						style={{
							marginBottom: '1rem',
							lineHeight: '1.5rem',
						}}
					/>
				))}
			</ul>

			<Divider light></Divider>

			<h2>Obstacles</h2>
			<ul>
				{post.obstacles.map((o, index) => (
					<li
						key={index}
						dangerouslySetInnerHTML={{ __html: o }}
						style={{
							marginBottom: '1rem',
							lineHeight: '1.5rem',
						}}
					/>
				))}
			</ul>
		</>
	);
}
