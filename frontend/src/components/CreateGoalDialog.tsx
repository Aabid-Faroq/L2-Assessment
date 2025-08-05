import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/lib/auth";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface CreateGoalDialogProps {
  user: User;
  onGoalCreated: () => void;
}

interface Employee {
  id: string;
  name: string;
}

export function CreateGoalDialog({
  user,
  onGoalCreated,
}: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employeesForGoal"],
    queryFn: async () => {
      // We can enhance this later to only fetch direct reports for managers
      const { data } = await apiClient.get("/employees");
      return data;
    },
    enabled: open, // Only fetch when the dialog is open
  });

  const createGoalMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/goals", { title, description, type, employeeId }),
    onSuccess: () => {
      onGoalCreated();
      setOpen(false);
      // Reset form
      setTitle("");
      setDescription("");
      setType("");
      setEmployeeId("");
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      // Add a toast notification here
    },
  });

  const handleSubmit = () => {
    createGoalMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new goal</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new goal for an employee.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employee
            </Label>
            <Select onValueChange={setEmployeeId} value={employeeId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={createGoalMutation.isPending}
          >
            {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
