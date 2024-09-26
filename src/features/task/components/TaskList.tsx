import { Box, Center, Checkbox, Spinner, Text, VStack } from "@chakra-ui/react";
import { useTaskController } from "../hooks";
import type { Task } from "../types/task";
import { DeleteTaskButton } from "./DeleteTaskButton";
import { UpdateTaskButton } from "./UpdateTaskButton";

export const TaskList = () => {
	const { tasks, updateTask } = useTaskController();

	if (tasks.state === "loading") {
		return (
			<Center h="100vh">
				<Spinner />
			</Center>
		);
	}

	if (tasks.state === "hasError") {
		return (
			<Center h="100vh">
				<Text>エラーが発生しました</Text>
			</Center>
		);
	}

	if (tasks.state === "hasData" && tasks.data.length === 0) {
		return (
			<Center h="100vh">
				<Text>タスクなし</Text>
			</Center>
		);
	}

	return (
		<Box position="relative" minH="100vh">
			<VStack spacing={4} align="stretch">
				{tasks.data.map((task: Task) => (
					<Box
						key={task.id}
						p={4}
						borderWidth={1}
						borderRadius="md"
						display="flex"
						alignItems="center"
						onClick={async () =>
							await updateTask(task.id, task.title, !task.completed)
						}
					>
						<Checkbox
							isChecked={task.completed}
							onChange={async () =>
								await updateTask(task.id, task.title, !task.completed)
							}
							mr={3}
						/>
						<Box flex="1">
							<Text fontSize="sm" color="gray.500">
								ID: {task.id}
							</Text>
							<Text fontSize="lg" as={task.completed ? "s" : "span"}>
								{task.title}
							</Text>
						</Box>
						<UpdateTaskButton task={task} />
						<DeleteTaskButton task={task} />
					</Box>
				))}
			</VStack>
		</Box>
	);
};
