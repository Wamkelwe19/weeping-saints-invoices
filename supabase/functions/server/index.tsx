import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Create a new invoice
app.post('/make-server-fdc77214/invoices', async (c) => {
  try {
    const invoice = await c.req.json();
    
    // Generate invoice number if not provided
    if (!invoice.invoiceNumber) {
      const allInvoices = await kv.getByPrefix('invoice:');
      const invoiceCount = allInvoices.length;
      invoice.invoiceNumber = `WS-${String(invoiceCount + 1).padStart(5, '0')}`;
    }
    
    // Add metadata
    invoice.id = crypto.randomUUID();
    invoice.createdAt = new Date().toISOString();
    invoice.updatedAt = new Date().toISOString();
    
    // Save to KV store
    await kv.set(`invoice:${invoice.id}`, invoice);
    
    return c.json({ success: true, invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all invoices
app.get('/make-server-fdc77214/invoices', async (c) => {
  try {
    const invoices = await kv.getByPrefix('invoice:');
    
    // Sort by creation date (newest first)
    invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ success: true, invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get a single invoice
app.get('/make-server-fdc77214/invoices/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const invoice = await kv.get(`invoice:${id}`);
    
    if (!invoice) {
      return c.json({ success: false, error: 'Invoice not found' }, 404);
    }
    
    return c.json({ success: true, invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update invoice
app.put('/make-server-fdc77214/invoices/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`invoice:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Invoice not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve original ID
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`invoice:${id}`, updated);
    
    return c.json({ success: true, invoice: updated });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete invoice
app.delete('/make-server-fdc77214/invoices/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`invoice:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
