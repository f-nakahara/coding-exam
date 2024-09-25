import { taskRepositoryProvider } from "@/core/providers/providers";
import { Logger } from "@/core/util/logger";
import { atom, useAtom } from "jotai";
import { loadable } from "jotai/utils";
import { Loadable } from "jotai/vanilla/utils/loadable";
import { TaskRepository } from "./repository/task-repository";
import { Task } from "./types/task";

/**
 * タスクの状態を管理するためのatomです。
 * 初期値は空の配列を解決するPromiseです。
 * loadableを使用して非同期操作をサポートし、ローディング状態や
 * エラー状態を簡単に扱えるようにします。
 */
const tasksAtom = atom<Task[]>([]);
const loadableTasksAtom = loadable(tasksAtom);

/**
 * タスクの状態を管理するためのカスタムフックです。
 * タスクの取得と状態の更新機能を提供します。
 *
 * @returns {Object} タスクの状態と操作関数を含むオブジェクト
 * @property {Loadable<Task[]>} tasks - 現在のタスクリスト。Loadable型でラップされており、
 *                                      ローディング中、エラー、データ取得済みの状態を表現できます。
 * @property {() => Promise<void>} fetchTasks - タスクを非同期で取得し、状態を更新する関数。
 *                                              この関数を呼び出すと、最新のタスクデータがサーバーから取得され、
 *                                              ローカルの状態が更新されます。エラーハンドリングは内部で行われます。
 */
export const useTaskController = (
  taskRepository: TaskRepository = taskRepositoryProvider
): {
  tasks: Loadable<Task[]>;
  fetchTasks: () => Promise<void>;
} => {
  const [, setTasks] = useAtom(tasksAtom);
  const [tasks] = useAtom(loadableTasksAtom);

  /**
   * タスクを非同期で取得し、状態を更新します。
   * この関数は外部APIを呼び出してタスクデータを取得し、
   * 取得したデータでローカルの状態を更新します。
   * try-catch文を使用してエラーハンドリングを行い、
   * エラーが発生した場合はコンソールにログを出力します。
   * loadableTasksAtomを利用して、ローディング状態、エラー状態、
   * データ取得済み状態を自動的に管理します。
   */
  const fetchTasks = async () => {
    try {
      Logger.debug("fetchTasks");
      const tasks = await taskRepository.findAll();
      setTasks(tasks);
    } catch (e) {
      Logger.error(e);
      setTasks([]);
    }
  };

  return {
    tasks,
    fetchTasks,
  };
};
