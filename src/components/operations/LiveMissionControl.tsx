'use client';

import { useState, useMemo } from 'react';
import { NeumorphicCard } from '@/components/ui/neumorphic-card';
import { NeumorphicInput } from '@/components/ui/neumorphic-input';
import { NeumorphicButton } from '@/components/ui/neumorphic-button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ContextMenu } from '@/components/operations/ContextMenu';
import { SupervisorApprovalDialog } from '@/components/operations/SupervisorApprovalDialog';
import { type OpsCase, formatZAR } from '@/lib/sample-data/operations-dashboard-data';
import { ExportManager } from '@/lib/utils/export';
import { 
  Search, 
  UserPlus, 
  AlertTriangle, 
  Download, 
  CheckCircle
} from 'lucide-react';

interface LiveMissionControlProps {
  cases: OpsCase[];
}

export function LiveMissionControl({ cases }: LiveMissionControlProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [supervisorDialog, setSupervisorDialog] = useState<{
    isOpen: boolean;
    action: string;
    title: string;
  }>({ isOpen: false, action: '', title: '' });

  const filteredCases = useMemo(() => {
    if (!searchTerm) return cases;
    
    return cases.filter(case_ => 
      case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.assignedOfficer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cases, searchTerm]);

  const handleRowSelect = (caseId: string, checked: boolean) => {
    setSelectedRows(prev => 
      checked 
        ? [...prev, caseId]
        : prev.filter(id => id !== caseId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredCases.map(c => c.id) : []);
  };

  const handleBulkAction = (action: string, title: string) => {
    setSupervisorDialog({ isOpen: true, action, title });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'In Progress': { className: 'bg-blue-500/20 text-blue-600 border-blue-500/30', icon: null },
      'Partially Complete & Flagged': { className: 'bg-orange-500/20 text-orange-600 border-orange-500/30', icon: AlertTriangle },
      'Consent Pending': { className: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30', icon: null },
      'Complete': { className: 'bg-green-500/20 text-green-600 border-green-500/30', icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['In Progress'];
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {Icon && <Icon className="h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'Low': { className: 'bg-gray-500/20 text-gray-600 border-gray-500/30' },
      'Medium': { className: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
      'High': { className: 'bg-orange-500/20 text-orange-600 border-orange-500/30' },
      'Urgent': { className: 'bg-red-500/20 text-red-600 border-red-500/30' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['Medium'];

    return (
      <Badge className={config.className}>
        {priority}
      </Badge>
    );
  };

  const getProgressBar = (progress: number) => (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-neumorphic-surface rounded-full h-2">
        <div 
          className="h-2 bg-neumorphic-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium">{progress}%</span>
    </div>
  );


  return (
    <NeumorphicCard className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neumorphic-text/60" />
            <NeumorphicInput
              placeholder="Search cases, entities, or officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <NeumorphicButton
              variant="outline"
              size="sm"
              disabled={selectedRows.length === 0}
              onClick={() => handleBulkAction('assign', 'Assign Officer')}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Assign Officer
            </NeumorphicButton>
            
            <NeumorphicButton
              variant="outline"
              size="sm"
              disabled={selectedRows.length === 0}
              onClick={() => handleBulkAction('priority', 'Update Priority')}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Update Priority
            </NeumorphicButton>

            <NeumorphicButton
              variant="outline"
              size="sm"
              disabled={selectedRows.length === 0}
              onClick={() => handleBulkAction('export', 'Export Selected')}
            >
              <Download className="h-4 w-4 mr-1" />
              Export Selected
            </NeumorphicButton>

            <NeumorphicButton
              variant="outline"
              size="sm"
              disabled={selectedRows.length === 0}
              onClick={() => handleBulkAction('approve', 'Bulk Approve')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Bulk Approve
            </NeumorphicButton>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2 border-l pl-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                <Download className="h-4 w-4 mr-1" />
                Export
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => ExportManager.exportCases(filteredCases, { format: 'csv' })}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => ExportManager.exportCases(filteredCases, { format: 'pdf' })}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => ExportManager.exportCases(filteredCases, { format: 'excel' })}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Simple Data Table */}
      <div className="px-4 pb-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neumorphic-border">
                <th className="text-left p-3">
                  <Checkbox
                    checked={selectedRows.length === filteredCases.length && filteredCases.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  />
                </th>
                <th className="text-left p-3 font-medium">Case Number</th>
                <th className="text-left p-3 font-medium">Entity</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Priority</th>
                <th className="text-left p-3 font-medium">Progress</th>
                <th className="text-left p-3 font-medium">Assigned Officer</th>
                <th className="text-left p-3 font-medium">Provider</th>
                <th className="text-left p-3 font-medium">Initiated</th>
                <th className="text-left p-3 font-medium">Est. Completion</th>
                <th className="text-left p-3 font-medium">Est. Cost</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((case_) => (
                <tr key={case_.id} className="border-b border-neumorphic-border/50 hover:bg-neumorphic-surface/30">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedRows.includes(case_.id)}
                      onCheckedChange={(checked) => handleRowSelect(case_.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-3">
                    <span
                      className="text-neumorphic-primary hover:text-neumorphic-primary/80 font-medium cursor-pointer"
                      onClick={() => window.open(`/cases/${case_.id}`, '_blank')}
                    >
                      {case_.caseNumber}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <span
                        className="text-neumorphic-primary hover:text-neumorphic-primary/80 font-medium cursor-pointer block"
                        onClick={() => window.open(`/entities/${case_.entity.id}`, '_blank')}
                      >
                        {case_.entity.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {case_.entity.type}
                        </Badge>
                        <span className="text-xs text-neumorphic-text/60">
                          {case_.entity.identifier}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(case_.status)}
                  </td>
                  <td className="p-3">
                    {getPriorityBadge(case_.priority)}
                  </td>
                  <td className="p-3">
                    {getProgressBar(case_.progress)}
                  </td>
                  <td className="p-3">
                    {case_.assignedOfficer.name}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">
                      {case_.primaryProvider}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      {new Date(case_.initiatedDate).toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={`text-sm flex items-center gap-1 ${
                      case_.isOverdue ? 'text-neumorphic-severity-critical animate-pulse' : ''
                    }`}>
                      {case_.isOverdue && <AlertTriangle className="h-3 w-3" />}
                      {new Date(case_.estCompletionDate).toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium">
                      {formatZAR(case_.estCost)}
                    </span>
                  </td>
                  <td className="p-3">
                    <ContextMenu case={case_} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supervisor Approval Dialog */}
      <SupervisorApprovalDialog
        isOpen={supervisorDialog.isOpen}
        onClose={() => setSupervisorDialog({ isOpen: false, action: '', title: '' })}
        action={supervisorDialog.action}
        title={supervisorDialog.title}
        selectedCount={selectedRows.length}
        onApprove={() => {
          console.log(`Supervisor approval requested for ${supervisorDialog.action}`);
          setSupervisorDialog({ isOpen: false, action: '', title: '' });
          setSelectedRows([]);
        }}
      />
    </NeumorphicCard>
  );
}