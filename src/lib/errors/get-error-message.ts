interface MessageCarrier {
  message?: unknown;
}

interface ResponseErrorCarrier {
  response?: {
    data?: unknown;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (!isRecord(value)) {
    return null;
  }

  const candidate = (value as MessageCarrier).message;
  return typeof candidate === "string" && candidate.trim() ? candidate : null;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi",
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  const directMessage = readMessage(error);
  if (directMessage) {
    return directMessage;
  }

  if (isRecord(error)) {
    const response = (error as ResponseErrorCarrier).response;
    const responseMessage = readMessage(response?.data);
    if (responseMessage) {
      return responseMessage;
    }
  }

  return fallback;
}
