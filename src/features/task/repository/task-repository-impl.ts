import {
	AppError,
	NotFoundError,
	UnknownError,
	ValidationError,
} from "@/core/errors/errors";
import { Logger } from "@/core/util/logger";
import { type Axios, AxiosError } from "axios";
import type { Task } from "../types/task";
import type { TaskRepository } from "./task-repository";

export class TaskRepositoryImpl implements TaskRepository {
	private apiClient: Axios;

	constructor(apiClient: Axios) {
		this.apiClient = apiClient;
	}

	async findAll(): Promise<Task[]> {
		try {
			const response = await this.apiClient.get("/todos");
			Logger.debug(response);

			if (response.status === 200) {
				const tasks: Task[] = response.data;
				Logger.debug(tasks);
				return tasks;
			}
			throw new AppError(`予期しないステータスコード: ${response.status}`);
		} catch (error) {
			let appError: AppError;

			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError;
				if (axiosError.response) {
					const status = axiosError.response.status;
					switch (status) {
						default:
							appError = new UnknownError(
								"タスクの取得中に予期しないエラーが発生しました。",
							);
							break;
					}
				} else {
					appError = new AppError(
						"タスクの取得中にネットワークエラーが発生しました。",
					);
				}
			} else {
				appError = new UnknownError(
					"タスクの取得中に予期しないエラーが発生しました。",
				);
			}

			Logger.error(appError);
			throw appError;
		}
	}

	async add(title: string): Promise<Task> {
		try {
			const body = {
				title,
			};
			const response = await this.apiClient.post("/todos", body);

			if (response.status === 201) {
				const newTask: Task = response.data;
				Logger.debug(newTask);
				return newTask;
			}
			throw new AppError(`予期しないステータスコード: ${response.status}`);
		} catch (error) {
			let appError: AppError;

			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError;
				if (axiosError.response) {
					const status = axiosError.response.status;
					switch (status) {
						case 400:
							appError = new ValidationError(
								"タスクの追加に失敗しました。入力データが不正です。",
							);
							break;
						default:
							appError = new UnknownError(
								"タスクの取得中に予期しないエラーが発生しました。",
							);
							break;
					}
				} else {
					appError = new AppError(
						"タスクの追加中にネットワークエラーが発生しました。",
					);
				}
			} else {
				appError = new UnknownError(
					"タスクの追加中に予期しないエラーが発生しました。",
				);
			}

			Logger.error(appError);
			throw appError;
		}
	}

	async update(id: number, title: string, completed: boolean): Promise<Task> {
		try {
			const body = {
				title,
				completed,
			};
			const response = await this.apiClient.put(`/todos/${id}`, body);

			if (response.status === 200) {
				const updatedTask: Task = response.data;
				Logger.debug(updatedTask);
				return updatedTask;
			}
			throw new AppError(`予期しないステータスコード: ${response.status}`);
		} catch (error) {
			let appError: AppError;

			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError;
				if (axiosError.response) {
					const status = axiosError.response.status;
					switch (status) {
						case 400:
							appError = new ValidationError(
								"タスクの更新に失敗しました。入力データが不正です。",
							);
							break;
						case 404:
							appError = new NotFoundError(
								"タスクの更新に失敗しました。タスクが見つかりません。",
							);
							break;
						default:
							appError = new UnknownError(
								"タスクの取得中に予期しないエラーが発生しました。",
							);
							break;
					}
				} else {
					appError = new AppError(
						"タスクの更新中にネットワークエラーが発生しました。",
					);
				}
			} else {
				appError = new UnknownError(
					"タスクの更新中に予期しないエラーが発生しました。",
				);
			}

			Logger.error(appError);
			throw appError;
		}
	}

	async remove(id: number): Promise<void> {
		try {
			const response = await this.apiClient.delete(`/todos/${id}`);

			if (response.status === 200) {
				Logger.debug({ message: `タスクが削除されました: ID ${id}` });
			} else {
				throw new AppError(`予期しないステータスコード: ${response.status}`);
			}
		} catch (error) {
			let appError: AppError;

			if (error instanceof AxiosError) {
				const axiosError = error as AxiosError;
				if (axiosError.response) {
					const status = axiosError.response.status;
					switch (status) {
						case 400:
							appError = new ValidationError(
								"タスクの削除に失敗しました。入力データが不正です。",
							);
							break;
						case 404:
							appError = new NotFoundError(
								"タスクの削除に失敗しました。タスクが見つかりません。",
							);
							break;
						default:
							appError = new UnknownError(
								"タスクの取得中に予期しないエラーが発生しました。",
							);
							break;
					}
				} else {
					appError = new AppError(
						"タスクの削除中にネットワークエラーが発生しました。",
					);
				}
			} else {
				appError = new UnknownError(
					"タスクの削除中に予期しないエラーが発生しました。",
				);
			}

			Logger.error(appError);
			throw appError;
		}
	}
}
