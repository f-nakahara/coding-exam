import { Task } from "../types/task";

/**
 * タスクリポジトリインターフェース
 */
export interface TaskRepository {
  /**
   * タスクを取得する
   * @returns {Promise<Task[]>} タスクの配列を含むPromise
   */
  findAll(): Promise<Task[]>;
}
