/** Platform user core model */
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

/** Roadmap block model */
export interface RoadmapBlock {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

/** Learning material inside a roadmap block */
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

/** Unlockable gamification achievement */
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

/** Mentor 1-on-1 meeting request metadata */
export interface OneOnOneRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_bonus: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  created_at: string;
}
