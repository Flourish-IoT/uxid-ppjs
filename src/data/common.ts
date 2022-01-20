import { useQuery } from 'react-query';
import axios from 'axios';

export interface Post {
	id: number;
	author: number;
	fullName: string;
	term: Term;
	week: Week;
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

export interface RangeList {
	fall: object;
	winter: object;
	spring: object;
}

type Term = 'Fall' | 'Winter' | 'Spring';
type Week = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export const Ranges: RangeList = {
	fall: {
		0: '09/23/21 - 09/29/21',
		1: '09/30/21 - 10/06/21',
		2: '10/07/21 - 10/13/21',
		3: '10/14/21 - 10/20/21',
		4: '10/21/21 - 10/27/21',
		5: '10/28/21 - 11/03/21',
		6: '11/04/21 - 11/10/21',
		7: '11/11/21 - 11/17/21',
		8: '11/18/21 - 12/01/21', // +1 week for Thanksgiving break
	},
	winter: {
		9: '12/02/22 - 01/19/22', // Includes winter break
		10: '01/20/22 - 02/02/22',
		11: '02/03/22 - 02/16/22',
		12: '01/17/22 - 03/02/22',
	},
	spring: {
		13: '03/03/22 - TDB',
		14: 'TDB - TDB',
		15: 'TDB - TDB',
		16: 'TDB - TDB',
	},
};

export const getDateRange = (term: Term, week: Week) => {
	// @ts-ignore
	return Ranges[term.toLowerCase()][week];
};

export const getWeekNumsForTerm = (term: Term) => {
	// @ts-ignore
	return Object.keys(Ranges[String(term).toLowerCase()]).map(w => Number(w));
};
