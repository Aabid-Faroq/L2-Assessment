import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User } from "@/lib/auth";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Label } from "@/components/ui/label";

interface GoalsProps {
  user: User;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  progress: number;
  employeeId: string;
  employee: {
    name: string;
  };
}

export default function Goals({ user }: GoalsProps) {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data } = await apiClient.get("/goals");
      return data;
    },
  });

  const canCreate = user.role === "hr" || user.role === "manager";

  const updateProgressMutation = useMutation({
    mutationFn: ({
      goalId,
      progress,
    }: {
      goalId: string;
      progress: number;
    }) => {
      return apiClient.patch(`/goals/${goalId}`, { progress }); // Assuming a PATCH endpoint exists
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const handleProgressUpdate = (goalId: string, progress: number) => {
    updateProgressMutation.mutate({ goalId, progress });
  };

  if (isLoading) {
    return <div>Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">
            Track and manage goals for yourself and your team.
          </p>
        </div>
        {canCreate && (
          <CreateGoalDialog
            user={user}
            onGoalCreated={() =>
              queryClient.invalidateQueries({ queryKey: ["goals"] })
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>For: {goal.employee.name}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => alert("Edit Goal")}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert("Delete Goal")}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    goal.status === "completed" ? "default" : "secondary"
                  }
                >
                  {goal.status.replace("_", " ")}
                </Badge>
                <span className="text-sm font-medium">{goal.type}</span>
              </div>
              <div>
                <Label>Progress: {goal.progress}%</Label>
                <Progress value={goal.progress} className="mt-1" />
                {user.employeeId === goal.employeeId && (
                  <div className="mt-2 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleProgressUpdate(
                          goal.id,
                          Math.max(0, goal.progress - 10)
                        )
                      }
                    >
                      -10%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleProgressUpdate(
                          goal.id,
                          Math.min(100, goal.progress + 10)
                        )
                      }
                    >
                      +10%
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
