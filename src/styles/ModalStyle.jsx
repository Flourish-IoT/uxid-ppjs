export default function ModalStyle(props) {
	return {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: "background.paper",
		borderRadius: 1,
		boxShadow: 24,
		overflowY: "scroll",
		p: 4,
		outline: 0,
		img: {
			maxWidth: "100%",
		},
		...props,
	};
}
