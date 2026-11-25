export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  phone?: string;
  bio?: string;
  plan: Plan;
  savedTuitionIds?: string[];
  createdAt?: string;
}

export interface Review {
  _id: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail?: string;
  tutorImage?: string;
  tutorPlan?: Plan;
  tutorBio?: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  isActive: boolean;
  reviews?: Review[];
  createdAt: string;
  applicantCount?: number;
  acceptedCount?: number;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Payment {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: Role;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface TuitionList {
  items: Tuition[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PlatformStats {
  totalStudents: number;
  verifiedTutors: number;
  availableTuitions: number;
  successfulConnections: number;
}
