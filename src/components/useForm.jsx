import { useState } from "react";

export function useForm(initFormVals) {
	const [values, setValues] = useState(initFormVals);

	const handleInputChange = (e) => {
		let { name, value, type } = e.target;

		if (type == "number") {
			value = Number(value);
		}

		if (name.startsWith("*")) {
			const nameArray = name.split(";");
			const command = nameArray[0].replace("*", "");
			const groupKey = nameArray[1];
			name = nameArray[2];
			const index = Number(nameArray[3]);

			switch (command) {
				case "1d-array":
					values[name][index] = value;
					break;
				case "obj-in-array":
					values[groupKey][index][name] = value;
					break;
				default:
					throw Error(command + " is not a valid command.");
			}

			setValues({
				...values,
			});
			return;
		}

		setValues({
			...values,
			[name]: value,
		});
	};

	const resetForm = () => {
		setValues(initFormVals);
	};

	return {
		values,
		setValues,
		resetForm,
		handleInputChange,
	};
}

export function Form(props) {
	return <form>{props.children}</form>;
}
