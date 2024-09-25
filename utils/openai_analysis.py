import logging
from openai_chat_completion.chat_request import send_openai_request

logger = logging.getLogger(__name__)

def analyze_alignment(resume, job_description):
    logger.info("Starting alignment analysis")
    
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

    logger.info("Sending request to OpenAI API")
    response = send_openai_request(prompt)
    logger.info(f"Received response from OpenAI API: {response}")

    try:
        # Parse the JSON response
        analysis_result = eval(response)
        
        # Standardize the result structure
        standardized_result = {
            "alignment_score": float(analysis_result.get("score", 0)),
            "strengths": analysis_result.get("strengths", [])[:3],
            "areas_for_improvement": analysis_result.get("areas For Improvement", [])[:3],
            "interview_questions": analysis_result.get("interview Preparation Questions", [])[:3],
            "explanation": analysis_result.get("explanation", "No explanation provided.")
        }

        logger.info(f"Standardized analysis result: {standardized_result}")
        return standardized_result

    except Exception as e:
        logger.error(f"Error parsing OpenAI response: {str(e)}")
        return {
            "alignment_score": 0,
            "strengths": [],
            "areas_for_improvement": [],
            "interview_questions": [],
            "explanation": "An error occurred while analyzing the resume and job description."
        }
