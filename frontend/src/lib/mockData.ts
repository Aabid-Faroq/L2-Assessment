export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  department: string;
  designation: string;
  joiningDate: string;
  managerId?: string;
  status: "active" | "inactive";
  profileImage?: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  type: "quarterly" | "annual";
  status: "not_started" | "in_progress" | "completed" | "blocked";
  weightage?: number;
  createdDate: string;
  dueDate: string;
  progress: number;
}

export interface Review {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycle: string;
  type: "self" | "manager" | "peer" | "direct_report";
  overallRating: number;
  feedback: string;
  skillRatings: SkillRating[];
  status: "pending" | "completed";
  createdDate: string;
  dueDate: string;
}

export interface SkillRating {
  skillId: string;
  rating: number;
  expectedRating: number;
}

export interface Skill {
  id: string;
  name: string;
  category: "communication" | "technical" | "leadership" | "problem_solving";
  description: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    phone: "+1-555-0101",
    dateOfBirth: "1985-03-15",
    department: "Human Resources",
    designation: "HR Director",
    joiningDate: "2020-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "David Chen",
    email: "david@company.com",
    phone: "+1-555-0102",
    dateOfBirth: "1982-07-22",
    department: "Engineering",
    designation: "Engineering Manager",
    joiningDate: "2019-03-10",
    status: "active",
  },
  {
    id: "3",
    name: "Alice Smith",
    email: "alice@company.com",
    phone: "+1-555-0103",
    dateOfBirth: "1990-11-08",
    department: "Engineering",
    designation: "Senior Developer",
    joiningDate: "2021-06-01",
    managerId: "2",
    status: "active",
  },
  {
    id: "4",
    name: "John Doe",
    email: "john@company.com",
    phone: "+1-555-0104",
    dateOfBirth: "1988-05-12",
    department: "Engineering",
    designation: "Full Stack Developer",
    joiningDate: "2022-01-15",
    managerId: "2",
    status: "active",
  },
  {
    id: "5",
    name: "Mary Wilson",
    email: "mary@company.com",
    phone: "+1-555-0105",
    dateOfBirth: "1992-09-03",
    department: "Marketing",
    designation: "Marketing Specialist",
    joiningDate: "2022-08-20",
    managerId: "2",
    status: "active",
  },
];

export const mockSkills: Skill[] = [
  {
    id: "1",
    name: "Communication",
    category: "communication",
    description: "Verbal and written communication skills",
  },
  {
    id: "2",
    name: "Team Collaboration",
    category: "communication",
    description: "Working effectively in teams",
  },
  {
    id: "3",
    name: "React Development",
    category: "technical",
    description: "Frontend development with React",
  },
  {
    id: "4",
    name: "Database Design",
    category: "technical",
    description: "SQL and database architecture",
  },
  {
    id: "5",
    name: "Project Management",
    category: "leadership",
    description: "Planning and executing projects",
  },
  {
    id: "6",
    name: "Mentoring",
    category: "leadership",
    description: "Guiding and developing team members",
  },
  {
    id: "7",
    name: "Critical Thinking",
    category: "problem_solving",
    description: "Analytical problem-solving abilities",
  },
  {
    id: "8",
    name: "Innovation",
    category: "problem_solving",
    description: "Creative solution development",
  },
];

export const mockGoals: Goal[] = [
  {
    id: "1",
    employeeId: "3",
    title: "Complete React Certification",
    description:
      "Obtain React Advanced Certification to improve frontend skills",
    type: "quarterly",
    status: "in_progress",
    weightage: 30,
    createdDate: "2024-01-01",
    dueDate: "2024-03-31",
    progress: 65,
  },
  {
    id: "2",
    employeeId: "3",
    title: "Lead New Feature Development",
    description: "Take ownership of the user dashboard redesign project",
    type: "quarterly",
    status: "completed",
    weightage: 40,
    createdDate: "2024-01-01",
    dueDate: "2024-03-31",
    progress: 100,
  },
  {
    id: "3",
    employeeId: "4",
    title: "Improve Code Review Skills",
    description:
      "Participate in code reviews and provide constructive feedback",
    type: "quarterly",
    status: "in_progress",
    weightage: 25,
    createdDate: "2024-01-01",
    dueDate: "2024-03-31",
    progress: 40,
  },
  {
    id: "4",
    employeeId: "4",
    title: "Backend API Development",
    description: "Build and deploy 3 new REST APIs for the mobile app",
    type: "annual",
    status: "not_started",
    weightage: 50,
    createdDate: "2024-01-01",
    dueDate: "2024-12-31",
    progress: 0,
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    employeeId: "3",
    reviewerId: "3",
    cycle: "Q1 2024",
    type: "self",
    overallRating: 4,
    feedback:
      "I have made significant progress on my React skills and successfully led the dashboard redesign project.",
    skillRatings: [
      { skillId: "1", rating: 4, expectedRating: 4 },
      { skillId: "3", rating: 4, expectedRating: 5 },
      { skillId: "7", rating: 4, expectedRating: 4 },
    ],
    status: "completed",
    createdDate: "2024-03-01",
    dueDate: "2024-03-15",
  },
  {
    id: "2",
    employeeId: "3",
    reviewerId: "2",
    cycle: "Q1 2024",
    type: "manager",
    overallRating: 4,
    feedback:
      "Alice has shown excellent leadership in the dashboard project and improved her technical skills significantly.",
    skillRatings: [
      { skillId: "1", rating: 4, expectedRating: 4 },
      { skillId: "3", rating: 5, expectedRating: 5 },
      { skillId: "5", rating: 4, expectedRating: 3 },
    ],
    status: "completed",
    createdDate: "2024-03-01",
    dueDate: "2024-03-15",
  },
  {
    id: "3",
    employeeId: "4",
    reviewerId: "4",
    cycle: "Q1 2024",
    type: "self",
    overallRating: 3,
    feedback:
      "I am working on improving my code review skills and planning to start the backend API project soon.",
    skillRatings: [
      { skillId: "1", rating: 3, expectedRating: 4 },
      { skillId: "4", rating: 3, expectedRating: 4 },
      { skillId: "7", rating: 3, expectedRating: 4 },
    ],
    status: "pending",
    createdDate: "2024-03-01",
    dueDate: "2024-03-15",
  },
];
