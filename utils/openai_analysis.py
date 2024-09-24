from openai_chat_completion.chat_request import send_openai_request
import json
import logging

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

    try:
        logger.info("Sending request to OpenAI API")
        response = send_openai_request(prompt)
        logger.info(f"Received response from OpenAI API: {response[:100]}...")
        
        logger.info("Parsing JSON response")
        analysis = json.loads(response)
        logger.info(f"Successfully parsed JSON response: {json.dumps(analysis, indent=2)}")

        # Validate and sanitize the response
        analysis['score'] = max(0, min(100, float(analysis.get('score', 0))))
        analysis['strengths'] = analysis.get('strengths', [])[:3] or ['No strengths identified']
        analysis['improvements'] = analysis.get('improvements', [])[:3] or ['No improvements identified']
        analysis['interview_questions'] = analysis.get('interview_questions', [])[:3] or ['No interview questions generated']
        analysis['explanation'] = analysis.get('explanation', 'No explanation provided.')

        logger.info(f"Final analysis result: {json.dumps(analysis, indent=2)}")
        return analysis

    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON: {str(e)}")
        logger.error(f"Raw response: {response}")
        return create_error_response("Invalid response format from AI model")
    except ValueError as e:
        logger.error(f"Error processing values: {str(e)}")
        return create_error_response("Error processing analysis values")
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {str(e)}", exc_info=True)
        return create_error_response("An unexpected error occurred during analysis")

def create_error_response(error_message):
    return {
        "score": 0,
        "strengths": ["Error occurred during analysis"],
        "improvements": ["Please try again later"],
        "interview_questions": ["Unable to generate questions due to an error"],
        "explanation": error_message
    }
