import type { TaskRepository } from "@/features/task/repository/task-repository";
import { TaskRepositoryImpl } from "@/features/task/repository/task-repository-impl";
import axios from "axios";
import { Config } from "../util/config";

export const taskRepositoryProvider: TaskRepository = new TaskRepositoryImpl(
	axios.create({
		baseURL: Config.apiHost,
	}),
);
