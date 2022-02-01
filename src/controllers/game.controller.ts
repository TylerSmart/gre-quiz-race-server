import { BehaviorSubject, throwIfEmpty } from 'rxjs';
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
	public questionIndex: number = 0;

	private player1Start: Date | null = null;
	private player2Start: Date | null = null;
	private player1End: Date | null = null;
	private player2End: Date | null = null;

	private freeze: boolean = false;
	private fiftyFifty: boolean = false;

	constructor(private users: User[], private room: Room) {
		this.state$.subscribe(async (state) => {
			switch (state) {
				case GameState.Player1Ready:
				case GameState.Player2Ready:
					this.freeze = false;
					this.fiftyFifty = false;
					if (state == GameState.Player2Ready) this.player1End = new Date();
					this.questionIndex = 0;
					io.to(this.room.name).emit('game', {
						state,
						questions: this.questions,
						questionIndex: this.questionIndex,
						player1Start: this.player1Start,
						player2Start: this.player2Start,
						player1End: this.player1End,
						player2End: this.player2End,
					});
					break;
				case GameState.Player1:
				case GameState.Player2:
					if (state === GameState.Player1) this.player1Start = new Date();
					if (state === GameState.Player2) this.player2Start = new Date();
					this.questionIndex = 0;
					io.to(this.room.name).emit('game', {
						state,
						questionIndex: this.questionIndex,
						player1Start: this.player1Start,
						player2Start: this.player2Start,
						player1End: this.player1End,
						player2End: this.player2End,
					});
					break;
				case GameState.Review:
					this.player2End = new Date();
					io.to(this.room.name).emit('game', {
						state,
						player1Start: this.player1Start,
						player2Start: this.player2Start,
						player1End: this.player1End,
						player2End: this.player2End,
					});
					break;
			}
		});
	}

	nextQuestion() {
		this.questionIndex++;
		io.to(this.room.name).emit('game', {
			state: this.state$.getValue(),
			questions: this.questions,
			questionIndex: this.questionIndex,
			player1Start: this.player1Start,
			player2Start: this.player2Start,
			player1End: this.player1End,
			player2End: this.player2End,
		});
	}

	async loadAssets() {
		console.log("Here");
		this.questions = await questionController.getQuestions();
		console.log(this.questions);
	}

	reset() {
		this.state$.next(null);
		this.questions = null;
		this.questionIndex = 0;
		this.player1Start = null;
		this.player2Start = null;
		this.player1End = null;
		this.player2End = null;
	}

	nextState() {
		console.log(
			`[${this.room.name}] Requesting to move to next state from ${this.state$.getValue()}.`,
		);
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

	useFreeze() {
		if (this.freeze) return console.error('Player has already used freeze!');
		this.freeze = true;
		io.to(this.room.name).emit('freeze');
	}

	useFiftyFifty() {
		if (this.fiftyFifty) return console.error('Player has already used fiftyFifty!');
		this.fiftyFifty = true;
		io.to(this.room.name).emit('fiftyFifty');
	}
}
