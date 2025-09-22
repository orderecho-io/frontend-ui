// Local data service to replace Base44 functionality
export class LocalDataService {
  static async createLead(data) {
    // Simulate API call with local storage
    try {
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const newLead = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      };
      leads.push(newLead);
      localStorage.setItem('leads', JSON.stringify(leads));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Lead saved locally:', newLead);
      return newLead;
    } catch (error) {
      console.error('Error saving lead:', error);
      throw error;
    }
  }

  static async getLeads() {
    try {
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      return leads;
    } catch (error) {
      console.error('Error getting leads:', error);
      return [];
    }
  }
}

// Attempt remote submit first, then fallback to local storage
async function createLeadRemote(data) {
  const baseUrl = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8001/api";
  const url = `${baseUrl.replace(/\/$/, "")}/leads`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Remote submit failed: ${res.status} ${text}`);
  }
  return res.json();
}

// Export for backward compatibility
export const Lead = {
  create: async (data) => {
    try {
      // Prefer secure backend API if available
      return await createLeadRemote(data);
    } catch (err) {
      console.warn("Falling back to local lead storage:", err?.message || err);
      return await LocalDataService.createLead(data);
    }
  },
};

export const User = {
  // Mock user object for any auth-related functionality
  isAuthenticated: true,
  name: 'Local User',
  email: 'user@local.com'
};
