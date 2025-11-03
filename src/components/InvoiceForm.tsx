import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceFormProps {
  onSubmit: (invoice: any) => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Payment due within 30 days');
   const [bankName, setBankName] = useState('Abas Bank');
  const [accountNumber, setAccountNumber] = useState('9320233720');
  const [accountOwner, setAccountOwner] = useState('Siyanda Mthembu');
  const [branchCode, setBranchCode] = useState('632005');
  const addLineItem = () => {
    setLineItems([...lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoice = {
      clientName,
      clientEmail,
      clientAddress,
      invoiceDate,
      dueDate,
      lineItems,
      notes,
      paymentTerms,
      subtotal: calculateSubtotal(),
      total: calculateSubtotal(),
      status: 'draft',
      // include bank details
      bankName,
      accountNumber,
      accountOwner,
      branchCode,
    };
    
    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="bg-[#1a2332] border-[#2d3b4e] text-white"
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Client Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="bg-[#1a2332] border-[#2d3b4e] text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="clientAddress">Client Address</Label>
        <Textarea
          id="clientAddress"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          className="bg-[#1a2332] border-[#2d3b4e] text-white"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceDate">Invoice Date *</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            required
            className="bg-[#1a2332] border-[#2d3b4e] text-white"
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-[#1a2332] border-[#2d3b4e] text-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Line Items *</Label>
          <Button type="button" onClick={addLineItem} size="sm" className="bg-[#f5a623] hover:bg-[#d68f1f] text-white">
            <Plus className="size-4 mr-1" />
            Add Item
          </Button>
        </div>

        {lineItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-6">
              {index === 0 && <Label className="text-xs mb-1 block">Description</Label>}
              <Input
                value={item.description}
                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                placeholder="Service or product description"
                required
                className="bg-[#1a2332] border-[#2d3b4e] text-white"
              />
            </div>
            <div className="col-span-2">
              {index === 0 && <Label className="text-xs mb-1 block">Quantity</Label>}
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
                className="bg-[#1a2332] border-[#2d3b4e] text-white"
              />
            </div>
            <div className="col-span-2">
              {index === 0 && <Label className="text-xs mb-1 block">Rate (R)</Label>}
              <Input
                type="number"
                value={item.rate}
                onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
                className="bg-[#1a2332] border-[#2d3b4e] text-white"
              />
            </div>
            <div className="col-span-1">
              {index === 0 && <Label className="text-xs mb-1 block">Amount</Label>}
              <div className="h-10 flex items-center text-[#f5a623]">
                R{(item.quantity * item.rate).toFixed(2)}
              </div>
            </div>
            <div className="col-span-1">
              {index === 0 && <Label className="text-xs mb-1 block opacity-0">Del</Label>}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLineItem(item.id)}
                disabled={lineItems.length === 1}
                className="h-10 w-10 p-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4 border-t border-[#2d3b4e]">
          <div className="text-right">
            <div className="text-gray-400">Subtotal</div>
            <div className="text-2xl text-[#f5a623]">R{calculateSubtotal().toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Input
          id="paymentTerms"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          className="bg-[#1a2332] border-[#2d3b4e] text-white"
        />
      </div>
     {/* New Bank Details Section */}
      <div className="p-4 bg-[#0f1724] border border-[#2d3b4e] rounded-md space-y-3">
        <div className="text-sm text-gray-300 font-medium">Bank Details (Shown on invoice)</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="bg-[#1a2332] border-[#2d3b4e] text-white"
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-[#1a2332] border-[#2d3b4e] text-white"
            />
          </div>
          <div>
            <Label htmlFor="accountOwner">Account Owner</Label>
            <Input
              id="accountOwner"
              value={accountOwner}
              onChange={(e) => setAccountOwner(e.target.value)}
              className="bg-[#1a2332] border-[#2d3b4e] text-white"
            />
          </div>
          <div>
            <Label htmlFor="branchCode">Branch Code</Label>
            <Input
              id="branchCode"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className="bg-[#1a2332] border-[#2d3b4e] text-white"
            />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes or information..."
          className="bg-[#1a2332] border-[#2d3b4e] text-white"
          rows={3}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="border-[#2d3b4e] text-gray-300">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#f5a623] hover:bg-[#d68f1f] text-white">
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
