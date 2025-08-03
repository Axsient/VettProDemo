'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare 
} from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NeumorphicTextarea } from '@/components/ui/neumorphic/NeumorphicTextarea';
import { getCaseDetails } from '@/lib/sample-data/operations-dashboard-data';

interface CaseNote {
  id: string;
  timestamp: string;
  author: string;
  note: string;
  type: 'General' | 'Finding' | 'Action Required' | 'Client Communication';
  priority?: 'Low' | 'Medium' | 'High';
  isEdited?: boolean;
  editedAt?: string;
}

interface NotesSectionProps {
  caseId: string;
  allowEdit?: boolean;
  maxHeight?: string;
}

const noteTypeColors = {
  'General': 'bg-blue-100 text-blue-800',
  'Finding': 'bg-green-100 text-green-800',
  'Action Required': 'bg-orange-100 text-orange-800',
  'Client Communication': 'bg-purple-100 text-purple-800'
};

const noteTypeIcons = {
  'General': FileText,
  'Finding': CheckCircle,
  'Action Required': AlertTriangle,
  'Client Communication': Eye
};

const priorityColors = {
  'Low': 'bg-green-500 text-white',
  'Medium': 'bg-yellow-500 text-black',
  'High': 'bg-red-500 text-white'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Filter = null;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Info = null;

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  caseId, 
  allowEdit = true, 
  maxHeight = '500px' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({
    note: '',
    type: 'General' as CaseNote['type'],
    priority: 'Medium' as CaseNote['priority']
  });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [notes, setNotes] = useState<CaseNote[]>([]);

  // Get case details
  const caseDetails = getCaseDetails(caseId);
  
  // Initialize notes from case details
  React.useEffect(() => {
    if (caseDetails?.caseNotes) {
      const enhancedNotes = caseDetails.caseNotes.map(note => ({
        ...note,
        priority: (Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low') as CaseNote['priority']
      }));
      setNotes(enhancedNotes);
    }
  }, [caseDetails]);

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || note.type === filterType;
    const matchesPriority = filterPriority === 'all' || note.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  // Sort notes by timestamp (newest first)
  const sortedNotes = [...filteredNotes].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleAddNote = () => {
    if (!newNote.note.trim()) return;

    const note: CaseNote = {
      id: `note_${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: 'Current User', // In a real app, this would be the logged-in user
      note: newNote.note,
      type: newNote.type,
      priority: newNote.priority
    };

    setNotes([note, ...notes]);
    setNewNote({ note: '', type: 'General', priority: 'Medium' });
    setShowAddNote(false);
  };

  const handleEditNote = (noteId: string, updatedNote: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, note: updatedNote, isEdited: true, editedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text/50" />
          <Input
            placeholder="Search notes..."
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
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Finding">Finding</SelectItem>
            <SelectItem value="Action Required">Action Required</SelectItem>
            <SelectItem value="Client Communication">Client Communication</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        {allowEdit && (
          <Button onClick={() => setShowAddNote(!showAddNote)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {showAddNote && allowEdit && (
        <NeumorphicCard className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value as CaseNote['type']})}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Finding">Finding</SelectItem>
                  <SelectItem value="Action Required">Action Required</SelectItem>
                  <SelectItem value="Client Communication">Client Communication</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value as CaseNote['priority']})}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <NeumorphicTextarea
              placeholder="Enter your note..."
              value={newNote.note}
              onChange={(e) => setNewNote({...newNote, note: e.target.value})}
              rows={3}
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote} disabled={!newNote.note.trim()}>
                Add Note
              </Button>
            </div>
          </div>
        </NeumorphicCard>
      )}

      {/* Notes List */}
      <NeumorphicCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-neumorphic-text">
            Case Notes ({sortedNotes.length})
          </h4>
          <div className="flex items-center gap-2 text-sm text-neumorphic-text/70">
            <span>Latest: {sortedNotes[0] ? formatTimestamp(sortedNotes[0].timestamp) : 'None'}</span>
          </div>
        </div>

        <div className="space-y-3" style={{ maxHeight, overflowY: 'auto' }}>
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => {
              const Icon = noteTypeIcons[note.type];
              const isEditing = editingNote === note.id;
              
              return (
                <div key={note.id} className="p-4 bg-neumorphic-bg/50 rounded-lg border border-neumorphic-border/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-neumorphic-primary" />
                      <Badge className={`text-xs ${noteTypeColors[note.type]}`}>
                        {note.type}
                      </Badge>
                      {note.priority && (
                        <Badge className={`text-xs ${priorityColors[note.priority]}`}>
                          {note.priority}
                        </Badge>
                      )}
                    </div>
                    
                    {allowEdit && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingNote(note.id)}
                          className="text-neumorphic-text/70 hover:text-neumorphic-text"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-neumorphic-text/70 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <NeumorphicTextarea
                        value={note.note}
                        onChange={(e) => {
                          const updatedNotes = notes.map(n => 
                            n.id === note.id ? { ...n, note: e.target.value } : n
                          );
                          setNotes(updatedNotes);
                        }}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleEditNote(note.id, note.note)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-neumorphic-text">{note.note}</p>
                      <div className="flex items-center gap-4 text-xs text-neumorphic-text/70">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {note.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimestamp(note.timestamp)}
                        </div>
                        {note.isEdited && (
                          <span className="text-neumorphic-text/50">
                            (edited {note.editedAt ? formatTimestamp(note.editedAt) : ''})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-neumorphic-text/70">
              {searchTerm || filterType !== 'all' || filterPriority !== 'all' ? (
                <div>
                  <p className="mb-2">No notes match your filters</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterPriority('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div>
                  <MessageSquare className="w-12 h-12 text-neumorphic-text/30 mx-auto mb-4" />
                  <p className="mb-2">No notes added yet</p>
                  {allowEdit && (
                    <Button onClick={() => setShowAddNote(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Note
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