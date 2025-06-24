'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, MoreHorizontal, CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '@/components/ui/neumorphic';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NeumorphicSelect } from '@/components/forms/selection/NeumorphicSelect';
import { NeumorphicCheckbox } from '@/components/forms/selection/NeumorphicCheckbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { getAdminTasks, getTasksSummary, sampleBulkActions } from '@/lib/sample-data/adminTasksSample';
import { AdminTaskItem, TaskPriority, TaskStatus, TaskType, TaskSummaryStats, TaskFilters } from '@/types/tasks';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardTasksApprovals() {
  const [tasks, setTasks] = useState<AdminTaskItem[]>([]);
  const [summary, setSummary] = useState<TaskSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AdminTaskItem;
    direction: 'asc' | 'desc';
  }>({ key: 'assignedDate', direction: 'desc' });
  const [selectedTask, setSelectedTask] = useState<AdminTaskItem | null>(null);
  const [requestInfoModalOpen, setRequestInfoModalOpen] = useState(false);
  const [requestInfoTask, setRequestInfoTask] = useState<AdminTaskItem | null>(null);
  const [requestInfoText, setRequestInfoText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, summaryData] = await Promise.all([
          getAdminTasks(),
          getTasksSummary()
        ]);
        setTasks(tasksData);
        setSummary(summaryData);
      } catch {
        toast.error('Failed to load tasks and approvals data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.subjectName.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.type.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(task => filters.type!.includes(task.type));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tasks, filters, sortConfig]);

  // Pagination
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTasks.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTasks, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);

  // Priority badge configuration
  const getPriorityBadge = (priority: TaskPriority) => {
    const config = {
      [TaskPriority.HIGH]: { variant: 'destructive' as const, icon: AlertTriangle },
      [TaskPriority.MEDIUM]: { variant: 'default' as const, icon: Clock },
      [TaskPriority.LOW]: { variant: 'secondary' as const, icon: CheckCircle },
    };
    return config[priority];
  };

  // Status badge configuration
  const getStatusBadge = (status: TaskStatus) => {
    const config = {
      [TaskStatus.PENDING_ADMIN_REVIEW]: { variant: 'outline' as const },
      [TaskStatus.ACTION_REQUIRED]: { variant: 'destructive' as const },
      [TaskStatus.INFORMATION_REQUESTED]: { variant: 'default' as const },
      [TaskStatus.APPROVED]: { variant: 'secondary' as const },
      [TaskStatus.REJECTED]: { variant: 'outline' as const },
      [TaskStatus.UNDER_REVIEW]: { variant: 'default' as const },
      [TaskStatus.COMPLETED]: { variant: 'secondary' as const },
    };
    return config[status] || { variant: 'outline' as const };
  };

  // Handle task actions
  const handleTaskAction = async (taskId: string, action: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update task status optimistically
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          let newStatus = task.status;
          switch (action) {
            case 'approve':
              newStatus = TaskStatus.APPROVED;
              break;
            case 'reject':
              newStatus = TaskStatus.REJECTED;
              break;
            case 'mark-reviewed':
              newStatus = TaskStatus.UNDER_REVIEW;
              break;
          }
          return { ...task, status: newStatus };
        }
        return task;
      }));

      toast.success(`Task has been ${action}d and updated.`);
    } catch {
      toast.error(`Failed to ${action} task. Please try again.`);
    }
  };

  // Handle request more info
  const handleRequestMoreInfo = (task: AdminTaskItem) => {
    setRequestInfoTask(task);
    setRequestInfoText('');
    setRequestInfoModalOpen(true);
  };

  const submitRequestMoreInfo = async () => {
    if (!requestInfoTask || !requestInfoText.trim()) {
      toast.error('Please enter the information you need to request.');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update task status optimistically
      setTasks(prev => prev.map(task => {
        if (task.id === requestInfoTask.id) {
          return { 
            ...task, 
            status: TaskStatus.INFORMATION_REQUESTED,
            notes: `${task.notes || ''}\n\nAdmin requested: ${requestInfoText}`.trim()
          };
        }
        return task;
      }));

      toast.success(`Information request sent for task regarding ${requestInfoTask.subjectName}.`);
      
      setRequestInfoModalOpen(false);
      setRequestInfoTask(null);
      setRequestInfoText('');
    } catch {
      toast.error('Failed to send information request. Please try again.');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedTasks.length === 0) {
      toast.error('Please select tasks to perform bulk actions.');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success(`${selectedTasks.length} tasks have been ${action}d.`);
      
      setSelectedTasks([]);
    } catch {
      toast.error(`Failed to ${action} selected tasks.`);
    }
  };

  // Handle sort
  const handleSort = (key: keyof AdminTaskItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Check if task is overdue
  const isOverdue = (task: AdminTaskItem) => {
    if (!task.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now && !['approved', 'rejected', 'completed'].includes(task.status.toLowerCase());
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks & Approvals</h1>
        <p className="text-muted-foreground">
          Centralized hub for all tasks, approval requests, and escalated items requiring your attention.
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Action Required</p>
                <p className="text-2xl font-bold text-red-600">{summary.actionRequired}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{summary.highPriority}</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-purple-600">{summary.overdue}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <XCircle className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}

      {/* Main Content */}
      <NeumorphicCard className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <NeumorphicInput
                placeholder="Search tasks, subjects, or descriptions..."
                className="pl-10"
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <NeumorphicSelect
              options={[
                { value: '', label: 'All Types' },
                ...Object.values(TaskType).map(type => ({ value: type, label: type }))
              ]}
              value={filters.type?.[0] || ''}
              onChange={(value) => 
                setFilters(prev => ({ ...prev, type: value ? [value as TaskType] : undefined }))
              }
              placeholder="Task Type"
              className="w-40"
            />
            
            <NeumorphicSelect
              options={[
                { value: '', label: 'All Priorities' },
                ...Object.values(TaskPriority).map(priority => ({ value: priority, label: priority }))
              ]}
              value={filters.priority?.[0] || ''}
              onChange={(value) => 
                setFilters(prev => ({ ...prev, priority: value ? [value as TaskPriority] : undefined }))
              }
              placeholder="Priority"
              className="w-32"
            />
            
            <NeumorphicSelect
              options={[
                { value: '', label: 'All Statuses' },
                ...Object.values(TaskStatus).map(status => ({ value: status, label: status }))
              ]}
              value={filters.status?.[0] || ''}
              onChange={(value) => 
                setFilters(prev => ({ ...prev, status: value ? [value as TaskStatus] : undefined }))
              }
              placeholder="Status"
              className="w-40"
            />
            
            <NeumorphicButton onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
            </NeumorphicButton>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2 ml-auto">
              {sampleBulkActions.map(action => (
                <Button
                  key={action.type}
                  variant={action.variant === 'success' ? 'default' : action.variant}
                  size="sm"
                  onClick={() => handleBulkAction(action.type)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <NeumorphicCheckbox
                    checked={selectedTasks.length === paginatedTasks.length && paginatedTasks.length > 0}
                    onChange={(checked) => {
                      if (checked) {
                        setSelectedTasks(paginatedTasks.map(task => task.id));
                      } else {
                        setSelectedTasks([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort('priority')}>
                  Priority
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort('type')}>
                  Type
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort('subjectName')}>
                  Subject
                </th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort('assignedDate')}>
                  Assigned
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort('dueDate')}>
                  Due Date
                </th>
                <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                  Status
                </th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task) => {
                const priorityConfig = getPriorityBadge(task.priority);
                const statusConfig = getStatusBadge(task.status);
                const overdue = isOverdue(task);
                
                return (
                  <tr key={task.id} className={cn(
                    "border-b hover:bg-muted/50 transition-colors",
                    overdue && "bg-red-50 dark:bg-red-900/10"
                  )}>
                    <td className="p-2">
                      <NeumorphicCheckbox
                        checked={selectedTasks.includes(task.id)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedTasks(prev => [...prev, task.id]);
                          } else {
                            setSelectedTasks(prev => prev.filter(id => id !== task.id));
                          }
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Badge variant={priorityConfig.variant} className="flex items-center gap-1 w-fit">
                        <priorityConfig.icon className="h-3 w-3" />
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm font-medium">{task.type}</span>
                    </td>
                    <td className="p-2">
                      {task.relatedLink ? (
                        <Link href={task.relatedLink} className="text-blue-600 hover:underline font-medium">
                          {task.subjectName}
                        </Link>
                      ) : (
                        <span className="font-medium">{task.subjectName}</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="max-w-xs">
                        <p className="text-sm truncate" title={task.description}>
                          {task.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(task.assignedDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-2">
                      {task.dueDate ? (
                        <span className={cn(
                          "text-sm",
                          overdue ? "text-red-600 font-medium" : "text-muted-foreground"
                        )}>
                          {new Date(task.dueDate).toLocaleDateString()}
                          {overdue && <span className="ml-1">(Overdue)</span>}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">No deadline</span>
                      )}
                    </td>
                    <td className="p-2">
                      <Badge variant={statusConfig.variant}>
                        {task.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Task Details</DialogTitle>
                            </DialogHeader>
                            {selectedTask && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Subject</label>
                                    <p className="text-sm text-muted-foreground">{selectedTask.subjectName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <p className="text-sm text-muted-foreground">{selectedTask.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <p className="text-sm text-muted-foreground">{selectedTask.priority}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p className="text-sm text-muted-foreground">{selectedTask.status}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
                                </div>
                                {selectedTask.notes && (
                                  <div>
                                    <label className="text-sm font-medium">Notes</label>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.notes}</p>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                  <Button onClick={() => handleTaskAction(selectedTask.id, 'approve')}>
                                    Approve
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleTaskAction(selectedTask.id, 'reject')}>
                                    Reject
                                  </Button>
                                  <Button variant="outline" onClick={() => handleTaskAction(selectedTask.id, 'mark-reviewed')}>
                                    Mark as Reviewed
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48" align="end">
                            <div className="space-y-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => handleTaskAction(task.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => handleTaskAction(task.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => handleTaskAction(task.id, 'mark-reviewed')}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Mark as Reviewed
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => handleRequestMoreInfo(task)}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Request More Info
                              </Button>
                              {task.relatedLink && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-full justify-start"
                                  asChild
                                >
                                  <Link href={task.relatedLink}>
                                    <span className="h-4 w-4 mr-2" />
                                    Go to Item
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedTasks.length)} of {filteredAndSortedTasks.length} tasks
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              {filters.search || filters.type || filters.priority || filters.status
                ? 'Try adjusting your filters to see more tasks.'
                : 'All caught up! No tasks require your attention at the moment.'}
            </p>
          </div>
        )}
      </NeumorphicCard>

      {/* Request More Info Modal */}
      <Dialog open={requestInfoModalOpen} onOpenChange={setRequestInfoModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
          </DialogHeader>
          {requestInfoTask && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Task</label>
                <p className="text-sm font-medium">{requestInfoTask.subjectName}</p>
                <p className="text-xs text-muted-foreground">{requestInfoTask.type}</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="requestInfo" className="text-sm font-medium">
                  What information do you need?
                </label>
                <NeumorphicInput
                  id="requestInfo"
                  placeholder="Please provide additional details about..."
                  value={requestInfoText}
                  onChange={(e) => setRequestInfoText(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setRequestInfoModalOpen(false)}
                >
                  Cancel
                </Button>
                <NeumorphicButton 
                  onClick={submitRequestMoreInfo}
                  disabled={!requestInfoText.trim()}
                >
                  Send Request
                </NeumorphicButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 