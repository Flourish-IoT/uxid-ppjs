import React, { Fragment, useState } from 'react';
import qs from 'qs';
import { CookiesProvider } from "react-cookie";
import axios from 'axios';
import moment from 'moment';
import {
	AppBar,
	CardActionArea,
	Toolbar,
	Button,
	Modal,
	Box,
	Grid,
	Card,
	Typography,
	CardContent,
	SpeedDial,
	SpeedDialIcon,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Slide,
	Divider
} from '@mui/material';

import CardStyle from "./styles/CardStyle";
import ModalStyle from "./styles/ModalStyle";
import LoginForm from './views/LoginForm';
import AddEditPostForm from './views/AddEditPostForm';
import ViewPostScreen from './views/ViewPostScreen';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const groupBy = (xs, key) => {
	return xs.reduce((rv, x) => {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

const getDateRange = (weekNum) => {
	const format = 'MM/DD/YY';
	const origin = moment('09/23/2021', format);

	const begin = moment(origin).add(1 * (weekNum), 'weeks').format(format);
	const end = moment(begin).subtract(1, 'days').add(1, 'weeks').format(format);

	return `${begin} - ${end}`;
};

export default function App() {
	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const [addEditPostModalOpen, setAddEditPostModalOpen] = useState(false);
	const [viewPostModalOpen, setViewPostModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState('');
	const [loggedIn, setloggedIn] = useState(false);
	const [addEditMode, setAddEditMode] = useState('');
	const [allPosts, setPosts] = useState(-1);
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

	if (allPosts === -1) {
		setPosts([]);
		axios('/request-posts').then((result) => {
			setPosts(result.data);
		});
	}

	const refreshPosts = () => {
		axios('/request-posts').then((result) => {
			setPosts(result.data);
		});
	};

	const closeAllModals = () => {
		setAddEditPostModalOpen(false);
		setViewPostModalOpen(false);
		setLoginModalOpen(false);
	};

	const openViewPostModal = (post) => {
		setSelectedPost(post);
		closeAllModals();
		setViewPostModalOpen(true);
	};

	const openAddEditPostModal = (mode, post) => {
		mode == 'edit' && !!post ? setSelectedPost(post) : setSelectedPost('');
		setSelectedPost(post);
		setAddEditMode(mode);
		closeAllModals();
		setAddEditPostModalOpen(true);
	};

	// Open post by query
	const [hasOpenedPost, setHasOpenedPost] = useState(false);
	const query = qs.parse(window.location.search, { ignoreQueryPrefix: true }).id;
	if (allPosts != -1 && allPosts.length > 0 && !hasOpenedPost && query) {
		const thePost = allPosts.find(p => p.id == query);
		!!thePost ? openViewPostModal(thePost) : alert('Error: No post found with ID of ' + query);
		setHasOpenedPost(true);
	}

	return (
		<div className="App" style={{
			height: '100%',
			padding: '1rem'
		}}>
			<CookiesProvider>
				<AppBar position="static" sx={{ borderRadius: 1 }}>
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Flourish PPJ's
						</Typography>
						{!loggedIn && (
							<Button
								variant="outlined"
								color="inherit"
								onClick={() => { setLoginModalOpen(true); }}
							>
								Login
							</Button>
						)}
					</Toolbar>
				</AppBar>
				<Grid
					container
					spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}
					columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
					sx={{
						paddingLeft: { xs: 2, sm: 2, md: 3, lg: 3 }
					}}
				>
					{allPosts.length > 0
						?
						Object.values(groupBy(allPosts, 'week')).reverse().map((group, groupIdx) => (
							<Fragment key={group[0].week}>
								<Divider
									textAlign='left'
									sx={{
										width: '100%',
										margin: `${groupIdx == 0 ? '2rem 0 1rem 0' : '1rem 0'}`,
										alignItems: 'start'
									}}>
									<b>Post #{group[0].week}:</b> {getDateRange(group[0].week)}
								</Divider>
								{group.map(post => (
									<Grid item xs={1} sm={1} md={1} lg={1} key={post.id}>
										<Card key={post.id} sx={CardStyle()} onClick={() => { openViewPostModal(post); }}>
											<CardActionArea>
												<CardContent>
													<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
														{post.totalHours} Hrs.
													</Typography>
													<Typography variant="h5" component="div">
														{post.fullName}
													</Typography>
												</CardContent>
											</CardActionArea>
										</Card>
									</Grid>
								))}
							</Fragment>
						))
						:
						<Typography variant="h6" component="div">
							No posts found.
						</Typography>}
				</Grid>
				{loggedIn && (
					<SpeedDial
						id='speedDial'
						ariaLabel="Add Post"
						open={false}
						sx={{ position: 'fixed', bottom: 32, right: 32 }}
						icon={<SpeedDialIcon />}
						onClick={() => { openAddEditPostModal('add', undefined); }}
					/>
				)}
				<Modal
					open={loginModalOpen}
					onClose={() => { setLoginModalOpen(false); }}
					aria-labelledby='modal-modal-title'
				>
					<Box
						component="div"
						sx={ModalStyle({
							width: '75%',
							maxWidth: '300px'
						})}
					>
						<Typography id='modal-modal-title' variant='h6' sx={{
							marginBottom: 2
						}}>
							Login
						</Typography>
						<LoginForm closeModalFunc={() => { setLoginModalOpen(false); }} setloggedIn={setloggedIn}></LoginForm>
					</Box>
				</Modal>
				<Modal
					open={addEditPostModalOpen}
					onClose={() => { setConfirmDiscardOpen(true); }}
					aria-labelledby='modal-modal-title'
				>
					<Box
						component="div"
						sx={ModalStyle({
							width: '75%',
							height: '75%'
						})}
					>
						<Typography id='modal-modal-title' variant='h6' sx={{
							marginBottom: 2
						}}>
							{addEditMode == 'add' ? 'Add' : 'Edit'} Post
						</Typography>
						<AddEditPostForm addEditMode={addEditMode} post={selectedPost} setAddEditPostModalOpen={setAddEditPostModalOpen} refreshPosts={refreshPosts}></AddEditPostForm>
						<Dialog
							open={confirmDiscardOpen}
							TransitionComponent={Transition}
							keepMounted
							onClose={() => { setConfirmDiscardOpen(false); }}
							aria-describedby='alert-dialog-slide-description'
						>
							<DialogTitle>Discard {addEditMode == 'add' ? 'Post' : 'Changes'}?</DialogTitle>
							<DialogContent>
								<DialogContentText id='alert-dialog-slide-description'>
									Your are about to discard {addEditMode == 'add' ? 'this post' : 'your changes'}, it cannot be undone.
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => { setConfirmDiscardOpen(false); }}>Cancel</Button>
								<Button
									onClick={() => {
										setAddEditPostModalOpen(false);
										setConfirmDiscardOpen(false);
									}}
								>
									Discard
								</Button>
							</DialogActions>
						</Dialog>
					</Box>
				</Modal>
				<Modal
					open={viewPostModalOpen}
					onClose={() => { setViewPostModalOpen(false); }}
					aria-labelledby='modal-modal-title'
				>
					<Box
						component="div"
						sx={ModalStyle({
							width: '75%',
							height: '75%'
						})}
					>
						<ViewPostScreen
							openAddEditPostModal={openAddEditPostModal}
							loggedIn={loggedIn}
							post={selectedPost}
							getDateRange={getDateRange}>
						</ViewPostScreen>
					</Box>
				</Modal>
			</CookiesProvider>
		</div>
	);
}