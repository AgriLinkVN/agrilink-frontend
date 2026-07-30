interface MessageContainer {
  message?: unknown;
}

function hasMessage(value: unknown): value is MessageContainer {
  return typeof value === "object" && value !== null && "message" in value;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (hasMessage(error)) {
    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
    if (Array.isArray(error.message)) {
      const messages = error.message.filter(
        (item): item is string => typeof item === "string" && item.trim() !== "",
      );
      if (messages.length > 0) {
        return messages.join(", ");
      }
    }
  }

  return fallback;
}
