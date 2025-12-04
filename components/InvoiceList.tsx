
import React from 'react';
import { Invoice } from '../types';
import { InvoiceItem } from './InvoiceItem';

interface InvoiceListProps {
    invoices: Invoice[];
    onEdit: (invoice: Invoice) => void;
    onDelete: (id: string) => void;
    onDownload: (invoice: Invoice) => void;
    onSendEmail: (email: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onEdit, onDelete, onDownload, onSendEmail }) => {
    const sortedInvoices = invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">📋 Invoices</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{invoices.length} Total</span>
            </div>
            
            {invoices.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-lg text-gray-600 font-medium mb-2">No invoices yet</p>
                    <p className="text-gray-500">Create your first invoice using the form on the left</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedInvoices.map(invoice => (
                        <InvoiceItem 
                            key={invoice.id} 
                            invoice={invoice}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onDownload={onDownload}
                            onSendEmail={onSendEmail}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
