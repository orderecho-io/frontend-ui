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

// Export for backward compatibility
export const Lead = {
  create: LocalDataService.createLead
};

export const User = {
  // Mock user object for any auth-related functionality
  isAuthenticated: true,
  name: 'Local User',
  email: 'user@local.com'
};
