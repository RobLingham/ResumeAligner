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

    except (json.JSONDecodeError, ValueError, KeyError) as e:
        print(f"Error processing OpenAI response: {str(e)}")
        # Return a default structure if there's an error
        analysis = {
            "score": 0,
            "strengths": ['No data available'],
            "improvements": ['No data available'],
            "interview_questions": ['No data available'],
            "explanation": "Error processing the analysis."
        }

    return analysis
