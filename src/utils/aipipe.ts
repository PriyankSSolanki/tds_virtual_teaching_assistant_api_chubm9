// AI Pipe integration utilities
export interface AIPipeProfile {
  email: string;
  token: string;
}

export class AIPipeAuth {
  private static readonly AIPIPE_LOGIN_URL = 'https://aipipe.org/login';
  private static readonly AIPIPE_BASE_URL = 'https://aipipe.org';
  private static readonly TOKEN_KEY = 'aipipe_token';
  private static readonly EMAIL_KEY = 'aipipe_email';

  static getStoredProfile(): AIPipeProfile | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const email = localStorage.getItem(this.EMAIL_KEY);
    
    if (token && email) {
      return { token, email };
    }
    
    return null;
  }

  static storeProfile(profile: AIPipeProfile): void {
    localStorage.setItem(this.TOKEN_KEY, profile.token);
    localStorage.setItem(this.EMAIL_KEY, profile.email);
  }

  static clearProfile(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
  }

  static redirectToLogin(): void {
    const currentUrl = window.location.href;
    const loginUrl = `${this.AIPIPE_LOGIN_URL}?redirect=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
  }

  static getProfile(): AIPipeProfile | null {
    // First check if we have stored credentials
    const stored = this.getStoredProfile();
    if (stored) {
      return stored;
    }

    // Check URL parameters for token and email after redirect
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (token && email) {
      const profile = { token, email };
      this.storeProfile(profile);
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      newUrl.searchParams.delete('email');
      window.history.replaceState({}, '', newUrl.toString());
      
      return profile;
    }

    return null;
  }

  static async makeAPICall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const profile = this.getProfile();
    if (!profile) {
      throw new Error('No AI Pipe authentication found');
    }

    const headers = {
      'Authorization': `Bearer ${profile.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(`${this.AIPIPE_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  }

  static async getUsage(): Promise<any> {
    const response = await this.makeAPICall('/usage');
    if (!response.ok) {
      throw new Error('Failed to fetch usage data');
    }
    return response.json();
  }

  static async callOpenAI(messages: any[], model: string = 'gpt-4o-mini'): Promise<any> {
    const response = await this.makeAPICall('/openai/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to call OpenAI API');
    }

    return response.json();
  }
}
