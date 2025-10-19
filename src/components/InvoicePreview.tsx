import { Button } from './ui/button';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';

// Define proper TypeScript interfaces
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  invoiceDate: string;
  dueDate?: string;
  lineItems: LineItem[];
  subtotal: number;
  total: number;
  status: string;
  paymentTerms?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Invoice Preview Component - Fixed all issues
interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => void;
  isNewlyCreated?: boolean;
}

export function InvoicePreview({ invoice, onClose, onStatusChange, isNewlyCreated }: InvoicePreviewProps) {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(invoice);
  const [statusChangeMessage, setStatusChangeMessage] = useState<string>('');

  // Update local state when invoice prop changes
  useEffect(() => {
    setCurrentInvoice(invoice);
  }, [invoice]);

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange && currentInvoice.id) {
      // Update local state immediately for better UX
      const updatedInvoice = { ...currentInvoice, status: newStatus };
      setCurrentInvoice(updatedInvoice);
      
      // Show status change message
      setStatusChangeMessage(`Status updated to ${newStatus}`);
      setTimeout(() => setStatusChangeMessage(''), 3000);
      
      // Call the parent handler to update the backend
      onStatusChange(currentInvoice.id, newStatus);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable HTML version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${currentInvoice.invoiceNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                color: #333;
              }
              .header { 
                display: flex;
                align-items: center;
                gap: 25px;
                border-bottom: 3px solid #f5a623; 
                padding-bottom: 20px; 
                margin-bottom: 20px;
              }
              .logo {
                width: 120px;
                height: 120px;
                object-fit: contain;
              }
              .company-info {
                flex: 1;
              }
              .company-name { 
                font-size: 28px; 
                font-weight: bold; 
                color: #1a2332;
                margin-bottom: 8px;
              }
              .tagline { 
                color: #666; 
                font-style: italic;
                margin-bottom: 10px;
                font-size: 16px;
              }
              .contact-info {
                color: #666;
                font-size: 14px;
                line-height: 1.5;
              }
              .invoice-title {
                font-size: 32px;
                color: #f5a623;
                margin-bottom: 15px;
              }
              .status-badge {
                display: inline-block;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                margin-left: 10px;
              }
              .status-draft { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
              .status-sent { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
              .status-paid { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
              .status-overdue { background: #fecaca; color: #dc2626; border: 1px solid #fca5a5; }
              .info-section { 
                margin: 15px 0; 
              }
              .info-label { 
                font-weight: bold; 
                color: #1a2332;
                font-size: 16px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                font-size: 14px;
              }
              th { 
                background: #1a2332; 
                color: white; 
                padding: 12px; 
                text-align: left;
                font-size: 14px;
              }
              td { 
                padding: 12px; 
                border-bottom: 1px solid #ddd;
                font-size: 14px;
              }
              .total-section { 
                text-align: right; 
                margin-top: 20px;
                font-size: 18px;
              }
              .total-amount {
                color: #f5a623;
                font-size: 24px;
                font-weight: bold;
              }
              .notes {
                margin-top: 30px;
                padding: 15px;
                background: #f5f5f5;
                border-left: 4px solid #f5a623;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="/images/logo.png" alt="Weeping Saints Logo" class="logo" onerror="this.style.display='none'" />
              <div class="company-info">
                <div class="company-name">WEEPING SAINTS</div>
                <div class="tagline">PR & Marketing House - Gracefully Building Unforgettable Brands</div>
                <div class="contact-info">
                  info@weepingsaints.com | +27 (79) 991-5716<br/>
                  www.weepingsaints.com
                </div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="invoice-title">INVOICE</div>
              <div class="status-badge status-${currentInvoice.status}">${currentInvoice.status.toUpperCase()}</div>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
              <div class="info-section">
                <div class="info-label">Invoice Number:</div>
                <div>${currentInvoice.invoiceNumber}</div>
              </div>
              <div class="info-section">
                <div class="info-label">Invoice Date:</div>
                <div>${new Date(currentInvoice.invoiceDate).toLocaleDateString()}</div>
                ${currentInvoice.dueDate ? `
                  <div class="info-label" style="margin-top: 10px;">Due Date:</div>
                  <div>${new Date(currentInvoice.dueDate).toLocaleDateString()}</div>
                ` : ''}
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-label">Bill To:</div>
              <div>${currentInvoice.clientName}</div>
              ${currentInvoice.clientEmail ? `<div>${currentInvoice.clientEmail}</div>` : ''}
              ${currentInvoice.clientAddress ? `<div style="white-space: pre-line;">${currentInvoice.clientAddress}</div>` : ''}
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Rate</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${currentInvoice.lineItems.map((item: LineItem) => `
                  <tr>
                    <td>${item.description}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">R${item.rate.toFixed(2)}</td>
                    <td style="text-align: right;">R${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <div>Subtotal: R${currentInvoice.subtotal.toFixed(2)}</div>
              <div class="total-amount">Total: R${currentInvoice.total.toFixed(2)}</div>
            </div>
            
            ${currentInvoice.paymentTerms ? `
              <div class="notes">
                <strong>Payment Terms:</strong><br/>
                ${currentInvoice.paymentTerms}
              </div>
            ` : ''}
            
            ${currentInvoice.notes ? `
              <div class="notes" style="margin-top: 20px;">
                <strong>Notes:</strong><br/>
                ${currentInvoice.notes}
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      draft: 'Draft',
      sent: 'Sent',
      paid: 'Paid',
      overdue: 'Overdue'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] my-8 rounded-lg shadow-2xl flex flex-col">
        {/* FIXED HEADER - Now properly visible and organized */}
        <div className="no-print flex justify-between items-center p-4 border-b bg-[#1a2332] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button 
              onClick={onClose}
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Invoices
            </Button>
            <h2 className="text-xl text-white font-semibold">Invoice Preview</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {onStatusChange && (
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-300 mb-1">Status:</label>
                  <Select
                    value={currentInvoice.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-32 bg-[#2d3b4e] border-[#2d3b4e] text-white h-8 text-sm">
                      <SelectValue placeholder={getStatusDisplay(currentInvoice.status)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {statusChangeMessage && (
                  <span className="text-green-400 text-sm">
                    {statusChangeMessage}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handlePrint} 
                variant="outline" 
                size="sm" 
                className="text-white border-white hover:bg-white/10 flex items-center gap-2 h-8"
              >
                <Printer className="size-4" />
                Print
              </Button>
              <Button 
                onClick={handleDownload} 
                size="sm" 
                className="bg-[#f5a623] hover:bg-[#d68f1f] text-white flex items-center gap-2 h-8"
              >
                <Download className="size-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 bg-white text-gray-900" id="invoice-content">
            {/* Header with Larger Logo and Contact Info */}
            <div className="flex items-start gap-6 border-b-2 border-[#f5a623] pb-6 mb-6">
              <img 
                src="/images/logo.png" 
                alt="Weeping Saints Logo" 
                className="w-24 h-24 object-contain flex-shrink-0"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="flex-1">
                <h1 className="text-3xl text-[#1a2332] mb-2 font-bold">WEEPING SAINTS</h1>
                <p className="text-gray-600 italic text-base mb-3">PR & Marketing House - Gracefully Building Unforgettable Brands</p>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <div><strong>Email:</strong> info@weepingsaints.com</div>
                  <div><strong>Phone:</strong> +27 (79) 991-5716</div>
                  <div><strong>Website:</strong> www.weepingsaints.com</div>
                </div>
              </div>
            </div>

            {/* Invoice Title with Status */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl text-[#f5a623] font-bold">INVOICE</h2>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  currentInvoice.status === 'draft' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                  currentInvoice.status === 'sent' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                  currentInvoice.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-300' :
                  'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {getStatusDisplay(currentInvoice.status).toUpperCase()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 font-medium">Invoice Number</div>
                    <div className="text-lg font-semibold">{currentInvoice.invoiceNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 font-medium">Invoice Date</div>
                    <div className="text-lg font-semibold">{new Date(currentInvoice.invoiceDate).toLocaleDateString()}</div>
                  </div>
                  {currentInvoice.dueDate && (
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Due Date</div>
                      <div className="text-lg font-semibold">{new Date(currentInvoice.dueDate).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 font-medium mb-2">Bill To:</div>
              <div className="text-lg font-semibold mb-1">{currentInvoice.clientName}</div>
              {currentInvoice.clientEmail && (
                <div className="text-gray-600 text-sm">
                  <strong>Email:</strong> {currentInvoice.clientEmail}
                </div>
              )}
              {currentInvoice.clientAddress && (
                <div className="text-gray-600 text-sm whitespace-pre-line mt-1">
                  <strong>Address:</strong><br/>{currentInvoice.clientAddress}
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1a2332] text-white">
                    <th className="text-left p-3 text-sm">Description</th>
                    <th className="text-center p-3 text-sm">Quantity</th>
                    <th className="text-right p-3 text-sm">Rate</th>
                    <th className="text-right p-3 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoice.lineItems.map((item: LineItem) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="p-3 text-base">{item.description}</td>
                      <td className="p-3 text-center text-base">{item.quantity}</td>
                      <td className="p-3 text-right text-base">R{item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right text-base">R{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between mb-2 pb-2">
                  <span className="text-gray-600 text-base">Subtotal:</span>
                  <span className="text-base">R{currentInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-[#f5a623] pt-2">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-2xl text-[#f5a623] font-bold">R{currentInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            {currentInvoice.paymentTerms && (
              <div className="mb-4 p-4 bg-gray-50 border-l-4 border-[#f5a623]">
                <div className="text-sm text-gray-600 font-medium mb-1">Payment Terms:</div>
                <div className="text-base">{currentInvoice.paymentTerms}</div>
              </div>
            )}

            {/* Notes */}
            {currentInvoice.notes && (
              <div className="p-4 bg-gray-50 border-l-4 border-[#f5a623]">
                <div className="text-sm text-gray-600 font-medium mb-1">Notes:</div>
                <div className="text-base whitespace-pre-line">{currentInvoice.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}