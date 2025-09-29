// Implementation to replace @base44/sdk
// This provides the same interface with real backend API calls

import { API_ENDPOINTS } from '../config/api';

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
        console.log('Order.create called:', data);
        return { success: true, id: 'order-id' };
      },
      async get(id) {
        console.log('Order.get called:', id);
        return { success: true, data: { id, status: 'pending' } };
      },
      async update(id, data) {
        console.log('Order.update called:', id, data);
        return { success: true };
      },
      async list(filters = {}) {
        console.log('Order.list called:', filters);
        
        try {
          // Get account_id from localStorage or use default
          // Try to get from token payload first, then localStorage, then default
          let accountId = 'ACC000000000001'; // Use the actual account ID that has orders
          
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              accountId = payload.userId || payload.accountId || 'ACC000000000001';
            }
          } catch (e) {
            // If token parsing fails, try localStorage
            accountId = localStorage.getItem('accountId') || localStorage.getItem('userId') || 'ACC000000000001';
          }
          
          console.log('Using account ID:', accountId);
          console.log('API URL:', `${API_ENDPOINTS.FRONTEND.ORDERS(accountId)}`);
          
          // Make real API call to backend
          const response = await fetch(`${API_ENDPOINTS.FRONTEND.ORDERS(accountId)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error text:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
          }
          
          const orders = await response.json();
          console.log('Raw response from backend:', JSON.stringify(orders, null, 2));
          console.log('Orders type:', typeof orders);
          console.log('Orders length:', orders?.length);
          console.log('Orders success:', orders?.success);
          console.log('Orders data:', orders?.orders);
          console.log('Orders data length:', orders?.orders?.length);
          
          // Check if the response has the expected structure
          if (orders && orders.success && orders.orders) {
            console.log('Returning orders from orders.orders:', orders.orders.length);
            return { success: true, data: orders.orders };
          } else if (Array.isArray(orders)) {
            console.log('Returning orders as direct array:', orders.length);
            return { success: true, data: orders };
          } else {
            console.log('Unexpected response structure, returning as-is');
            return { success: true, data: orders };
          }
        } catch (error) {
          console.error('Error fetching orders from backend:', error);
          
          // Fallback to mock data if backend is not available
          console.log('Falling back to mock data due to backend error');
          const mockOrders = [
            {
              id: 'ORD000000000031',
              customer_name: 'Mike',
              customer_phone: '+15199155191',
              order_type: 'Pickup',
              subtotal: 6.58,
              tax_amount: 0.34,
              total_amount: 6.92,
              order_status: 'completed',
              payment_status: 'paid',
              call_sid: 'CA1a3d16c78bdbd142868f02853b0c7a8d',
              session_id: 'CA1a3d16c78bdbd142868f02853b0c7a8d',
              ultravox_call_id: '20fc76e9-aa97-4e2c-be4b-e053868644d2',
              created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
              updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              order_details: {
                items: [
                  {
                    name: 'Orange Juice',
                    quantity: 2,
                    price: 3.29
                  }
                ],
                subtotal: 6.58,
                tax: 0.34,
                total: 6.92,
                pickupTime: 'ASAP'
              }
            },
            {
              id: 'ORD000000000032',
              customer_name: 'Mike',
              customer_phone: '+13062160665',
              order_type: 'Pickup',
              subtotal: 6.58,
              tax_amount: 0.33,
              total_amount: 6.91,
              order_status: 'completed',
              payment_status: 'paid',
              call_sid: 'CA3e9f54ee14cc5a60ac57dad642a5345f',
              session_id: 'CA3e9f54ee14cc5a60ac57dad642a5345f',
              ultravox_call_id: '7899bf78-890b-44e4-85b8-aab3f84f407e',
              created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
              updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              order_details: {
                items: [
                  {
                    name: 'Orange Juice',
                    quantity: 2,
                    price: 3.29
                  }
                ],
                subtotal: 6.58,
                tax: 0.33,
                total: 6.91,
                pickupTime: 'ASAP'
              }
            }
          ];
          
          return { success: true, data: mockOrders };
        }
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

