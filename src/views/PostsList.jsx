import React, { Fragment } from 'react';
import { Divider, Grid, Card, Typography, CardActionArea, CardContent } from '@mui/material';

import CardStyle from '../styles/CardStyle';
import { getDateRange } from '../data/common';

const groupBy = (xs, key) => {
	return xs.reduce((rv, x) => {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};

export default function PostsList({ posts, openViewPostModal }) {
	return (
		<Grid
			container
			spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}
			columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
			sx={{ paddingLeft: { xs: 2, sm: 2, md: 3, lg: 3 } }}
		>
			{posts.length > 0 ? (
				Object.values(groupBy(posts, 'week'))
					.reverse()
					.map((group, groupIdx) => (
						<Fragment key={group[0].week}>
							<Divider
								textAlign='left'
								sx={{
									width: '100%',
									margin: `${groupIdx === 0 ? '2rem 0 1rem 0' : '1rem 0'}`,
									alignItems: 'start',
								}}
							>
								<b>Post #{group[0].week}:</b> {getDateRange(group[0].term, group[0].week)}
							</Divider>
							{group.map(post => (
								<Grid item xs={1} sm={1} md={1} lg={1} key={post.id}>
									<Card
										key={post.id}
										sx={CardStyle()}
										onClick={() => {
											openViewPostModal(post);
										}}
									>
										<CardActionArea>
											<CardContent>
												<Typography variant='h5' component='div'>
													{post.fullName}
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							))}
						</Fragment>
					))
			) : (
				<Typography variant='h6' component='div' sx={{ marginTop: 2 }}>
					No posts this term.
				</Typography>
			)}
		</Grid>
	);
}
