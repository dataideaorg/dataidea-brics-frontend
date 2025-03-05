// User types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  owner: number;
  members: number[];
}

// Analytics types
export interface Session {
  id: number;
  userId: number | null;
  sessionId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
  };
  location: {
    country: string;
    city: string;
  };
  projectId: number;
}

export interface Prompt {
  id: number;
  sessionId: string;
  userId: number | null;
  projectId: number;
  modelId: string;
  promptText: string;
  responseText: string;
  promptTokens: number;
  responseTokens: number;
  latency: number;
  timestamp: string;
  metadata: {
    category?: string;
    language?: string;
    [key: string]: any;
  };
}

export interface Feedback {
  id: number;
  promptId: number;
  userId: number | null;
  rating: number;
  comment: string | null;
  category: string | null;
  timestamp: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  version: string;
}

// Dashboard types
export interface DashboardStats {
  totalSessions: number;
  activeUsers: number;
  totalPrompts: number;
  avgFeedbackScore: number;
  sessionsTrend: number;
  usersTrend: number;
  promptsTrend: number;
  feedbackTrend: number;
  totalUsers: number;
  avgLatency: number;
  totalTokens: number;
  promptsPerDay: DailyCount[];
  modelUsage: ModelUsage[];
  topCategories: CategoryCount[];
}

export interface TimeSeriesData {
  name: string;
  sessions?: number;
  prompts?: number;
  feedback?: number;
  users?: number;
}

export interface PieChartData {
  name: string;
  value: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface ProjectFilter {
  projectId: number | null;
}

export interface ModelFilter {
  modelId: string | null;
}

export interface UserFilter {
  userId: number | null;
}

export type TimeRange = 'day' | 'week' | 'month' | 'year' | 'custom';

// Authentication types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface ModelUsage {
  model: string;
  count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface PromptFilters {
  modelId?: string;
  projectId?: number;
  userId?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface QueryParams {
  page: number;
  page_size: number;
  search?: string;
  ordering?: string;
  [key: string]: any;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
} 