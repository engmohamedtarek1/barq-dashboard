import AgentDetailsComponent from "@/components/agents/[agentId]";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل عامل التوصيل | برق",
  description: "هذه هي صفحة تفاصيل عامل التوصيل حيث يمكنك إدارة بيانات عامل التوصيل.",
};

export default function AgentDetailsPage() {
  return <AgentDetailsComponent />;
}
