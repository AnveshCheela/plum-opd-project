import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_pdf(filename="plum_opd_project_details.pdf"):
    # Target 1 page: margins 0.5 inch (36 points)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles to match monochromatic theme
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#000000'),
        alignment=0, # Left aligned
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#555555'),
        spaceAfter=15
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#000000'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#222222'),
        spaceAfter=8
    )
    
    link_label_style = ParagraphStyle(
        'LinkLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#000000')
    )
    
    link_url_style = ParagraphStyle(
        'LinkURL',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#000000')
    )

    story = []
    
    # Header Title
    story.append(Paragraph("🏥 Plum OPD — AI-Powered Adjudication", title_style))
    story.append(Paragraph("Internship Project Submission • AI Automation Engineer", subtitle_style))
    
    # Thin divider line
    line_table = Table([[""]], colWidths=[540], rowHeights=[1])
    line_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor('#e5e5e5')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(line_table)
    story.append(Spacer(1, 10))
    
    # Overview
    story.append(Paragraph("Project Overview", heading_style))
    overview_text = (
        "Plum OPD is an intelligent, full-stack web application that completely automates "
        "the approval and rejection of outpatient medical insurance claims. Designed to eliminate manual processing "
        "delays, the tool accepts bill or prescription scans (PDF/images), runs optical character recognition (OCR), "
        "and uses Google Gemini AI to parse unstructured text into clean medical metadata. "
        "A policy-driven rule engine then evaluates the claim against 8 automated rules in priority order. "
        "If the claim is flagged with anomalies or potential duplicates, it is routed to a custom Admin Manual Adjudication "
        "queue where administrators can perform overrides (approve with custom amounts or reject with notes) in real-time."
    )
    story.append(Paragraph(overview_text, body_style))
    
    # Tech Stack
    story.append(Paragraph("Technical Stack", heading_style))
    tech_text = (
        "<b>Frontend:</b> React 19, Vite 8, React Router 7, Axios, Monochromatic Custom CSS Theme<br/>"
        "<b>Backend:</b> Node.js, Express 5, Multer File Uploader<br/>"
        "<b>AI & OCR Engine:</b> Google Gemini 2.5 Flash API (structured JSON output), Tesseract.js 7<br/>"
        "<b>Database:</b> MongoDB Atlas (Mongoose 9)<br/>"
        "<b>Deployments:</b> Vercel (Frontend), Railway (Backend API)"
    )
    story.append(Paragraph(tech_text, body_style))
    
    story.append(Spacer(1, 10))
    
    # Project Links Table
    story.append(Paragraph("Project Delivery Links", heading_style))
    
    links_data = [
        [Paragraph("GitHub Repository", link_label_style), 
         Paragraph("<a href='https://github.com/AnveshCheela/plum-opd-project'>github.com/AnveshCheela/plum-opd-project</a>", link_url_style)],
        [Paragraph("Live Web Application", link_label_style), 
         Paragraph("<a href='https://plum-opd-project.vercel.app/'>plum-opd-project.vercel.app/</a>", link_url_style)],
        [Paragraph("Source Code (Google Drive)", link_label_style), 
         Paragraph("<a href='https://drive.google.com/drive/folders/1QEMENDYaLdd59azBYhryKhkhby58kolJ?usp=sharing'>Drive Folder (Zip & Scans)</a>", link_url_style)],
        [Paragraph("Video Walkthrough (YouTube)", link_label_style), 
         Paragraph("<a href='https://youtu.be/Pe6P37RdJ3M'>youtu.be/Pe6P37RdJ3M</a>", link_url_style)]
    ]
    
    # colWidths: Label (180), URL (360) = 540 total width
    links_table = Table(links_data, colWidths=[180, 360])
    links_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fafafa')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e5e5')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(links_table)
    
    # Footer Note
    story.append(Spacer(1, 30))
    footer_style = ParagraphStyle(
        'DocFooter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#999999'),
        alignment=1 # Centered
    )
    story.append(Paragraph("Submission by Anvesh Cheela for Plum AI Automation Engineer Intern Assignment. Page 1 of 1.", footer_style))
    
    doc.build(story)

if __name__ == "__main__":
    create_pdf()
