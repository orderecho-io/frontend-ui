// Mock integrations service to replace Base44 functionality
export const Core = {
  InvokeLLM: async (prompt) => {
    console.log('Mock LLM call:', prompt);
    return { response: 'This is a mock LLM response' };
  },
  
  SendEmail: async (emailData) => {
    console.log('Mock email send:', emailData);
    return { success: true, messageId: 'mock-' + Date.now() };
  },
  
  UploadFile: async (file) => {
    console.log('Mock file upload:', file);
    return { url: 'mock-url-' + Date.now() };
  },
  
  GenerateImage: async (prompt) => {
    console.log('Mock image generation:', prompt);
    return { url: 'mock-image-url-' + Date.now() };
  },
  
  ExtractDataFromUploadedFile: async (file) => {
    console.log('Mock data extraction:', file);
    return { extractedData: 'Mock extracted data' };
  },
  
  CreateFileSignedUrl: async (fileName) => {
    console.log('Mock signed URL creation:', fileName);
    return { signedUrl: 'mock-signed-url-' + Date.now() };
  },
  
  UploadPrivateFile: async (file) => {
    console.log('Mock private file upload:', file);
    return { url: 'mock-private-url-' + Date.now() };
  }
};

// Export individual functions for backward compatibility
export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;