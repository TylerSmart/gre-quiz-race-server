import { BehaviorSubject } from 'rxjs';
import { questionController } from '.';
import { io } from '../app';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';
import { IQuestionData } from './question.controller';

export enum GameState {
	Player1Ready,
	Player1,
	Player2Ready,
	Player2,
	Review,
}

export class GameController {
	public state$ = new BehaviorSubject<GameState | null>(null);
	private questions: IQuestionData[] | null = [];
	private questionIndex: number = 0;

	constructor(private users: User[], private room: Room) {
		this.state$.subscribe(async (state) => {
			switch (state) {
				case GameState.Player1Ready:
				case GameState.Player2Ready:
					this.questionIndex = 0;
					io.to(this.room.name).emit('game', {
						state,
						questions: this.questions,
						questionIndex: this.questionIndex,
					});
					break;
				case GameState.Player1:
				case GameState.Player2:
					io.to(this.room.name).emit('game', {
						state,
					});
					break;
			}
		});
	}

	async loadAssets() {
		this.questions = await questionController.getQuestions();
	}

	nextState() {
		switch (this.state$.getValue()) {
			case GameState.Review:
			case null:
				this.state$.next(GameState.Player1Ready);
				break;
			case GameState.Player1Ready:
				this.state$.next(GameState.Player1);
				break;
			case GameState.Player1:
				this.state$.next(GameState.Player2Ready);
				break;
			case GameState.Player2Ready:
				this.state$.next(GameState.Player2);
				break;
			case GameState.Player2:
				this.state$.next(GameState.Review);
				break;
		}
	}
}
