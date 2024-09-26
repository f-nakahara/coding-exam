import { taskRepositoryProvider } from "@/core/providers/providers";
import { Logger } from "@/core/util/logger";
import { atom, useAtom } from "jotai";
import { loadable } from "jotai/utils";
import type { Loadable } from "jotai/vanilla/utils/loadable";
import { useEffect } from "react";
import type { TaskRepository } from "./repository/task-repository";
import type { Task } from "./types/task";

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
	taskRepository: TaskRepository = taskRepositoryProvider,
): {
	tasks: Loadable<Task[]>;
	fetchTasks: () => Promise<void>;
	addTask: (title: string) => Promise<void>;
	updateTask: (id: number, title: string, completed: boolean) => Promise<void>;
	removeTask: (id: number) => Promise<void>;
} => {
	const [, setTasks] = useAtom(tasksAtom);
	const [tasks] = useAtom(loadableTasksAtom);

	useEffect(() => {
		fetchTasks();
	}, []);

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
			const tasks = await taskRepository.findAll();
			setTasks(tasks);
		} catch (e) {
			Logger.error(e);
			setTasks([]);
		}
	};

	/**
	 * 新しいタスクを追加し、タスクリストの状態を更新する非同期関数です。
	 *
	 * @param {string} title - 追加するタスクのタイトル
	 * @returns {Promise<void>}
	 *
	 * この関数は以下の手順で動作します：
	 * 1. 指定されたタイトルで新しいタスクを追加するAPIを呼び出します。
	 * 2. APIコールが成功した場合、新しいタスクを既存のタスクリストに追加します。
	 * 3. タスクリストの現在の状態に応じて、適切に状態を更新します。
	 * 4. エラーが発生した場合、エラーをログに記録し、タスクリストを空にリセットします。
	 *
	 * 注意：この関数はtry-catch文を使用してエラーハンドリングを行います。
	 */
	const addTask = async (title: string): Promise<void> => {
		try {
			await taskRepository.add(title);
			await fetchTasks();
		} catch (e) {
			Logger.error(e);
		}
	};

	/**
	 * タスクを更新する
	 * @param {number} id - 更新するタスクのID
	 * @param {string} title - 更新後のタスクのタイトル
	 * @param {boolean} completed - タスクの完了状態
	 * @returns {Promise<void>}
	 */
	const updateTask = async (
		id: number,
		title: string,
		completed: boolean,
	): Promise<void> => {
		try {
			await taskRepository.update(id, title, completed);
			await fetchTasks();
		} catch (e) {
			const error = e as Error;
			Logger.error(error);
		}
	};

	/**
	 * タスクを削除する
	 * @param {number} id - 削除するタスクのID
	 * @returns {Promise<void>}
	 */
	const removeTask = async (id: number): Promise<void> => {
		try {
			await taskRepository.remove(id);
			await fetchTasks();
		} catch (e) {
			Logger.error(e);
		}
	};

	return {
		tasks,
		fetchTasks,
		addTask,
		updateTask,
		removeTask,
	};
};
