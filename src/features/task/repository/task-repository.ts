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

  /**
   * タスクを更新する
   * @param {number} id - 更新するタスクのID
   * @param {string} title - 更新後のタスクのタイトル
   * @param {boolean} completed - タスクの完了状態
   * @returns {Promise<Task>} 更新されたタスクを含むPromise
   */
  update(id: number, title: string, completed: boolean): Promise<Task>;
}
