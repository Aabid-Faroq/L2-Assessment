import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Target,
  FileText,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardProps {
  user: User;
}

// Define interfaces for our data
interface Goal {
  id: string;
  title: string;
  type: string;
  status: "completed" | "in_progress" | "not_started" | "blocked";
  progress: number;
}
interface Review {
  id: string;
  status: "completed" | "pending";
  cycle: string;
  type: string;
  rating: number;
  reviewee: { name: string };
}
interface Employee {
  id: string;
}

export default function Dashboard({ user }: DashboardProps) {
  // Separate query for each data type
  const { data: employees = [], isLoading: employeesLoading } = useQuery<
    Employee[]
  >({
    queryKey: ["employees"],
    queryFn: () => apiClient.get("/employees").then((res) => res.data),
    enabled: user.role === "hr" || user.role === "manager",
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: () => apiClient.get("/goals").then((res) => res.data),
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: () => apiClient.get("/reviews").then((res) => res.data),
  });

  const isLoading = employeesLoading || goalsLoading || reviewsLoading;

  // Calculate stats based on the fetched data
  const stats = (() => {
    if (user.role === "hr") {
      return {
        totalEmployees: employees.length,
        activeGoals: goals.filter((g) => g.status === "in_progress").length,
        pendingReviews: reviews.filter((r) => r.status === "pending").length,
        completedGoals: goals.filter((g) => g.status === "completed").length,
      };
    } else if (user.role === "manager") {
      return {
        teamSize: employees.length,
        activeGoals: goals.filter((g) => g.status === "in_progress").length,
        pendingReviews: reviews.filter((r) => r.status === "pending").length,
        completedGoals: goals.filter((g) => g.status === "completed").length,
      };
    } else {
      // employee
      return {
        totalGoals: goals.length,
        activeGoals: goals.filter((g) => g.status === "in_progress").length,
        pendingReviews: reviews.filter((r) => r.status === "pending").length,
        completedGoals: goals.filter((g) => g.status === "completed").length,
      };
    }
  })();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const getDashboardTitle = () => {
    switch (user?.role) {
      case "hr":
        return "HR Dashboard";
      case "manager":
        return "Manager Dashboard";
      case "employee":
        return "My Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getStatCards = () => {
    if (user?.role === "hr") {
      return [
        {
          title: "Total Employees",
          value: stats.totalEmployees,
          icon: Users,
          color: "text-blue-500",
        },
        {
          title: "Active Goals",
          value: stats.activeGoals,
          icon: Target,
          color: "text-green-500",
        },
        {
          title: "Pending Reviews",
          value: stats.pendingReviews,
          icon: Clock,
          color: "text-orange-500",
        },
        {
          title: "Completed Goals",
          value: stats.completedGoals,
          icon: CheckCircle,
          color: "text-purple-500",
        },
      ];
    } else if (user?.role === "manager") {
      return [
        {
          title: "Team Size",
          value: stats.teamSize,
          icon: Users,
          color: "text-blue-500",
        },
        {
          title: "Active Goals",
          value: stats.activeGoals,
          icon: Target,
          color: "text-green-500",
        },
        {
          title: "Pending Reviews",
          value: stats.pendingReviews,
          icon: Clock,
          color: "text-orange-500",
        },
        {
          title: "Completed Goals",
          value: stats.completedGoals,
          icon: CheckCircle,
          color: "text-purple-500",
        },
      ];
    } else {
      return [
        {
          title: "Total Goals",
          value: stats.totalGoals,
          icon: Target,
          color: "text-blue-500",
        },
        {
          title: "Active Goals",
          value: stats.activeGoals,
          icon: TrendingUp,
          color: "text-green-500",
        },
        {
          title: "Pending Reviews",
          value: stats.pendingReviews,
          icon: Clock,
          color: "text-orange-500",
        },
        {
          title: "Completed Goals",
          value: stats.completedGoals,
          icon: CheckCircle,
          color: "text-purple-500",
        },
      ];
    }
  };

  const goalStatusData = [
    {
      name: "Completed",
      value: goals.filter((g) => g.status === "completed").length,
      color: "hsl(var(--success))",
    },
    {
      name: "In Progress",
      value: goals.filter((g) => g.status === "in_progress").length,
      color: "hsl(var(--primary))",
    },
    {
      name: "Not Started",
      value: goals.filter((g) => g.status === "not_started").length,
      color: "hsl(var(--muted-foreground))",
    },
    {
      name: "Blocked",
      value: goals.filter((g) => g.status === "blocked").length,
      color: "hsl(var(--destructive))",
    },
  ];

  // Performance trend data (mock for now)
  const performanceData = [
    { month: "Jan", rating: 3.8 },
    { month: "Feb", rating: 4.1 },
    { month: "Mar", rating: 4.0 },
    { month: "Apr", rating: 4.2 },
    { month: "May", rating: 4.3 },
    { month: "Jun", rating: 4.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {getDashboardTitle()}
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your performance
          metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {getStatCards().map((stat, index) => (
          <Card
            key={index}
            className="shadow-elegant transition-all duration-300 hover:shadow-glow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Goal Status Distribution */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goal Status Distribution
            </CardTitle>
            <CardDescription>Overview of current goal statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {goalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Trend
            </CardTitle>
            <CardDescription>
              Average performance ratings (mock data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    domain={[0, 5]}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Goals */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Recent Goals
            </CardTitle>
            <CardDescription>Latest goal updates and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between rounded-lg bg-accent/50 p-3"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{goal.title}</h4>
                  <p className="text-sm text-muted-foreground">{goal.type}</p>
                  <Progress value={goal.progress} className="mt-2 h-2" />
                </div>
                <Badge
                  variant={
                    goal.status === "completed"
                      ? "default"
                      : goal.status === "blocked"
                        ? "destructive"
                        : "secondary"
                  }
                  className="ml-4"
                >
                  {goal.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Reviews
            </CardTitle>
            <CardDescription>
              Latest performance review activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between rounded-lg bg-accent/50 p-3"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">
                    {review.reviewee?.name || "Unknown"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {review.cycle} - {review.type}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Award className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Rating: {review.rating}/5
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    review.status === "completed" ? "default" : "secondary"
                  }
                  className="ml-4"
                >
                  {review.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
