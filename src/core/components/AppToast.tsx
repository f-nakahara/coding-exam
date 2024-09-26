import { useToast as useChakraToast } from "@chakra-ui/react";
import { useCallback } from "react";

type ToastType = "success" | "error";

interface ToastOptions {
	title: string;
	description?: string;
	duration?: number;
	isClosable?: boolean;
}

export const useAppToast = () => {
	const chakraToast = useChakraToast();

	const showToast = useCallback(
		(type: ToastType, options: ToastOptions) => {
			const {
				title,
				description,
				duration = 3000,
				isClosable = true,
			} = options;

			chakraToast({
				title,
				description,
				status: type,
				duration,
				isClosable,
				position: "bottom",
			});
		},
		[chakraToast],
	);

	return {
		showSuccessToast: (options: ToastOptions) => showToast("success", options),
		showErrorToast: (options: ToastOptions) => showToast("error", options),
	};
};
