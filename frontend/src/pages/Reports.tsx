import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/auth";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface ReportsProps {
  user: User;
}

interface GoalCompletionReport {
  name: string;
  rate: number;
}

export default function Reports({ user }: ReportsProps) {
  const { data: goalCompletion, isLoading } = useQuery<GoalCompletionReport[]>({
    queryKey: ["goalCompletionReport"],
    queryFn: async () => {
      const { data } = await apiClient.get("/reports/goal-completion");
      return data;
    },
    enabled: user.role === "hr" || user.role === "manager",
  });

  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  if (user.role !== "hr" && user.role !== "manager") {
    return <div>You do not have permission to view reports.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Goal Completion Rate by Department</CardTitle>
        </CardHeader>
        <CardContent style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={goalCompletion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="rate" fill="#8884d8" name="Completion Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
