import { AppError, UnknownError, ValidationError } from "@/core/errors/errors";
import { Config } from "@/core/util/config";
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

  async add(title: string): Promise<Task> {
    try {
      const body = {
        title,
      };
      const response = await axios.post(`${Config.apiHost}/todos`, body);

      if (response.status === 200) {
        const newTask: Task = response.data;
        Logger.debug(newTask);
        return newTask;
      } else {
        throw new AppError(`予期しないステータスコード: ${response.status}`);
      }
    } catch (error) {
      let appError: AppError;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 400) {
            appError = new ValidationError(
              "タスクの追加に失敗しました。入力データが不正です。"
            );
          } else {
            appError = new AppError(
              `タスクの追加中にエラーが発生しました。ステータスコード: ${axiosError.response.status}`
            );
          }
        } else {
          appError = new AppError(
            "タスクの追加中にネットワークエラーが発生しました。"
          );
        }
      } else {
        appError = new UnknownError(
          "タスクの追加中に予期しないエラーが発生しました。"
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
      const response = await axios.put(`${Config.apiHost}/todos/${id}`, body);

      if (response.status === 200) {
        const updatedTask: Task = response.data;
        Logger.debug(updatedTask);
        return updatedTask;
      } else {
        throw new AppError(`予期しないステータスコード: ${response.status}`);
      }
    } catch (error) {
      let appError: AppError;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 400) {
            appError = new ValidationError(
              "タスクの更新に失敗しました。入力データが不正です。"
            );
          } else {
            appError = new AppError(
              `タスクの更新中にエラーが発生しました。ステータスコード: ${axiosError.response.status}`
            );
          }
        } else {
          appError = new AppError(
            "タスクの更新中にネットワークエラーが発生しました。"
          );
        }
      } else {
        appError = new UnknownError(
          "タスクの更新中に予期しないエラーが発生しました。"
        );
      }

      Logger.error(appError);
      throw appError;
    }
  }
}
