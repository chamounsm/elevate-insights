const API_BASE_URL = 'http://10.164.242.43:5000';

export interface ChatbotQueryRequest {
  query: string;
  model?: string;
}

export interface ChatbotQueryResponse {
  status: 'success' | 'error';
  query: string;
  result: string;
  model_used: string;
  message?: string;
  error?: string;
}

export const chatbotApi = {
  async sendQuery(request: ChatbotQueryRequest): Promise<ChatbotQueryResponse> {
    try {
      console.log('📤 Sending query to chatbot API:', {
        url: `${API_BASE_URL}/query`,
        payload: request,
      });

      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received response from chatbot API:', data);
      return data;
    } catch (error) {
      console.error('❌ Error sending query to chatbot API:', error);
      throw error;
    }
  },


  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}; 