const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface APIResponse<T> {
  data: T;
  meta?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<APIResponse<T> | T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody: APIError = await response.json().catch(() => ({
      error: { code: "NETWORK_ERROR", message: "网络请求失败" },
    }));
    throw new Error(errorBody.error.message);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// --- Auth API ---
export const authAPI = {
  register(email: string, displayName: string, password: string) {
    return request<{ id: string }>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, display_name: displayName, password }),
    });
  },
  async login(email: string, password: string) {
    const result = await request<{
      access_token: string;
      refresh_token: string;
    }>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = result as { access_token: string; refresh_token: string };
    setTokens(data.access_token, data.refresh_token);
    return data;
  },
  logout() {
    clearTokens();
  },
};

// --- User API ---
export const userAPI = {
  getMe: () => request<UserProfile>(`/users/me`),
  updateMe: (data: Partial<UserProfile>) =>
    request<UserProfile>(`/users/me`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getLanguageProfiles: () =>
    request<LanguageProfile[]>(`/users/me/language-profiles`),
  createLanguageProfile: (data: CreateLanguageProfile) =>
    request<LanguageProfile>(`/users/me/language-profiles`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLanguageProfile: (lang: string, data: Partial<LanguageProfile>) =>
    request<LanguageProfile>(`/users/me/language-profiles/${lang}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// --- Materials API ---
export const materialsAPI = {
  list: (params?: {
    target_language?: string;
    proficiency_level?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.target_language)
      searchParams.set("target_language", params.target_language);
    if (params?.proficiency_level)
      searchParams.set("proficiency_level", params.proficiency_level);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size)
      searchParams.set("page_size", params.page_size.toString());
    const qs = searchParams.toString();
    return request<Material[]>(`/materials${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<MaterialDetail>(`/materials/${id}`),
  create: (data: CreateMaterial) =>
    request<Material>(`/materials`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/materials/${id}`, { method: "DELETE" }),
};

// --- Knowledge Points API ---
export const knowledgePointsAPI = {
  list: (params?: {
    target_language?: string;
    type?: string;
    proficiency_level?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.target_language)
      searchParams.set("target_language", params.target_language);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.proficiency_level)
      searchParams.set("proficiency_level", params.proficiency_level);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size)
      searchParams.set("page_size", params.page_size.toString());
    const qs = searchParams.toString();
    return request<KnowledgePoint[]>(`/knowledge-points${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<KnowledgePoint>(`/knowledge-points/${id}`),
};

export const dictionaryAPI = {
  lookup: (word: string) =>
    request<DictionaryEntry | null>(`/dictionary/lookup?word=${encodeURIComponent(word)}`),
  listIeltsVocabulary: () =>
    request<IeltsWord[]>(`/dictionary/ielts-vocabulary`),
};

// --- Admin API ---
export const adminAPI = {
  ingestVocabulary: (lang = "ja") =>
    request<{ message: string; data: Record<string, unknown> }>(
      `/admin/ingest/vocabulary?target_language=${lang}`,
      { method: "POST" }
    ),
  ingestGrammar: (lang = "ja") =>
    request<{ message: string; data: Record<string, unknown> }>(
      `/admin/ingest/grammar?target_language=${lang}`,
      { method: "POST" }
    ),
  ingestKanji: (lang = "ja") =>
    request<{ message: string; data: Record<string, unknown> }>(
      `/admin/ingest/kanji?target_language=${lang}`,
      { method: "POST" }
    ),
  ingestAll: (lang = "ja") =>
    request<{ message: string; data: Record<string, unknown> }>(
      `/admin/ingest/all?target_language=${lang}`,
      { method: "POST" }
    ),
};

// --- SSE Streaming helpers ---
const API_BASE_SSE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface SSEEvent {
  type: "token" | "done" | "error";
  content?: string;
}

/**
 * Stream an SSE response from the backend.
 * Calls `onToken` for each text chunk, `onDone` when complete, `onError` on failure.
 */
export async function streamRequest(
  path: string,
  body: Record<string, unknown>,
  callbacks: {
    onToken: (text: string) => void;
    onDone?: () => void;
    onError?: (msg: string) => void;
  },
): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_BASE_SSE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    callbacks.onError?.(`请求失败 (${response.status})`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError?.("无法读取响应流");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const event: SSEEvent = JSON.parse(line.slice(6));
        if (event.type === "token" && event.content) {
          callbacks.onToken(event.content);
        } else if (event.type === "done") {
          callbacks.onDone?.();
          return;
        } else if (event.type === "error") {
          callbacks.onError?.(event.content || "未知错误");
          return;
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  callbacks.onDone?.();
}

// --- Progress API ---
export const progressAPI = {
  getDueReviews: (targetLanguage?: string, limit = 20) => {
    const params = new URLSearchParams();
    if (targetLanguage) params.set("target_language", targetLanguage);
    params.set("limit", limit.toString());
    const qs = params.toString();
    return request<ReviewCard[]>(`/progress/reviews/due${qs ? `?${qs}` : ""}`);
  },
  submitReview: (data: { knowledge_point_id: string; quality: number; response_ms?: number }) =>
    request<ReviewResult>(`/progress/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  addCard: (knowledge_point_id: string) =>
    request<{ message: string; data: Record<string, unknown> }>(`/progress/cards/add`, {
      method: "POST",
      body: JSON.stringify({ knowledge_point_id }),
    }),
  getStats: (targetLanguage?: string) => {
    const qs = targetLanguage ? `?target_language=${targetLanguage}` : "";
    return request<ProgressStats>(`/progress/stats${qs}`);
  },
};

// --- Types ---
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  native_language: string;
  daily_goal: number;
  preferences: Record<string, unknown>;
  streak_days: number;
  created_at: string;
}

export interface LanguageProfile {
  id: string;
  target_language: string;
  current_level: string;
  target_level: string;
  level_system: string;
  daily_goal: number;
  streak_days: number;
  created_at: string;
}

export interface CreateLanguageProfile {
  target_language: string;
  current_level: string;
  target_level: string;
  level_system: string;
  daily_goal?: number;
}

export interface Material {
  id: string;
  title: string;
  content_text: string;
  target_language: string;
  source_type: string;
  proficiency_level: string;
  level_system: string;
  difficulty: number;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MaterialChunk {
  id: string;
  chunk_index: number;
  text_target: string;
  text_zh: string | null;
  reading: string | null;
  chunk_type: string;
  token_count: number | null;
}

export interface MaterialDetail extends Material {
  chunks: MaterialChunk[];
}

export interface CreateMaterial {
  title: string;
  content_text: string;
  target_language: string;
  source_type?: string;
  proficiency_level: string;
  level_system: string;
}

export interface KnowledgePoint {
  id: string;
  target_language: string;
  type: string;
  proficiency_level: string;
  level_system: string;
  surface_form: string;
  reading: string | null;
  pronunciation: string | null;
  meaning_zh: string;
  meaning_en: string | null;
  pos: string | null;
  explanation_zh: string | null;
  example_target: string[] | null;
  example_zh: string[] | null;
  metadata: Record<string, unknown>;
  source: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface DictionaryEntry {
  surface_form: string;
  pronunciation: string;
  meaning_zh: string;
  meaning_en: string;
  pos: string;
  proficiency_level: string;
}

export interface IeltsWord {
  word: string;
  pronunciation: string;
  pos: string;
  meaning_zh: string;
  meaning_en: string;
  example: string;
  example_zh: string;
  band: string;
  cefr: "B2" | "C1" | "C2";
  frequency_band: string;
  topic: string;
}

export interface ProgressStats {
  total_cards: number;
  new: number;
  learning: number;
  young: number;
  mature: number;
  relearning: number;
  due_today: number;
  reviewed_today: number;
  streak: number;
}

export interface ReviewCard {
  progress_id: string;
  knowledge_point_id: string;
  surface_form: string;
  reading: string | null;
  pronunciation: string | null;
  meaning_zh: string;
  meaning_en: string | null;
  pos: string | null;
  type: string;
  target_language: string;
  proficiency_level: string;
  example_target: string[] | null;
  example_zh: string[] | null;
  explanation_zh: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
  mastery_level: string;
  next_review_date: string;
  priority: number;
}

export interface ReviewResult {
  was_correct: boolean;
  next_review: string;
  interval_days: number;
  ease_factor: number;
  mastery_level: string;
}
