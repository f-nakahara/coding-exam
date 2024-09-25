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

  /**
   * タスクを追加する
   * @param {string} title - タスクのタイトル
   * @returns {Promise<Task>} 追加されたタスクを含むPromise
   */
  add(title: string): Promise<Task>;
}
