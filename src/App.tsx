import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from './components/ui/button';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { InvoicePreview } from './components/InvoicePreview';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Weeping Saints Invoice Management System
type View = 'list' | 'form' | 'preview';

export default function App() {
  const [view, setView] = useState<View>('list');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fdc77214`;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/invoices`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.invoices);
      } else {
        console.error('Error fetching invoices:', data.error);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const response = await fetch(`${API_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(invoiceData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchInvoices();
        setSelectedInvoice(data.invoice);
        setView('preview');
        setIsNewlyCreated(true);
      } else {
        console.error('Error creating invoice:', data.error);
        alert('Failed to create invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please check your connection.');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchInvoices();
      } else {
        console.error('Error deleting invoice:', data.error);
        alert('Failed to delete invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice. Please check your connection.');
    }
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setView('preview');
    setIsNewlyCreated(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setInvoices(invoices.map(inv => inv.id === id ? data.invoice : inv));
        setSelectedInvoice(data.invoice);
      } else {
        console.error('Error updating invoice status:', data.error);
        alert('Failed to update invoice status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update invoice status. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#1a2332] to-[#0d1117]">
      {/* Header */}
      <header className="border-b border-[#2d3b4e] bg-[#1a2332]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-white mb-1">WEEPING SAINTS</h1>
              <p className="text-gray-400 italic text-sm">Gracefully Building Unforgettable Brands</p>
            </div>
            {view === 'list' && (
              <Button 
                onClick={() => setView('form')}
                className="bg-[#f5a623] hover:bg-[#d68f1f] text-white"
              >
                <Plus className="size-4 mr-2" />
                New Invoice
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'list' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="size-6 text-[#f5a623]" />
              <h2 className="text-2xl text-white">Invoice Database</h2>
              <span className="text-gray-400">({invoices.length})</span>
            </div>
            
            {loading ? (
              <div className="text-center py-16 text-gray-400">
                <div className="animate-pulse">Loading invoices...</div>
              </div>
            ) : (
              <InvoiceList
                invoices={invoices}
                onView={handleViewInvoice}
                onDelete={handleDeleteInvoice}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        )}

        {view === 'form' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1a2332] border border-[#2d3b4e] rounded-lg p-8">
              <h2 className="text-2xl text-white mb-6">Create New Invoice</h2>
              <InvoiceForm
                onSubmit={handleCreateInvoice}
                onCancel={() => setView('list')}
              />
            </div>
          </div>
        )}

        {view === 'preview' && selectedInvoice && (
          <InvoicePreview
            invoice={selectedInvoice}
            onClose={() => setView('list')}
            onStatusChange={handleStatusChange}
            isNewlyCreated={isNewlyCreated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d3b4e] mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#f5a623] to-transparent mx-auto mb-4"></div>
          <p>© {new Date().getFullYear()} Weeping Saints. PR & Marketing House.</p>
        </div>
      </footer>
    </div>
  );
}