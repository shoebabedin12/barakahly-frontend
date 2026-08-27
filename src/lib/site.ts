import { apiPost } from "./api";

export function subscribeNewsletter(email: string) {
  return apiPost<{ message: string }>("/api/v1/newsletter/subscribe", { email }, { anonymous: true });
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function sendContactMessage(payload: ContactPayload) {
  return apiPost<{ message: string }>("/api/v1/contact", { ...payload }, { anonymous: true });
}
