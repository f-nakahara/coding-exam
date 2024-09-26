import { useAppToast } from "@/core/components/AppToast";
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
} from "@chakra-ui/react";
import { useState } from "react";
import { useTaskController } from "../hooks";

export const AddTaskButton = () => {
	const { addTask } = useTaskController();
	const [isOpen, setIsOpen] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [titleError, setTitleError] = useState<string | null>(null);
	const { showSuccessToast, showErrorToast } = useAppToast();

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
			showSuccessToast({
				title: "タスクが追加されました",
			});
			handleClose();
		} catch (e) {
			setError("タスクの追加に失敗しました。");
			showErrorToast({
				title: "エラー",
				description: "タスクの追加に失敗しました。",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const validateTaskTitle = (title: string): string | null => {
		if (!title) return "タイトルは必須です。";
		if (title.length > 20) return "タイトルは20文字以内で入力してください。";
		return null;
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
							onChange={(e) => {
								setTaskTitle(e.target.value);
								setTitleError(validateTaskTitle(e.target.value));
							}}
						/>
						{titleError && <Text color="red.500">{titleError}</Text>}
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleAddTask}
							isLoading={isLoading}
							isDisabled={!!titleError}
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
