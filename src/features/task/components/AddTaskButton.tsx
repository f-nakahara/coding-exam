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

export const AddTaskButton = () => {
	const { addTask, fetchTasks } = useTaskController();
	const [isOpen, setIsOpen] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const toast = useToast();

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => {
		setIsOpen(false);
		setTaskTitle("");
		setError(null);
	};

	const handleAddTask = async () => {
		if (!taskTitle) return;
		setIsLoading(true);
		try {
			await addTask(taskTitle);
			await fetchTasks();
			toast({
				title: "タスクが追加されました",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			handleClose();
		} catch (e) {
			setError("タスクの追加に失敗しました。");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button onClick={handleOpen}>新規作成</Button>
			<Modal isOpen={isOpen} onClose={handleClose} isCentered>
				<ModalOverlay />
				<ModalContent m={4}>
					<ModalHeader>新しいタスクを追加</ModalHeader>
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
							onClick={handleAddTask}
							isLoading={isLoading}
							isDisabled={!taskTitle}
						>
							作成
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
