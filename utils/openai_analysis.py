from openai_chat_completion.chat_request import send_openai_request
import json

def analyze_alignment(resume, job_description):
    prompt = f"""
    Analyze the alignment between the following resume and job description:

    Resume:
    {resume}

    Job Description:
    {job_description}

    Provide the following in JSON format:
    1. An alignment score (0-100)
    2. A list of strengths (maximum 3)
    3. A list of areas for improvement (maximum 3)
    4. A list of interview preparation questions (maximum 3)
    5. A brief explanation of the score
    """

    response = send_openai_request(prompt)
    
    try:
        analysis = json.loads(response)
    except json.JSONDecodeError:
        # If the response is not valid JSON, return a default structure
        analysis = {
            "score": 0,
            "strengths": [],
            "improvements": [],
            "interview_questions": [],
            "explanation": "Error processing the analysis."
        }

    return analysis
