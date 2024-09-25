import { AddTaskButton } from "@/features/task/components/AddTaskButton";
import { TaskList } from "@/features/task/components/TaskList";
import { Box } from "@chakra-ui/react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main" p={6} position="relative" minH="100vh">
        <TaskList />
        <Box position="fixed" bottom={4} right={4}>
          <AddTaskButton />
        </Box>
      </Box>
    </>
  );
}
