import React, { useState } from "react";
import axios from "axios";
import { TextField, Stack, Button } from "@mui/material";

import { useForm, Form } from "../components/useForm";

export default function LoginForm(props) {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);

		axios
			.post("/login", {
				username: values.username,
				password: values.password,
			})
			.then((res) => {
				props.closeModalFunc();
				props.setloggedIn(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const initFormVals = {
		username: "",
		password: "",
	};

	const { values, setValues, resetForm, handleInputChange } =
		useForm(initFormVals);

	return (
		<Form>
			<Stack spacing={1} direction='column'>
				<TextField
					variant='outlined'
					required
					label='Username'
					name='username'
					value={values.username}
					onInput={handleInputChange}
				/>
				<TextField
					variant='outlined'
					required
					label='Password'
					name='password'
					type='password'
					value={values.password}
					onInput={handleInputChange}
				/>
				<Button
					disabled={isLoading}
					variant='contained'
					onClick={handleLogin}
				>
					Submit
				</Button>
			</Stack>
		</Form>
	);
}
