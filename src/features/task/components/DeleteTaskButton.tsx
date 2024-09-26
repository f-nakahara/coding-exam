import { useAppToast } from "@/core/components/AppToast";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTaskController } from "../hooks";
import type { Task } from "../types/task";

export const DeleteTaskButton = ({ task }: { task: Task }) => {
	const { removeTask } = useTaskController();
	const [isLoading, setIsLoading] = useState(false);
	const { showSuccessToast, showErrorToast } = useAppToast();

	const handleDeleteTask = async () => {
		setIsLoading(true);
		try {
			await removeTask(task.id);
			showSuccessToast({
				title: "タスクが削除されました",
			});
		} catch (e) {
			showErrorToast({
				title: "タスクの削除に失敗しました",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button colorScheme="red" onClick={handleDeleteTask} isLoading={isLoading}>
			削除
		</Button>
	);
};
