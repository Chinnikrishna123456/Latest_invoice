/**
 * API Service for Invoice Management Backend
 * Handles all HTTP requests to the Spring Boot backend
 */

import { Invoice } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/invoices';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Create a new invoice
 */
export const createInvoice = async (invoice: Invoice): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  });

  if (!response.ok) {
    throw new Error(`Failed to create invoice: ${response.statusText}`);
  }

  const result: ApiResponse<Invoice> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to create invoice');
  }

  return result.data!;
};

/**
 * Update an existing invoice
 */
export const updateInvoice = async (id: string, invoice: Invoice): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  });

  if (!response.ok) {
    throw new Error(`Failed to update invoice: ${response.statusText}`);
  }

  const result: ApiResponse<Invoice> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to update invoice');
  }

  return result.data!;
};

/**
 * Get all invoices
 */
export const getAllInvoices = async (): Promise<Invoice[]> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }

  const result: ApiResponse<Invoice[]> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch invoices');
  }

  return result.data || [];
};

/**
 * Get a single invoice by ID
 */
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoice: ${response.statusText}`);
  }

  const result: ApiResponse<Invoice> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch invoice');
  }

  return result.data!;
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete invoice: ${response.statusText}`);
  }

  const result: ApiResponse<void> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete invoice');
  }
};

/**
 * Download invoice as PDF
 */
export const downloadInvoicePdf = async (id: string, invoiceNumber: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}/download`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice_${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Send invoice via email
 */
export const sendInvoiceEmail = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  const result: ApiResponse<void> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to send email');
  }
};

/**
 * Get invoices for a specific employee
 */
export const getInvoicesByEmployeeId = async (employeeId: string): Promise<Invoice[]> => {
  const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }

  const result: ApiResponse<Invoice[]> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch invoices');
  }

  return result.data || [];
};

/**
 * Send custom email
 */
export const sendCustomEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/send-custom-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      subject,
      body,
      sendInvoiceAttachment: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  const result: ApiResponse<void> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to send email');
  }
};