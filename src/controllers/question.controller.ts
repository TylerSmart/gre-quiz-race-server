export interface IAnswerData {
	answer: string;
	correct: boolean;
}

export interface IQuestionData {
	question: string;
	answers: IAnswerData[];
	category: string;
	explanation: string;
	review?: true;
}

const QUESTIONS: IQuestionData[] = [
	{
		question: 'Sample question 1',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 2',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 3',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 4',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 5',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 6',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 7',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 8',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 9',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
	{
		question: 'Sample question 10',
		answers: [
			{ answer: 'Right answer', correct: true },
			{ answer: 'Wrong answer 1', correct: false },
			{ answer: 'Wrong answer 2', correct: false },
			{ answer: 'Wrong answer 3', correct: false },
		],
		category: 'Category 1',
		explanation: 'This is an explanation.',
	},
];

export class QuestionController {
	async getQuestions() {
		return QUESTIONS;
	}
}
