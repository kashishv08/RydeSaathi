import { useMutation } from "@tanstack/react-query";
import { createReviewApi } from "../api/reviewApi";

export function useSubmitReview() {
    return useMutation({
        mutationFn: (data) => createReviewApi(data),
        retry: false,
    });
}
