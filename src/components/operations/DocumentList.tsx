'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Plus, 
  Calendar, 
  User, 
  Search
} from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCaseDossier } from '@/lib/sample-data/operations-dashboard-data';

interface Document {
  name: string;
  type: string;
  uploadedDate: string;
  uploadedBy: string;
  size?: string;
  status?: 'Verified' | 'Pending' | 'Rejected';
}

interface DocumentListProps {
  caseId: string;
  allowUpload?: boolean;
  maxHeight?: string;
}

const documentTypeColors = {
  'Identity Document': 'bg-blue-100 text-blue-800',
  'Consent Form': 'bg-green-100 text-green-800',
  'Company Registration': 'bg-purple-100 text-purple-800',
  'Director Information': 'bg-orange-100 text-orange-800',
  'Credit Report': 'bg-red-100 text-red-800',
  'Medical Report': 'bg-pink-100 text-pink-800',
  'Tax Certificate': 'bg-yellow-100 text-yellow-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const statusColors = {
  'Verified': 'bg-green-500 text-white',
  'Pending': 'bg-yellow-500 text-black',
  'Rejected': 'bg-red-500 text-white'
};

export const DocumentList: React.FC<DocumentListProps> = ({ 
  caseId, 
  allowUpload = true, 
  maxHeight = '400px' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get case dossier data
  const caseDossier = getCaseDossier(caseId);
  
  // Default documents with enhanced data
  const defaultDocuments: Document[] = caseDossier?.documents?.map(doc => ({
    ...doc,
    size: `${Math.floor(Math.random() * 2000) + 100}KB`,
    status: Math.random() > 0.8 ? 'Pending' : 'Verified'
  })) || [];

  // Additional sample documents
  const additionalDocuments: Document[] = [
    {
      name: 'Background_Check_Report.pdf',
      type: 'Other',
      uploadedDate: '2025-01-18',
      uploadedBy: 'MIE Provider',
      size: '1.2MB',
      status: 'Verified'
    },
    {
      name: 'Reference_Letter.pdf',
      type: 'Other',
      uploadedDate: '2025-01-19',
      uploadedBy: 'HR Department',
      size: '156KB',
      status: 'Pending'
    },
    {
      name: 'Employment_Contract.pdf',
      type: 'Other',
      uploadedDate: '2025-01-20',
      uploadedBy: 'Legal Department',
      size: '890KB',
      status: 'Verified'
    }
  ];

  const allDocuments = [...defaultDocuments, ...additionalDocuments];

  // Filter documents
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDocument = (document: Document) => {
    // In a real app, this would open a document viewer
    alert(`Viewing document: ${document.name}`);
  };

  const handleDownloadDocument = (document: Document) => {
    // In a real app, this would download the document
    alert(`Downloading document: ${document.name}`);
  };

  const handleUploadDocument = () => {
    // In a real app, this would open a file upload dialog
    alert('Upload functionality would be implemented here');
  };

  const getDocumentIcon = () => {
    return <FileText className="w-5 h-5 text-neumorphic-primary" />;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text/50" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Identity Document">Identity Document</SelectItem>
            <SelectItem value="Consent Form">Consent Form</SelectItem>
            <SelectItem value="Company Registration">Company Registration</SelectItem>
            <SelectItem value="Director Information">Director Information</SelectItem>
            <SelectItem value="Credit Report">Credit Report</SelectItem>
            <SelectItem value="Medical Report">Medical Report</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {allowUpload && (
          <Button onClick={handleUploadDocument} size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        )}
      </div>

      {/* Documents List */}
      <NeumorphicCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-neumorphic-text">
            Documents ({filteredDocuments.length})
          </h4>
          <div className="flex items-center gap-2 text-sm text-neumorphic-text/70">
            <span>Total size: {
              filteredDocuments.reduce((total, doc) => {
                const size = parseFloat(doc.size?.replace(/[^\d.]/g, '') || '0');
                return total + size;
              }, 0).toFixed(1)
            }MB</span>
          </div>
        </div>

        <div className="space-y-2" style={{ maxHeight, overflowY: 'auto' }}>
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neumorphic-bg/50 rounded-lg hover:bg-neumorphic-bg/70 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  {getDocumentIcon()}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-neumorphic-text truncate">{document.name}</h5>
                      <Badge className={`text-xs ${documentTypeColors[document.type as keyof typeof documentTypeColors] || documentTypeColors.Other}`}>
                        {document.type}
                      </Badge>
                      {document.status && (
                        <Badge className={`text-xs ${statusColors[document.status]}`}>
                          {document.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neumorphic-text/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(document.uploadedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {document.uploadedBy}
                      </div>
                      {document.size && (
                        <span>{document.size}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(document)}
                    className="text-neumorphic-text/70 hover:text-neumorphic-text"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadDocument(document)}
                    className="text-neumorphic-text/70 hover:text-neumorphic-text"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neumorphic-text/70">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? (
                <div>
                  <p className="mb-2">No documents match your filters</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterStatus('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div>
                  <FileText className="w-12 h-12 text-neumorphic-text/30 mx-auto mb-4" />
                  <p className="mb-2">No documents uploaded yet</p>
                  {allowUpload && (
                    <Button onClick={handleUploadDocument} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload First Document
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </NeumorphicCard>
    </div>
  );
};