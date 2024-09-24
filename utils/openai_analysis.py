from openai_chat_completion.chat_request import send_openai_request
import json
import logging

logger = logging.getLogger(__name__)

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

    try:
        logger.info("Sending request to OpenAI API")
        response = send_openai_request(prompt)
        logger.info(f"Received response from OpenAI API: {response[:100]}...")
        
        logger.info("Parsing JSON response")
        analysis = json.loads(response)
        logger.info(f"Successfully parsed JSON response: {json.dumps(analysis, indent=2)}")

        # Ensure all required fields are present and valid
        analysis['score'] = float(analysis.get('score', 0))
        analysis['strengths'] = analysis.get('strengths', [])[:3]
        analysis['improvements'] = analysis.get('improvements', [])[:3]
        analysis['interview_questions'] = analysis.get('interview_questions', [])[:3]
        analysis['explanation'] = analysis.get('explanation', 'No explanation provided.')

        # Ensure lists have at least one item
        for key in ['strengths', 'improvements', 'interview_questions']:
            if not analysis[key]:
                analysis[key] = ['No data available']

        logger.info(f"Final analysis result: {json.dumps(analysis, indent=2)}")
        return analysis

    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON: {str(e)}")
        logger.error(f"Raw response: {response}")
    except ValueError as e:
        logger.error(f"Error processing values: {str(e)}")
    except KeyError as e:
        logger.error(f"Missing key in response: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)

    # Return a default structure if there's an error
    error_response = {
        "score": 0,
        "strengths": ['Error processing data'],
        "improvements": ['Error processing data'],
        "interview_questions": ['Error processing data'],
        "explanation": "An error occurred while processing the analysis."
    }
    logger.error(f"Returning error response: {json.dumps(error_response, indent=2)}")
    return error_response
