import PyPDF2
from io import BytesIO

def parse_resume(resume_content):
    if isinstance(resume_content, str):
        return resume_content
    elif isinstance(resume_content, bytes):
        try:
            # Try to parse as PDF
            pdf_reader = PyPDF2.PdfReader(BytesIO(resume_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except PyPDF2.errors.PdfReadError:
            # If not a PDF, assume it's plain text
            return resume_content.decode('utf-8', errors='ignore')
    else:
        raise ValueError("Unsupported resume content type")
