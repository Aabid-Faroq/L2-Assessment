import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/input";

interface ReviewCycleDetailsProps {
  user: User;
}

interface Review {
  id: string;
  rating: number;
  feedback: string;
  reviewee: { name: string };
  reviewer: { name: string };
}

interface ReviewCycle {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export default function ReviewCycleDetails({ user }: ReviewCycleDetailsProps) {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<{
    cycle: ReviewCycle;
    reviews: Review[];
  }>({
    queryKey: ["reviewCycleDetails", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/reviews/cycles/${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading review cycle details...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data?.cycle?.name}</CardTitle>
          <CardDescription>
            {new Date(data?.cycle?.start_date).toLocaleDateString()} -{" "}
            {new Date(data?.cycle?.end_date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Employee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee to review" />
                </SelectTrigger>
                <SelectContent>{/* Populate with employees */}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input type="number" min="1" max="5" />
            </div>
            <div>
              <Label>Feedback</Label>
              <Textarea />
            </div>
            <Button>Submit</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submitted Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.reviews.map((r) => (
              <div key={r.id} className="border-b p-2">
                <p>
                  <strong>To:</strong> {r.reviewee.name}
                </p>
                <p>
                  <strong>From:</strong> {r.reviewer.name}
                </p>
                <p>
                  <strong>Rating:</strong> {r.rating}
                </p>
                <p>{r.feedback}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
