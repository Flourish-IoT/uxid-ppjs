import React, { useState } from 'react';
import qs from 'qs';
import {
	Button,
	Modal,
	Box,
	Typography,
	SpeedDial,
	SpeedDialIcon,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Slide,
} from '@mui/material';

import { useGetPosts } from './data/common';
import PPJAppBar from './components/PPJAppBar';
import ModalStyle from "./styles/ModalStyle";
import LoginForm from './views/LoginForm';
import AddEditPostForm from './views/AddEditPostForm';
import ViewPostScreen from './views/ViewPostScreen';
import PostsList from './views/PostsList';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export default function App() {
	const { id: query } = qs.parse(window.location.search, { ignoreQueryPrefix: true });

	const [termFilter, setTermFilter] = useState('Winter');
	const { data: posts, isLoading: postsIsLoading, refetch } = useGetPosts();

	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const [addEditPostModalOpen, setAddEditPostModalOpen] = useState(false);
	const [viewPostModalOpen, setViewPostModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState('');
	const [loggedIn, setloggedIn] = useState(false);
	const [addEditMode, setAddEditMode] = useState('');
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
	const [hasOpenedPost, setHasOpenedPost] = useState(false);

	const refreshPosts = () => {
		refetch();
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
		mode === 'edit' && !!post ? setSelectedPost(post) : setSelectedPost('');
		setSelectedPost(post);
		setAddEditMode(mode);
		closeAllModals();
		setAddEditPostModalOpen(true);
	};

	if (postsIsLoading) return (
		<Typography variant='h6' component='div' sx={{ marginTop: 2 }}>
			Loading...
		</Typography>
	);

	const filteredPosts = posts.filter(p => p.term === termFilter);

	// Open post by query
	if (posts.length > 0 && !hasOpenedPost && query) {
		const thePost = posts.find(p => p.id === Number(query));
		!!thePost ? openViewPostModal(thePost) : alert('Error: No post found with ID of ' + query);
		setHasOpenedPost(true);
	}

	return (
		<div className="App" style={{
			height: '100%',
			padding: '1rem'
		}}>
			<PPJAppBar termFilter={termFilter} setTermFilter={setTermFilter} loggedIn={loggedIn} setLoginModalOpen={setLoginModalOpen} />
			<PostsList posts={filteredPosts} termFilter={termFilter} openViewPostModal={openViewPostModal} />
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
						{addEditMode === 'add' ? 'Add' : 'Edit'} Post
					</Typography>
					<AddEditPostForm addEditMode={addEditMode} post={selectedPost} setAddEditPostModalOpen={setAddEditPostModalOpen} refreshPosts={refreshPosts}></AddEditPostForm>
					<Dialog
						open={confirmDiscardOpen}
						TransitionComponent={Transition}
						keepMounted
						onClose={() => { setConfirmDiscardOpen(false); }}
						aria-describedby='alert-dialog-slide-description'
					>
						<DialogTitle>Discard {addEditMode === 'add' ? 'Post' : 'Changes'}?</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-slide-description'>
								Your are about to discard {addEditMode === 'add' ? 'this post' : 'your changes'}, it cannot be undone.
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
					/>
				</Box>
			</Modal>
		</div >
	);
}