import { Invoice } from '../types';
import jsPDF from 'jspdf';

export const generateInvoicePDF = (invoice: Invoice) => {
    try {
        console.log('Starting PDF generation for invoice:', invoice.invoiceNumber);
        
        const doc = new jsPDF();
        let yPosition = 20;

        // Calculate totals
        const subTotal = invoice.services.reduce((acc, s) => acc + s.hours * s.rate, 0);
        const taxAmount = subTotal * (invoice.taxRate / 100);
        const grandTotal = subTotal + taxAmount;

        console.log('Calculated totals:', { subTotal, taxAmount, grandTotal });

        // Header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 14, yPosition);
        
        yPosition += 15;
        
        // Invoice Details
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 14, yPosition);
        
        yPosition += 12;
        
        // Employee Info Header
        doc.setFont('helvetica', 'bold');
        doc.text('Bill To:', 14, yPosition);
        
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.employeeName, 14, yPosition);
        yPosition += 6;
        doc.text(`Employee ID: ${invoice.employeeId}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Email: ${invoice.employeeEmail}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Phone: ${invoice.employeeMobile}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Address: ${invoice.employeeAddress}`, 14, yPosition);
        
        yPosition += 15;
        
        // Services Table Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Description', 14, yPosition);
        doc.text('Hours', 100, yPosition);
        doc.text('Rate', 130, yPosition);
        doc.text('Total', 160, yPosition);
        
        yPosition += 8;
        
        // Draw line
        doc.setDrawColor(200);
        doc.line(14, yPosition, 196, yPosition);
        
        yPosition += 6;
        
        // Services Table Body
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        invoice.services.forEach(service => {
            const total = service.hours * service.rate;
            doc.text(service.description.substring(0, 30), 14, yPosition);
            doc.text(service.hours.toFixed(2), 100, yPosition);
            doc.text(`₹${service.rate.toFixed(2)}`, 130, yPosition);
            doc.text(`₹${total.toFixed(2)}`, 160, yPosition);
            yPosition += 8;
        });
        
        yPosition += 6;
        
        // Draw line
        doc.line(14, yPosition, 196, yPosition);
        
        yPosition += 8;
        
        // Totals
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Subtotal:', 130, yPosition);
        doc.text(`₹${subTotal.toFixed(2)}`, 160, yPosition);
        
        yPosition += 8;
        doc.text(`Tax (${invoice.taxRate}%):`, 130, yPosition);
        doc.text(`₹${taxAmount.toFixed(2)}`, 160, yPosition);
        
        yPosition += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Grand Total:', 130, yPosition);
        doc.text(`₹${grandTotal.toFixed(2)}`, 160, yPosition);
        
        yPosition += 15;
        
        // Footer
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your business!', 14, yPosition);
        
        // Save PDF
        const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
        doc.save(fileName);
        console.log('PDF saved successfully:', fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};