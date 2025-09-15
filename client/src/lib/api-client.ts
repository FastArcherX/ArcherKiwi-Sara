// Secure API client that replaces direct OpenAI usage
export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  confidence: number;
  type: string;
}

// Get user ID from auth (Firebase auth or similar)
const getUserId = () => {
  // TODO: Get from Firebase auth when implemented
  return 'demo-user';
};

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Note API
export const noteApi = {
  getAll: () => apiRequest('/notes'),
  getById: (id: string) => apiRequest(`/notes/${id}`),
  create: (note: any) => apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify(note),
  }),
  update: (id: string, note: any) => apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(note),
  }),
  delete: (id: string) => apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  }),
};

// Folder API
export const folderApi = {
  getAll: () => apiRequest('/folders'),
  create: (folder: any) => apiRequest('/folders', {
    method: 'POST',
    body: JSON.stringify(folder),
  }),
  delete: (id: string) => apiRequest(`/folders/${id}`, {
    method: 'DELETE',
  }),
};

// Secure AI API calls (server-side OpenAI)
export const aiApi = {
  analyzeImage: async (imageFile: File): Promise<AIAnalysisResult> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: {
        'x-user-id': getUserId(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    return response.json();
  },

  analyzePDF: async (pdfFile: File): Promise<AIAnalysisResult> => {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    
    const response = await fetch('/api/ai/analyze-pdf', {
      method: 'POST',
      headers: {
        'x-user-id': getUserId(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze PDF');
    }

    return response.json();
  },

  analyzeAudio: async (audioFile: File): Promise<AIAnalysisResult> => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    const response = await fetch('/api/ai/analyze-audio', {
      method: 'POST',
      headers: {
        'x-user-id': getUserId(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze audio');
    }

    return response.json();
  },

  analyzeYouTube: async (url: string): Promise<AIAnalysisResult> => {
    return apiRequest('/ai/analyze-youtube', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  summarizeNote: async (content: string): Promise<AIAnalysisResult> => {
    return apiRequest('/ai/summarize-note', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};