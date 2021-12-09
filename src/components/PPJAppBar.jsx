import { AppBar, Toolbar, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

export default function PPJAppBar({ termFilter, setTermFilter, loggedIn, setLoginModalOpen }) {
	return (
		<AppBar position='static' sx={{ borderRadius: 1 }}>
			<Toolbar>
				<Typography variant='h6' component='div'>
					Flourish PPJ's
				</Typography>
				<FormControl sx={{ marginLeft: 2, '*': { borderColor: 'white' } }}>
					<InputLabel id='term-select-label' sx={{ color: 'white' }}>
						Term
					</InputLabel>
					<Select
						labelId='term-select-label'
						id='term-select'
						value={termFilter}
						label='Term'
						name='term'
						onChange={e => setTermFilter(e.target.value)}
						sx={{
							'.MuiSelect-select': {
								color: 'white',
								paddingY: 1,
							},
							'.MuiSelect-icon': {
								fill: 'white',
							},
						}}
					>
						{['Fall', 'Winter', 'Spring'].map(term => (
							<MenuItem key={term} value={term}>
								{term}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{!loggedIn && (
					<Button
						sx={{ marginLeft: 'auto' }}
						variant='outlined'
						color='inherit'
						onClick={() => {
							setLoginModalOpen(true);
						}}
					>
						Login
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
}
