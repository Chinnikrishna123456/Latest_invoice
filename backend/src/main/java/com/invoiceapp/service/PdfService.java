package com.invoiceapp.service;

import com.invoiceapp.dto.InvoiceDTO;
import com.invoiceapp.entity.ServiceItem;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {
    
    public byte[] generateInvoicePdf(InvoiceDTO invoice) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);
        
        try {
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            
            Paragraph header = new Paragraph("INVOICE")
                .setFont(boldFont)
                .setFontSize(28)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
            document.add(header);
            
            Paragraph invoiceInfo = new Paragraph("Invoice #: " + invoice.getInvoiceNumber() + "\nDate: " + invoice.getDate())
                .setFont(regularFont)
                .setMarginBottom(20);
            document.add(invoiceInfo);
            
            Paragraph employeeTitle = new Paragraph("Employee Information")
                .setFont(boldFont)
                .setFontSize(14)
                .setMarginBottom(10);
            document.add(employeeTitle);
            
            Paragraph employeeDetails = new Paragraph()
                .add("Name: " + invoice.getEmployeeName() + "\n")
                .add("ID: " + invoice.getEmployeeId() + "\n")
                .add("Email: " + invoice.getEmployeeEmail() + "\n")
                .add("Phone: " + invoice.getEmployeeMobile() + "\n")
                .add("Address: " + invoice.getEmployeeAddress())
                .setFont(regularFont)
                .setMarginBottom(20);
            document.add(employeeDetails);
            
            Paragraph servicesTitle = new Paragraph("Services/Work Details")
                .setFont(boldFont)
                .setFontSize(14)
                .setMarginBottom(10);
            document.add(servicesTitle);
            
            Table table = new Table(4);
            table.setWidth(UnitValue.createPercentValue(100));
            
            table.addCell(new Cell().add(new Paragraph("Description").setFont(boldFont)));
            table.addCell(new Cell().add(new Paragraph("Hours").setFont(boldFont)));
            table.addCell(new Cell().add(new Paragraph("Rate").setFont(boldFont)));
            table.addCell(new Cell().add(new Paragraph("Amount").setFont(boldFont)));
            
            for (ServiceItem service : invoice.getServices()) {
                table.addCell(new Cell().add(new Paragraph(service.getDescription())));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(service.getHours()))));
                table.addCell(new Cell().add(new Paragraph("₹" + String.format("%.2f", service.getRate()))));
                table.addCell(new Cell().add(new Paragraph("₹" + String.format("%.2f", service.getTotal()))));
            }
            
            document.add(table);
            
            Paragraph totalsTitle = new Paragraph("Summary")
                .setFont(boldFont)
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
            document.add(totalsTitle);
            
            Paragraph subtotal = new Paragraph("Subtotal: ₹" + String.format("%.2f", invoice.getSubTotal()))
                .setFont(regularFont);
            document.add(subtotal);
            
            Paragraph taxAmount = new Paragraph("Tax (" + invoice.getTaxRate() + "%): ₹" + String.format("%.2f", invoice.getTaxAmount()))
                .setFont(regularFont);
            document.add(taxAmount);
            
            Paragraph grandTotal = new Paragraph("Grand Total: ₹" + String.format("%.2f", invoice.getGrandTotal()))
                .setFont(boldFont)
                .setFontSize(14);
            document.add(grandTotal);
            
            document.close();
        } catch (Exception e) {
            System.out.println("Error generating PDF: " + e.getMessage());
            throw new IOException("Failed to generate PDF", e);
        }
        
        return baos.toByteArray();
    }
}
