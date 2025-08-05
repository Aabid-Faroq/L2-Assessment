import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { CreateReviewCycleDialog } from "@/components/CreateReviewCycleDialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface ReviewsProps {
  user: User;
}

interface ReviewCycle {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function Reviews({ user }: ReviewsProps) {
  const queryClient = useQueryClient();
  const { data: reviewCycles = [], isLoading } = useQuery<ReviewCycle[]>({
    queryKey: ["reviewCycles"],
    queryFn: async () => {
      const { data } = await apiClient.get("/reviews/cycles");
      return data;
    },
  });

  const canCreate = user.role === "hr";

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Reviews</h1>
          <p className="text-muted-foreground">
            Manage and participate in review cycles.
          </p>
        </div>
        {canCreate && (
          <CreateReviewCycleDialog
            onReviewCycleCreated={() =>
              queryClient.invalidateQueries({ queryKey: ["reviewCycles"] })
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviewCycles.map((cycle) => (
          <Card key={cycle.id}>
            <CardHeader>
              <CardTitle>{cycle.name}</CardTitle>
              <CardDescription>
                {new Date(cycle.start_date).toLocaleDateString()} -{" "}
                {new Date(cycle.end_date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col justify-between">
              <div>
                <Badge>{cycle.status}</Badge>
              </div>
              <div className="mt-4">
                <Button asChild>
                  <Link to={`/reviews/${cycle.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
