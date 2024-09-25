import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useTaskController } from "../hooks";
import { Task } from "../types/task";

export const DeleteTaskButton = ({ task }: { task: Task }) => {
  const { removeTask } = useTaskController();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      await removeTask(task.id);
      toast({
        title: "タスクが削除されました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "タスクの削除に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
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
