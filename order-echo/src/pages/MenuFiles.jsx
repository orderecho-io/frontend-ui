import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Attachment } from '@/api/entities';
import { UploadPrivateFile, CreateFileSignedUrl } from '@/api/integrations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Eye, Trash2, Loader2 } from 'lucide-react';

export default function MenuFilesPage() {
  const location = useLocation();
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    console.log('MenuFiles page mounted, loading data...', location.pathname);
    loadAttachments();
  }, [location.pathname]);

  const loadAttachments = async () => {
    console.log('MenuFiles page - loadAttachments called');
    setIsLoading(true);
    try {
      const attachmentsResponse = await Attachment.list('-created_date');
      console.log('MenuFiles page - API response:', attachmentsResponse);
      setAttachments(attachmentsResponse.data || []);
      console.log('MenuFiles page - data set successfully');
    } catch (error) {
      console.error('Error loading attachments:', error);
    } finally {
      setIsLoading(false);
      console.log('MenuFiles page - loading completed');
    }
  };

  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_uri } = await UploadPrivateFile({ file });
      
      await Attachment.create({
        file_uri,
        file_name: file.name,
        file_type: fileType
      });
      
      loadAttachments();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      event.target.value = null; // Reset file input
    }
  };

  const handleDelete = async (attachmentId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await Attachment.delete(attachmentId);
        loadAttachments();
      } catch (error) {
        console.error('Error deleting attachment:', error);
      }
    }
  };

  const handlePreview = async (file_uri) => {
    try {
      const { signed_url } = await CreateFileSignedUrl({ file_uri });
      window.open(signed_url, '_blank');
    } catch (error) {
      console.error('Error creating signed URL:', error);
      alert('Could not generate a preview link.');
    }
  };

  const filteredAttachments = typeFilter === 'all' 
    ? attachments 
    : attachments.filter(att => att.file_type === typeFilter);

  const getFileTypeBadge = (type) => {
    const variants = {
      menu: 'bg-blue-100 text-blue-800',
      deal: 'bg-green-100 text-green-800',
      faq: 'bg-purple-100 text-purple-800'
    };
    return variants[type] || 'bg-gray-100 text-gray-800';
  };

  const getFileTypeLabel = (type) => {
    const labels = {
      menu: 'Menu',
      deal: 'Deal',
      faq: 'FAQ'
    };
    return labels[type] || type;
  };
  
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu & Info Files</h1>
          <p className="text-gray-600">Upload your menus, deals, and FAQs for the AI to use.</p>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="menu">Menus</SelectItem>
            <SelectItem value="deal">Deals</SelectItem>
            <SelectItem value="faq">FAQs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {['menu', 'deal', 'faq'].map(type => (
          <Card key={type} className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                Upload {getFileTypeLabel(type)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, type)} className="hidden" id={`upload-${type}`} disabled={isUploading} />
              <Button asChild variant="outline" className="w-full cursor-pointer" disabled={isUploading}>
                <label htmlFor={`upload-${type}`}>
                  {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </label>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Uploaded Files</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Loader2 className="animate-spin" /> : 
            filteredAttachments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No files uploaded yet</h3>
                <p className="text-gray-500">Upload files using the buttons above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAttachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-gray-500" />
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{attachment.file_name}</span>
                          <Badge className={getFileTypeBadge(attachment.file_type)}>{getFileTypeLabel(attachment.file_type)}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Uploaded {new Date(attachment.created_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePreview(attachment.file_uri)}>
                        <Eye className="w-4 h-4 mr-2" /> Preview
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(attachment.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

