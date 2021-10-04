import React, { useState } from 'react';
import qs from 'qs';
import { CookiesProvider } from "react-cookie";
import axios from 'axios';
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
	Slide
} from '@mui/material';

import CardStyle from "./styles/CardStyle";
import ModalStyle from "./styles/ModalStyle";
import LoginForm from './views/LoginForm';
import AddEditPostForm from './views/AddEditPostForm';
import ViewPostScreen from './views/ViewPostScreen';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export default function App() {
	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const [addEditPostModalOpen, setAddEditPostModalOpen] = useState(false);
	const [viewPostModalOpen, setViewPostModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState('');
	const [loggedIn, setloggedIn] = useState(false);
	const [addEditMode, setAddEditMode] = useState('');
	const [allPosts, setCards] = useState(-1);
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

	if (allPosts === -1) {
		setCards([]);
		axios('/request-posts').then((cards) => {
			setCards(cards.data);
		});
	}

	const refreshPosts = () => {
		axios('/request-posts').then((cards) => {
			setCards(cards.data);
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
							Sproutify PPJ's
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
				<Grid container spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} sx={{ width: '100%', padding: 2 }}>
					{allPosts.length > 0 ? allPosts.map((post) => (
						<Grid item xs={1} sm={1} md={1} lg={1} key={post.id}>
							<Card key={post.id} sx={CardStyle()} onClick={() => { openViewPostModal(post); }}>
								<CardActionArea>
									<CardContent>
										<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
											Post # {post.week}
										</Typography>
										<Typography variant="h5" component="div">
											{post.fullName}
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					)) :
						<Typography variant="h6" component="div">
							No posts found.
						</Typography>}
				</Grid>
				{loggedIn && (
					<SpeedDial
						id='speedDial'
						ariaLabel="Add Post"
						open={false}
						sx={{ position: 'absolute', bottom: 32, right: 32 }}
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
							<DialogTitle>Discard Post?</DialogTitle>
							<DialogContent>
								<DialogContentText id='alert-dialog-slide-description'>
									Your are about to discard your changes, it cannot be undone.
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
						<ViewPostScreen openAddEditPostModal={openAddEditPostModal} loggedIn={loggedIn} post={selectedPost}></ViewPostScreen>
					</Box>
				</Modal>
			</CookiesProvider>
		</div>
	);
}