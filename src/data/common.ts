import { useQuery } from 'react-query';
import axios from 'axios';

export interface Post {
	id: number;
	author: number;
	fullName: string;
	term: 'Fall' | 'Winter' | 'Spring';
	week: number;
	totalHours: number;
	accomplishments: Accomplishment[];
	plans: string[];
	obstacles: string[];
}

export interface Accomplishment {
	title: string;
	hours: string;
	description: string;
}

export const useGetPosts = () => {
	return useQuery(['get-posts'], () => {
		return axios.get<Post[]>(`/request-posts`).then(res => res.data);
	});
};

export const getDateRange = (term: keyof Post, week: keyof Post) => {
	const ranges = {
		fall: [
			'09/23/21 - 09/29/21',
			'09/30/21 - 10/06/21',
			'10/07/21 - 10/13/21',
			'10/14/21 - 10/20/21',
			'10/21/21 - 10/27/21',
			'10/28/21 - 11/03/21',
			'11/04/21 - 11/10/21',
			'11/11/21 - 11/17/21',
			'11/18/21 - 12/01/21', // +1 week for Thanksgiving break
		],
		winter: [
			'12/30/22 - 01/05/22',
			'01/06/22 - 01/12/22',
			'01/13/22 - 01/19/22',
			'01/20/22 - 01/26/22',
			'01/27/22 - 02/02/22',
			'02/03/22 - 02/09/22',
			'02/10/22 - 02/16/22',
			'02/17/22 - 02/23/22',
			'02/24/22 - 03/02/22',
		],
		spring: [
			'03/24/22 - 03/30/22',
			'03/31/22 - 04/06/22',
			'04/07/22 - 04/13/22',
			'04/14/22 - 04/20/22',
			'04/21/22 - 04/27/22',
			'04/28/22 - 05/04/22',
			'05/05/22 - 05/11/22',
			'05/12/22 - 05/18/22',
			'05/19/22 - 05/25/22',
		],
	};

	// @ts-ignore
	return ranges[term.toLowerCase()][week];
};
