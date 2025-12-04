
import React, { useState, useCallback, useEffect } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { Invoice } from './types';
import { generateInvoicePDF } from './services/pdfService';
import { Modal } from './components/Modal';
import { createInvoice, updateInvoice, deleteInvoice, getAllInvoices } from './services/apiService';

const App: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
    const [emailToSend, setEmailToSend] = useState<string>('');

    // Load invoices from backend on component mount
    useEffect(() => {
        const loadInvoices = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getAllInvoices();
                setInvoices(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load invoices';
                console.error('Error loading invoices:', errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadInvoices();
    }, []);

    const handleSaveInvoice = useCallback(async (invoice: Invoice) => {
        try {
            if (selectedInvoice) {
                // Update existing invoice
                const updatedInvoice = await updateInvoice(selectedInvoice.id, invoice);
                setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
            } else {
                // Create new invoice
                const createdInvoice = await createInvoice(invoice);
                setInvoices(prev => [...prev, createdInvoice]);
            }
            setSelectedInvoice(null);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save invoice';
            setError(errorMessage);
            alert(errorMessage);
        }
    }, [selectedInvoice]);

    const handleSelectInvoice = useCallback((invoice: Invoice) => {
        setSelectedInvoice(invoice);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedInvoice(null);
    }, []);

    const handleDeleteClick = useCallback((id: string) => {
        setInvoiceToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (invoiceToDelete) {
            try {
                await deleteInvoice(invoiceToDelete);
                setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete));
                if (selectedInvoice?.id === invoiceToDelete) {
                    setSelectedInvoice(null);
                }
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
                setError(errorMessage);
                alert(errorMessage);
            }
        }
        setIsDeleteModalOpen(false);
        setInvoiceToDelete(null);
    }, [invoiceToDelete, selectedInvoice]);

    const handleDownload = useCallback((invoice: Invoice) => {
        generateInvoicePDF(invoice);
    }, []);

    const handleSendEmail = useCallback((email: string) => {
        setEmailToSend(email);
        setIsEmailModalOpen(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Invoice Manager</h1>
                            <p className="text-sm text-gray-500 mt-1">Professional invoice management system</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                            <span className="text-2xl font-bold text-blue-600">{invoices.length}</span>
                            <span className="text-sm text-gray-600">Total Invoices</span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700 font-medium">Error: {error}</p>
                        <button 
                            onClick={() => setError(null)}
                            className="text-red-600 text-sm mt-2 hover:underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading invoices...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2">
                            <InvoiceForm 
                                onSave={handleSaveInvoice} 
                                selectedInvoice={selectedInvoice} 
                                clearSelection={handleClearSelection}
                                invoicesCount={invoices.length}
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <InvoiceList 
                                invoices={invoices} 
                                onEdit={handleSelectInvoice} 
                                onDelete={handleDeleteClick}
                                onDownload={handleDownload}
                                onSendEmail={handleSendEmail}
                            />
                        </div>
                    </div>
                )}
            </main>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description="Are you sure you want to delete this invoice? This action cannot be undone."
            />
            <Modal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onConfirm={() => setIsEmailModalOpen(false)}
                title="Email Sent"
                description={`An email has been sent to ${emailToSend}. (This is a simulation).`}
                confirmText="OK"
                showCancel={false}
            />
        </div>
    );
};

export default App;
