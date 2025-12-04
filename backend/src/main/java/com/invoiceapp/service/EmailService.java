package com.invoiceapp.service;

import com.invoiceapp.dto.InvoiceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private PdfService pdfService;
    
    @Value("${app.mail.from}")
    private String fromEmail;
    
    @Value("${app.mail.from-name}")
    private String fromName;
    
    public void sendInvoiceEmail(InvoiceDTO invoice) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(invoice.getEmployeeEmail());
            helper.setSubject("Your Invoice #" + invoice.getInvoiceNumber());
            
            String emailBody = buildEmailBody(invoice);
            helper.setText(emailBody, true);
            
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);
            helper.addAttachment("Invoice_" + invoice.getInvoiceNumber() + ".pdf", 
                new ByteArrayResource(pdfBytes));
            
            mailSender.send(message);
            System.out.println("Invoice email sent successfully to: " + invoice.getEmployeeEmail());
            
        } catch (Exception e) {
            System.out.println("Error sending invoice email: " + e.getMessage());
            throw new MessagingException("Failed to send invoice email", e);
        }
    }
    
    public void sendSimpleEmail(String to, String subject, String body) throws MessagingException {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
            
        } catch (Exception e) {
            System.out.println("Error sending email: " + e.getMessage());
            throw new MessagingException("Failed to send email", e);
        }
    }
    
    private String buildEmailBody(InvoiceDTO invoice) {
        StringBuilder body = new StringBuilder();
        body.append("<html><body>");
        body.append("<h2>Invoice Details</h2>");
        body.append("<p>Dear ").append(invoice.getEmployeeName()).append(",</p>");
        body.append("<p>Please find your invoice details below:</p>");
        body.append("<table style='border-collapse: collapse; width: 100%;'>");
        body.append("<tr>");
        body.append("<td style='border: 1px solid #ddd; padding: 8px;'><strong>Invoice #</strong></td>");
        body.append("<td style='border: 1px solid #ddd; padding: 8px;'>").append(invoice.getInvoiceNumber()).append("</td>");
        body.append("</tr>");
        body.append("<tr>");
        body.append("<td style='border: 1px solid #ddd; padding: 8px;'><strong>Date</strong></td>");
        body.append("<td style='border: 1px solid #ddd; padding: 8px;'>").append(invoice.getDate()).append("</td>");
        body.append("</tr>");
        body.append("<tr>");
        body.append("<td style='border: 1px solid #ddd; padding: 8px;'><strong>Grand Total</strong></td>");
        body.append("<td style='border: 1px solid #ddd; padding: 8px;'>₹").append(String.format("%.2f", invoice.getGrandTotal())).append("</td>");
        body.append("</tr>");
        body.append("</table>");
        body.append("<p>A detailed invoice PDF is attached to this email.</p>");
        body.append("<p>Thank you!</p>");
        body.append("</body></html>");
        return body.toString();
    }
}
