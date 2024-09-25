import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTaskController } from "../hooks";
import type { Task } from "../types/task";

export const UpdateTaskButton = ({ task }: { task: Task }) => {
	const { updateTask, fetchTasks } = useTaskController();
	const [isOpen, setIsOpen] = useState(false);
	const [taskTitle, setTaskTitle] = useState(task.title);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const toast = useToast();

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => {
		setIsOpen(false);
		setError(null);
	};

	const handleUpdateTask = async () => {
		if (!taskTitle) return;
		setIsLoading(true);
		try {
			await updateTask(task.id, taskTitle, task.completed);
			await fetchTasks();
			toast({
				title: "タスクが更新されました",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			handleClose();
		} catch (e) {
			setError("タスクの更新に失敗しました。");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button onClick={handleOpen}>編集</Button>
			<Modal isOpen={isOpen} onClose={handleClose} isCentered>
				<ModalOverlay />
				<ModalContent m={4}>
					<ModalHeader>タスクを更新</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							placeholder="タスクのタイトルを入力"
							value={taskTitle}
							onChange={(e) => setTaskTitle(e.target.value)}
						/>
						{error && <Text color="red.500">{error}</Text>}
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleUpdateTask}
							isLoading={isLoading}
							isDisabled={!taskTitle}
						>
							更新
						</Button>
						<Button variant="ghost" onClick={handleClose}>
							キャンセル
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
