// Mock implementation to replace @base44/sdk
// This provides the same interface without external dependencies

// Mock client implementation
const createMockClient = () => ({
  integrations: {
    Core: {
      InvokeLLM: {
        async invoke(prompt, options = {}) {
          console.log('Mock InvokeLLM called with:', prompt);
          return {
            response: "This is a mock LLM response",
            success: true
          };
        }
      },
      SendEmail: {
        async send(to, subject, body, options = {}) {
          console.log('Mock SendEmail called:', { to, subject, body });
          return {
            success: true,
            messageId: 'mock-message-id'
          };
        }
      },
      UploadFile: {
        async upload(file, options = {}) {
          console.log('Mock UploadFile called:', file.name);
          return {
            success: true,
            fileId: 'mock-file-id',
            url: 'https://mock-url.com/file'
          };
        }
      },
      GenerateImage: {
        async generate(prompt, options = {}) {
          console.log('Mock GenerateImage called:', prompt);
          return {
            success: true,
            imageUrl: 'https://mock-image-url.com/image.jpg'
          };
        }
      },
      ExtractDataFromUploadedFile: {
        async extract(fileId, options = {}) {
          console.log('Mock ExtractDataFromUploadedFile called:', fileId);
          return {
            success: true,
            data: { extracted: 'mock data' }
          };
        }
      },
      CreateFileSignedUrl: {
        async create(fileId, options = {}) {
          console.log('Mock CreateFileSignedUrl called:', fileId);
          return {
            success: true,
            signedUrl: 'https://mock-signed-url.com/file'
          };
        }
      },
      UploadPrivateFile: {
        async upload(file, options = {}) {
          console.log('Mock UploadPrivateFile called:', file.name);
          return {
            success: true,
            fileId: 'mock-private-file-id'
          };
        }
      }
    }
  },
  entities: {
    Lead: {
      async create(data) {
        console.log('Mock Lead.create called:', data);
        return { success: true, id: 'mock-lead-id' };
      },
      async get(id) {
        console.log('Mock Lead.get called:', id);
        return { success: true, data: { id, name: 'Mock Lead' } };
      },
      async update(id, data) {
        console.log('Mock Lead.update called:', id, data);
        return { success: true };
      },
      async delete(id) {
        console.log('Mock Lead.delete called:', id);
        return { success: true };
      }
    },
    Call: {
      async create(data) {
        console.log('Mock Call.create called:', data);
        return { success: true, id: 'mock-call-id' };
      },
      async get(id) {
        console.log('Mock Call.get called:', id);
        return { success: true, data: { id, status: 'completed' } };
      },
      async list(filters = {}) {
        console.log('Mock Call.list called:', filters);
        // Return some mock call data
        const mockCalls = [
          {
            id: 'call-1',
            from_number: '+1234567890',
            status: 'answered',
            created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            duration_seconds: 180,
            transcript: 'Customer called to place an order for 2 pizzas'
          },
          {
            id: 'call-2',
            from_number: '+1987654321',
            status: 'missed',
            created_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            duration_seconds: 0
          },
          {
            id: 'call-3',
            from_number: '+1555123456',
            status: 'voicemail',
            created_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            duration_seconds: 45,
            transcript: 'Left voicemail asking about delivery times'
          }
        ];
        return { success: true, data: mockCalls };
      }
    },
    Order: {
      async create(data) {
        console.log('Mock Order.create called:', data);
        return { success: true, id: 'mock-order-id' };
      },
      async get(id) {
        console.log('Mock Order.get called:', id);
        return { success: true, data: { id, status: 'pending' } };
      },
      async update(id, data) {
        console.log('Mock Order.update called:', id, data);
        return { success: true };
      },
      async list(filters = {}) {
        console.log('Mock Order.list called:', filters);
        // Return some mock order data
        const mockOrders = [
          {
            id: 'order-1',
            customer_name: 'John Doe',
            total_amount: 24.99,
            status: 'completed',
            created_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
            items: ['2x Margherita Pizza', '1x Caesar Salad']
          },
          {
            id: 'order-2',
            customer_name: 'Jane Smith',
            total_amount: 18.50,
            status: 'pending',
            created_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            items: ['1x Pepperoni Pizza', '2x Garlic Bread']
          },
          {
            id: 'order-3',
            customer_name: 'Mike Johnson',
            total_amount: 32.75,
            status: 'completed',
            created_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            items: ['1x Supreme Pizza', '1x Buffalo Wings', '1x Soft Drink']
          }
        ];
        return { success: true, data: mockOrders };
      }
    },
    Attachment: {
      async create(data) {
        console.log('Mock Attachment.create called:', data);
        return { success: true, id: 'mock-attachment-id' };
      },
      async get(id) {
        console.log('Mock Attachment.get called:', id);
        return { success: true, data: { id, filename: 'mock-file.pdf' } };
      },
      async list(filters = {}) {
        console.log('Mock Attachment.list called:', filters);
        // Return some mock attachment data
        const mockAttachments = [
          {
            id: 'attachment-1',
            file_name: 'restaurant_menu.pdf',
            file_type: 'menu',
            file_uri: 'mock://files/menu.pdf',
            created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            file_size: 1024000
          },
          {
            id: 'attachment-2',
            file_name: 'weekly_deals.docx',
            file_type: 'deal',
            file_uri: 'mock://files/deals.docx',
            created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            file_size: 512000
          },
          {
            id: 'attachment-3',
            file_name: 'faq_document.txt',
            file_type: 'faq',
            file_uri: 'mock://files/faq.txt',
            created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            file_size: 256000
          }
        ];
        return { success: true, data: mockAttachments };
      }
    }
  },
  auth: {
    async login(credentials) {
      console.log('Mock auth.login called:', credentials);
      return { success: true, token: 'mock-token' };
    },
    async register(data) {
      console.log('Mock auth.register called:', data);
      return { success: true, user: { id: 'mock-user-id' } };
    },
    async getCurrentUser() {
      console.log('Mock auth.getCurrentUser called');
      return { success: true, user: { id: 'mock-user-id', email: 'mock@example.com' } };
    }
  }
});

// Create a mock client instance
export const base44 = createMockClient();

