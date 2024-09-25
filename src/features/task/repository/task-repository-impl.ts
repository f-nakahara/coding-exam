import { AppError, UnknownError } from "@/core/errors/errors";
import { Logger } from "@/core/util/logger";
import axios, { Axios, AxiosError } from "axios";
import { Task } from "../types/task";
import { TaskRepository } from "./task-repository";

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
      } else {
        throw new AppError(`予期しないステータスコード: ${response.status}`);
      }
    } catch (error) {
      let appError: AppError;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          appError = new AppError(
            `タスクの取得中にエラーが発生しました。ステータスコード: ${axiosError.response.status}`
          );
        } else {
          appError = new AppError(
            "タスクの取得中にネットワークエラーが発生しました。"
          );
        }
      } else {
        appError = new UnknownError(
          "タスクの取得中に予期しないエラーが発生しました。"
        );
      }

      Logger.error(appError);
      throw appError;
    }
  }
}
