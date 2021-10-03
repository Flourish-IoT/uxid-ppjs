import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import HelpIcon from "@mui/icons-material/Help";
import CodeIcon from "@mui/icons-material/Code";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
	TextField,
	Stack,
	Button,
	Divider,
	IconButton,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Slide,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

import AccomplishmentEditGroup from "../components/AccomplishmentEditGroup";
import PlanEditGroup from "../components/PlanEditGroup";
import ObstacleEditGroup from "../components/ObstacleEditGroup";
import { useForm, Form } from "../components/useForm";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export default function AddEditPostForm({ addEditMode, post, ...rest }) {
	const [cookies, setCookie] = useCookies({});
	const [isSaving, setIsSaving] = useState(false);

	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const handleConfirmDeleteOpen = () => setConfirmDeleteOpen(true);
	const handleConfirmDeleteClose = () => setConfirmDeleteOpen(false);

	const blankFormVals = {
		week: "",
		totalHours: "",
		accomplishments: [{ title: "", hours: "", description: "" }],
		plans: [""],
		obstacles: [""],
	};

	const initFormVals = addEditMode == "add" ? blankFormVals : post;

	const { values, setValues, resetForm, handleInputChange } =
		useForm(initFormVals);

	const addPostGroup = (groupKey) => {
		values[groupKey][values[groupKey].length] = blankFormVals[groupKey][0];
		setValues({
			...values,
		});
	};

	const deletePostGroup = (groupKey, index) => {
		values[groupKey].splice(index, 1);
		setValues({
			...values,
		});
	};

	const postAsText = () => {
		return `-=-=-= Accomplishments =-=-=-
			${values.accomplishments.map((r, index) => {
				return (
					"\n" +
					(index + 1) +
					"." +
					"\n            Title:   " +
					r.title +
					"\n            Hours:   " +
					r.hours +
					"\n      Description:   " +
					r.description
				);
			})}

			\n-=-=-= Plans =-=-=-
			${values.plans.map((r) => {
				return "\n" + r;
			})}

			\n-=-=-= Obstacles =-=-=-
			${values.obstacles.map((r) => {
				return "\n" + r;
			})}
		`;
	};

	const downloadPostObj = (fileName, source) => {
		const text = source == "obj" ? JSON.stringify(values) : postAsText();

		const element = document.createElement("a");
		element.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," + encodeURIComponent(text)
		);
		element.setAttribute("download", fileName);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const savePost = () => {
		setIsSaving(true);
		axios
			.get("/save-post", {
				params: {
					saveKey: cookies.saveKey,
					postObj: values,
				},
			})
			.then((response) => {
				setTimeout(() => {
					// Save buffer
					rest.refreshPosts();
					rest.setAddEditPostModalOpen(false);
				}, 100);
			})
			.catch((error) => {
				downloadPostObj("PPJ Backup", "obj");
			})
			.finally(() => {
				setIsSaving(false);
			});
	};

	const deletePost = async () => {
		await axios("/delete-post", {
			params: {
				postId: post.id,
			},
		});

		setTimeout(() => {
			rest.refreshPosts();
			rest.setAddEditPostModalOpen(false);
		}, 100);
	};

	return (
		<Form>
			<Stack id='postFormPrintZone' spacing={1} direction='column'>
				<Stack spacing={1} direction='row'>
					<TextField
						variant='outlined'
						sx={{ width: "50%" }}
						type='number'
						required
						label='Post #'
						name='week'
						value={values.week}
						onInput={handleInputChange}
						InputProps={{
							inputProps: {
								max: 50,
								min: 1,
							},
						}}
					/>
					<TextField
						variant='outlined'
						sx={{ width: "50%" }}
						type='number'
						required
						label='Total Hours'
						name='totalHours'
						value={values.totalHours}
						onInput={handleInputChange}
						InputProps={{
							inputProps: {
								max: 40,
								min: 0,
							},
						}}
					/>
				</Stack>

				<Divider textAlign='left' light>
					Accomplishments
					<Tooltip
						title={
							<h3>
								Narrative of specific task. Include visual
								samples of art (jpg/png), post links to github
								repo, codepen embeds, youtube embeds, or
								prototypes to show proof of completed work.
							</h3>
						}
					>
						<IconButton>
							<HelpIcon />
						</IconButton>
					</Tooltip>
				</Divider>

				<Stack spacing={3} direction='column'>
					{values.accomplishments.map((a, index) => (
						<AccomplishmentEditGroup
							groupKey='accomplishments'
							key={index}
							index={index}
							value={values.accomplishments[index]}
							handleInputChange={handleInputChange}
							deletePostGroup={() => {
								deletePostGroup("accomplishments", index);
							}}
						></AccomplishmentEditGroup>
					))}
				</Stack>

				<IconButton
					aria-label='add'
					onClick={() => addPostGroup("accomplishments")}
				>
					<ControlPointIcon />
				</IconButton>

				<Divider textAlign='left' light>
					Plans
					<Tooltip
						title={
							<h3>
								What specific tasks are you going to work on,
								and why are thy relevant to the project at this
								point in time.
							</h3>
						}
					>
						<IconButton>
							<HelpIcon />
						</IconButton>
					</Tooltip>
				</Divider>

				<Stack spacing={3} direction='column'>
					{values.plans.map((plan, index) => (
						<PlanEditGroup
							groupKey='plans'
							key={index}
							index={index}
							value={values.plans[index]}
							handleInputChange={handleInputChange}
							deletePostGroup={() => {
								deletePostGroup("plans", index);
							}}
						></PlanEditGroup>
					))}
				</Stack>

				<IconButton
					aria-label='add'
					onClick={() => addPostGroup("plans")}
				>
					<ControlPointIcon />
				</IconButton>

				<Divider textAlign='left' light>
					Obstacles
					<Tooltip
						title={
							<h3>
								What could possibly stand in your way of
								completing items listed in “Plans", and how can
								you overcome them?
							</h3>
						}
					>
						<IconButton>
							<HelpIcon />
						</IconButton>
					</Tooltip>
				</Divider>

				<Stack spacing={3} direction='column'>
					{values.obstacles.map((obs, index) => (
						<ObstacleEditGroup
							groupKey='obstacles'
							key={index}
							index={index}
							value={values.obstacles[index]}
							handleInputChange={handleInputChange}
							deletePostGroup={() => {
								deletePostGroup("obstacles", index);
							}}
						></ObstacleEditGroup>
					))}
				</Stack>

				<IconButton
					aria-label='add'
					onClick={() => addPostGroup("obstacles")}
				>
					<ControlPointIcon />
				</IconButton>
			</Stack>
			<Stack
				spacing={1}
				direction={{
					xs: "column",
					sm: "row",
				}}
				sx={{
					justifyContent: "flex-end",
				}}
			>
				{addEditMode == "edit" && (
					<Button
						variant='outlined'
						color='error'
						onClick={handleConfirmDeleteOpen}
					>
						Delete
					</Button>
				)}
				<PopupState variant='popover' popupId='demo-popup-menu'>
					{(popupState) => (
						<React.Fragment>
							<Button
								variant='outlined'
								endIcon={<ArrowDropDownIcon />}
								{...bindTrigger(popupState)}
							>
								Download Draft
							</Button>
							<Menu {...bindMenu(popupState)}>
								<MenuItem
									onClick={() => {
										downloadPostObj("PPJ Draft", "display");
										popupState.close();
									}}
								>
									<ListItemIcon>
										<DescriptionOutlinedIcon />
									</ListItemIcon>
									<ListItemText>Text File</ListItemText>
								</MenuItem>
								<MenuItem
									onClick={() => {
										downloadPostObj("PPJ Draft", "obj");
										popupState.close();
									}}
								>
									<ListItemIcon>
										<CodeIcon />
									</ListItemIcon>
									<ListItemText>Json Object</ListItemText>
								</MenuItem>
							</Menu>
						</React.Fragment>
					)}
				</PopupState>
				<Button
					disabled={isSaving}
					variant='contained'
					onClick={savePost}
				>
					{addEditMode == "add" ? "Publish" : "Save"}
				</Button>
			</Stack>
			<Dialog
				open={confirmDeleteOpen}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleConfirmDeleteClose}
				aria-describedby='alert-dialog-slide-description'
			>
				<DialogTitle>Delete Post?</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-slide-description'>
						Your are about to delete this post, it cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleConfirmDeleteClose}>Cancel</Button>
					<Button
						onClick={() => {
							deletePost();
							handleConfirmDeleteClose();
						}}
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</Form>
	);
}
