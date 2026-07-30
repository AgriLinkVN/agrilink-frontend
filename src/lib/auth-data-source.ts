import { runtimeConfig, getApiBaseUrl } from "@/config/runtime-config";
import {
  DEMO_OTP,
  DEMO_PASSWORD,
  demoUsers,
} from "@/demo/fixtures";
import type { User } from "@/types";

export interface LoginResult {
  accessToken: string;
  user: User;
}

export interface AuthDataSource {
  login(
    email: string,
    credential: string,
    method: "password" | "otp",
  ): Promise<LoginResult>;
  sendLoginOtp(email: string): Promise<void>;
}

function readMessage(value: unknown, fallback: string): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }
  return fallback;
}

const demoAuthDataSource: AuthDataSource = {
  async login(email, credential, method) {
    const user = demoUsers.find((candidate) => candidate.email === email);
    const validCredential =
      method === "password"
        ? credential === DEMO_PASSWORD
        : credential === DEMO_OTP;

    if (!user || !validCredential) {
      throw new Error(
        method === "password"
          ? "Tài khoản demo hoặc mật khẩu không đúng."
          : "Email demo hoặc mã OTP không đúng.",
      );
    }

    return {
      accessToken: `demo-session:${user.id}`,
      user,
    };
  },
  async sendLoginOtp(email) {
    if (!demoUsers.some((user) => user.email === email)) {
      throw new Error("Email này không thuộc danh sách tài khoản demo.");
    }
  },
};

const apiAuthDataSource: AuthDataSource = {
  async login(email, credential, method) {
    const endpoint = method === "password" ? "/auth/login" : "/auth/login-otp";
    const payload =
      method === "password"
        ? { email, password: credential }
        : { target: email, code: credential, purpose: "login" };

    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null);
      throw new Error(
        readMessage(
          body,
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        ),
      );
    }

    const payloadBody = (await response.json()) as {
      data?: { accessToken?: string };
      accessToken?: string;
    };
    const accessToken =
      payloadBody.data?.accessToken ?? payloadBody.accessToken;
    if (!accessToken) throw new Error("Không nhận được token từ máy chủ.");

    const userResponse = await fetch(`${getApiBaseUrl()}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userResponse.ok) {
      throw new Error("Không thể lấy thông tin người dùng.");
    }

    const userPayload = (await userResponse.json()) as { data?: User } & User;
    return {
      accessToken,
      user: userPayload.data ?? userPayload,
    };
  },

  async sendLoginOtp(email) {
    const response = await fetch(`${getApiBaseUrl()}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: email,
        purpose: "login",
        type: "email",
      }),
    });
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null);
      throw new Error(readMessage(body, "Lỗi gửi OTP"));
    }
  },
};

export const authDataSource: AuthDataSource = runtimeConfig.demoMode
  ? demoAuthDataSource
  : apiAuthDataSource;
