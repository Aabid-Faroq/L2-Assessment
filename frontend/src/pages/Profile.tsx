import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface ProfileProps {
  currentUser: User;
}

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: string;
}

export default function Profile({ currentUser }: ProfileProps) {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [editableProfile, setEditableProfile] =
    useState<EmployeeProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery<EmployeeProfile>({
    queryKey: ["employeeProfile", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/employees/${id}`);
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (profile) {
      // Format dates for the HTML date input, which expects YYYY-MM-DD
      const formatted = {
        ...profile,
        dob: profile.dob
          ? new Date(profile.dob).toISOString().split("T")[0]
          : "",
        joiningDate: profile.joiningDate
          ? new Date(profile.joiningDate).toISOString().split("T")[0]
          : "",
      };
      setEditableProfile(formatted);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (updatedProfile: Partial<EmployeeProfile>) => {
      const { id: profileId, email, ...updateData } = updatedProfile;
      return apiClient.patch(`/employees/${profileId}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeProfile", id] });
      setIsEditing(false);
      // Optional: Add a success toast here
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      // Optional: Add an error toast here
    },
  });

  const canEdit = currentUser.role === "hr" || currentUser.employeeId === id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableProfile) {
      const { name, value } = e.target;
      setEditableProfile({ ...editableProfile, [name]: value });
    }
  };

  const handleSave = () => {
    if (editableProfile) {
      updateMutation.mutate(editableProfile);
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!editableProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Profile</CardTitle>
        {canEdit && (
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={editableProfile.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={editableProfile.email}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={editableProfile.phone ?? ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={editableProfile.dob}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={editableProfile.department}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              value={editableProfile.designation}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joiningDate">Joining Date</Label>
            <Input
              id="joiningDate"
              name="joiningDate"
              type="date"
              value={editableProfile.joiningDate}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              value={editableProfile.status}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        {isEditing && (
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
