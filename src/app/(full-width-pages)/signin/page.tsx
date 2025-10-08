import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول | برق",
  description: "سجل دخولك إلى منصة برق",
};

export default function SignIn() {
  return <SignInForm />;
}
