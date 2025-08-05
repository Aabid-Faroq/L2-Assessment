import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/auth";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface SkillsProps {
  user: User;
}

interface SkillAssessment {
  id: string;
  selfRating: number;
  managerRating: number;
  skill: {
    name: string;
  };
}

export default function Skills({ user }: SkillsProps) {
  const { data: skills = [], isLoading } = useQuery<SkillAssessment[]>({
    queryKey: ["skills", user.employeeId],
    queryFn: async () => {
      const { data } = await apiClient.get("/skills");
      return data;
    },
    enabled: !!user.employeeId,
  });

  const chartData = skills.map((s) => ({
    skill: s.skill.name,
    "Self-Rating": s.selfRating,
    "Manager-Rating": s.managerRating,
  }));

  if (isLoading) {
    return <div>Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Skill Assessment</h1>
      <Card>
        <CardHeader>
          <CardTitle>My Skills</CardTitle>
        </CardHeader>
        <CardContent style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar
                name="Self Rating"
                dataKey="Self-Rating"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Manager Rating"
                dataKey="Manager-Rating"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
