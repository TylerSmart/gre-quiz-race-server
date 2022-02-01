import axios from 'axios';

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

export class QuestionController {
	async getQuestions() {
		const questions = await axios
			.get('https://mfpd1xxqx7.execute-api.us-east-2.amazonaws.com/QA/Search')
			.then((res: any) => {
				console.log(res.data);
				return res.data.records.map((questionData: any) => {
					return new Object({
						question: questionData.question,
						answers: questionData.answers.map((answer: any, answerIndex: number) => {
							return new Object({
								answer: answer,
								correct: answerIndex == 0,
							});
						}),
						category: questionData.category,
						explanation: questionData.explain,
					});
				});
			});

		questions.forEach((question: any) => {
			question.answers = question.answers.sort(() => Math.random() - 0.5);
		})

		return new Array(10)
			.fill(undefined)
			.map(
				(_) =>
					questions.splice(
						(Math.random() * 10) % questions.length,
						1,
					)[0] as IQuestionData,
			);


		

		// return QUESTIONS;
	}
}
