// types/index.ts

export interface User {
  id: string;
  login: string;
  display_name: string;
  avatar_url?: string;
  about?: string;
  telegram_username?: string;
  learning_started_at?: string;
  roles: ("student" | "buddy" | "admin")[];
  is_deleted: boolean;
}

export interface RoadmapBlock {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

export interface RoadmapMaterial {
  id: string;
  block_id: string;
  title: string;
  description?: string;
  type: "theory" | "questions" | "practice" | "homework";
  content_type: "url" | "youtube" | "github" | "article" | "text" | "file";
  url?: string;
  content?: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward_bonus: number;
  image_url: string;
  condition_type: string;
  is_active: boolean;
  sort_order: number;
}

export interface OneOnOneRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_bonus: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  created_at: string;
}
