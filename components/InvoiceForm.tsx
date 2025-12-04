import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, ServiceItem } from '../types';
import { ICONS } from '../constants';

interface InvoiceFormProps {
    onSave: (invoice: Invoice) => void;
    selectedInvoice: Invoice | null;
    clearSelection: () => void;
    invoicesCount: number;
}

const createEmptyInvoice = (count: number): Omit<Invoice, 'id'> => ({
    invoiceNumber: `INV#OF-${String(new Date().getTime()).slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeId: '',
    employeeEmail: '',
    employeeAddress: '',
    employeeMobile: '',
    services: [{ id: `service-${Date.now()}`, description: '', hours: 1, rate: 0 }],
    taxRate: 10,
});


export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSave, selectedInvoice, clearSelection, invoicesCount }) => {
    const [invoiceData, setInvoiceData] = useState(createEmptyInvoice(invoicesCount));

    useEffect(() => {
        if (selectedInvoice) {
            setInvoiceData(selectedInvoice);
        } else {
            setInvoiceData(createEmptyInvoice(invoicesCount));
        }
    }, [selectedInvoice, invoicesCount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (id: string, field: keyof Omit<ServiceItem, 'id'>, value: string | number) => {
        setInvoiceData(prev => ({
            ...prev,
            services: prev.services.map(service => 
                service.id === id ? { ...service, [field]: value } : service
            )
        }));
    };
    
    const addService = () => {
        setInvoiceData(prev => ({
            ...prev,
            services: [...prev.services, { id: `service-${Date.now()}`, description: '', hours: 1, rate: 0 }]
        }));
    };

    const removeService = (id: string) => {
        setInvoiceData(prev => ({
            ...prev,
            services: prev.services.filter(service => service.id !== id)
        }));
    };

    const { subTotal, taxAmount, grandTotal } = useMemo(() => {
        const subTotal = invoiceData.services.reduce((acc, service) => acc + service.hours * service.rate, 0);
        const taxAmount = subTotal * (invoiceData.taxRate / 100);
        const grandTotal = subTotal + taxAmount;
        return { subTotal, taxAmount, grandTotal };
    }, [invoiceData.services, invoiceData.taxRate]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...invoiceData, id: selectedInvoice?.id || `invoice-${Date.now()}` });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 space-y-6 sticky top-24 animate-fade-in-up overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{selectedInvoice ? '✏️ Edit Invoice' : '➕ Create Invoice'}</h2>
                    {selectedInvoice && (
                        <button type="button" onClick={clearSelection} className="text-sm bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1 transition-colors">New</button>
                    )}
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Invoice #</label>
                        <input type="text" value={invoiceData.invoiceNumber} readOnly className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Date</label>
                        <input type="date" name="date" value={invoiceData.date} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" required />
                    </div>
                </div>

                {/* Employee Info */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-600 rounded"></span>
                        Employee Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" name="employeeName" placeholder="Full Name" value={invoiceData.employeeName} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm" required />
                        <input type="text" name="employeeId" placeholder="Employee ID" value={invoiceData.employeeId} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm disabled:bg-gray-100" disabled={!!selectedInvoice} required />
                        <input type="email" name="employeeEmail" placeholder="Email" value={invoiceData.employeeEmail} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm" required />
                        <input type="tel" name="employeeMobile" placeholder="Mobile" value={invoiceData.employeeMobile} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm" required />
                    </div>
                    <textarea name="employeeAddress" placeholder="Address" value={invoiceData.employeeAddress} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm resize-none" required></textarea>
                </div>

                {/* Work Details */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-600 rounded"></span>
                        Work Details
                    </h3>
                    
                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-2 px-2 mb-2">
                        <div className="col-span-5">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hours</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Unit Price</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">Amount</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
                        {invoiceData.services.map((service) => (
                            <div key={`service-${service.id}`} className="grid grid-cols-12 gap-2 items-end bg-white p-2 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                <input type="text" placeholder="Description" value={service.description} onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} className="col-span-5 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" required />
                                <input type="number" placeholder="Hours" value={service.hours} onChange={(e) => handleServiceChange(service.id, 'hours', parseFloat(e.target.value) || 0)} className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" min="0" step="0.5" />
                                <input type="number" placeholder="Rate" value={service.rate} onChange={(e) => handleServiceChange(service.id, 'rate', parseFloat(e.target.value) || 0)} className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" min="0" step="0.01" />
                                <div className="col-span-2 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700">₹{(service.hours * service.rate).toFixed(2)}</span>
                                    <button type="button" onClick={() => removeService(service.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors">
                                        {ICONS.DELETE}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addService} className="w-full py-2 px-3 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        {ICONS.PLUS} Add Service
                    </button>
                </div>

                {/* Totals */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Subtotal</span>
                        <span className="text-sm font-semibold text-gray-900">₹{subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700">Tax Rate</label>
                            <div className="flex items-center bg-white border border-gray-300 rounded px-2 py-1">
                                <input type="number" name="taxRate" value={invoiceData.taxRate} onChange={(e) => setInvoiceData(prev => ({...prev, taxRate: parseFloat(e.target.value) || 0}))} className="w-12 text-sm focus:outline-none" min="0" max="100" />
                                <span className="text-sm text-gray-500">%</span>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-gray-900">Grand Total</span>
                        <span className="text-2xl font-bold text-blue-600">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 pb-6">
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg">
                    {selectedInvoice ? '💾 Update Invoice' : '✅ Save Invoice'}
                </button>
            </div>
        </form>
    );
};