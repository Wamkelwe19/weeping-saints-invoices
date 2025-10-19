import { Eye, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface InvoiceListProps {
  invoices: any[];
  onView: (invoice: any) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export function InvoiceList({ invoices, onView, onDelete, onStatusChange }: InvoiceListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'sent':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: // draft
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <DollarSign className="size-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg">No invoices yet</p>
        <p className="text-sm">Create your first invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="bg-[#1a2332] border border-[#2d3b4e] rounded-lg p-4 hover:border-[#f5a623] transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg text-white">{invoice.invoiceNumber}</h3>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(invoice.status)}
                >
                  {invoice.status}
                </Badge>
              </div>
              
              <div className="text-gray-300 mb-3">{invoice.clientName}</div>
              
              <div className="flex gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                </div>
                {invoice.dueDate && (
                  <div className="flex items-center gap-1">
                    <span>Due:</span>
                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-2xl text-[#f5a623]">R{invoice.total.toFixed(2)}</div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => onView(invoice)}
                  size="sm"
                  className="bg-[#f5a623] hover:bg-[#d68f1f] text-white"
                >
                  <Eye className="size-4 mr-1" />
                  View
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this invoice?')) {
                      onDelete(invoice.id);
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}