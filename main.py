import chardet
from flask import Flask, render_template, request, jsonify, url_for, redirect, abort, session, make_response
from werkzeug.utils import secure_filename
from utils.resume_parser import parse_resume
from utils.job_description_parser import parse_job_description
from utils.openai_analysis import analyze_alignment
from openai_chat_completion.chat_request import send_openai_request
import os
import logging
import json

app = Flask(__name__)
app.config.from_object('config')
app.secret_key = os.urandom(24)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Check if OpenAI API key is set
if not app.config.get('OPENAI_API_KEY'):
    logger.error("OPENAI_API_KEY is not set in the environment variables")
    raise ValueError("OPENAI_API_KEY is not set. Please set it in your environment variables.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        return redirect(url_for('analyze'))
    return render_template('upload.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        logger.info("Received POST request to /analyze")
        resume_content = None
        job_description = request.form.get('job_description')

        if 'resume_file' in request.files:
            resume_file = request.files['resume_file']
            if resume_file.filename != '':
                try:
                    resume_content_bytes = resume_file.read()
                    detected_encoding = chardet.detect(resume_content_bytes)['encoding']
                    resume_content = resume_content_bytes.decode(detected_encoding or 'utf-8', errors='replace')
                    logger.info(f"Resume file received and decoded: {resume_file.filename}")
                except Exception as e:
                    logger.error(f"Error decoding resume file: {str(e)}")
                    return jsonify({'error': 'Unable to read the resume file. Please ensure it is a valid text or PDF file.'}), 400
        else:
            resume_content = request.form.get('resume_text')
            logger.info("Resume text received")

        if not resume_content:
            logger.error("Missing resume")
            return jsonify({'error': 'Missing resume'}), 400

        if not job_description:
            logger.error("Missing job description")
            return jsonify({'error': 'Missing job description'}), 400

        logger.info("Parsing resume")
        parsed_resume = parse_resume(resume_content)
        logger.info(f"Parsed resume: {parsed_resume[:500]}...")  # Log the first 500 characters of the parsed resume

        logger.info("Parsing job description")
        parsed_jd = parse_job_description(job_description)
        logger.info(f"Parsed job description: {parsed_jd[:500]}...")  # Log the first 500 characters of the parsed job description
        
        logger.info("Analyzing alignment")
        analysis_result = analyze_alignment(parsed_resume, parsed_jd)
        
        if not analysis_result:
            logger.error("Failed to get analysis result from OpenAI")
            return jsonify({'error': 'Failed to analyze resume. Please try again later.'}), 500

        logger.info(f"Analysis result: {json.dumps(analysis_result, indent=2)}")
        
        # Store the analysis result in the session
        session['analysis_result'] = json.dumps(analysis_result)
        
        # Return JSON response with redirect URL
        response_data = {
            'redirect': url_for('results'),
            'analysis_result': analysis_result
        }
        response = make_response(jsonify(response_data))
        response.headers['Content-Type'] = 'application/json'
        return response, 200

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}", exc_info=True)
        error_response = {'error': 'An error occurred while analyzing the resume. Please try again.'}
        logger.error(f"Returning error response: {json.dumps(error_response, indent=2)}")
        return jsonify(error_response), 500

@app.route('/results')
def results():
    analysis_result = session.get('analysis_result')
    if not analysis_result:
        logger.error("No analysis result found in session")
        return redirect(url_for('upload'))
    
    try:
        analysis_result = json.loads(analysis_result)
    except json.JSONDecodeError:
        logger.error("Failed to decode analysis result from session")
        return redirect(url_for('upload'))
    
    logger.info(f"Rendering results template with analysis result: {json.dumps(analysis_result, indent=2)}")
    return render_template('results.html', analysis_result=analysis_result)

@app.route('/test_openai')
def test_openai():
    try:
        prompt = "Hello, can you give me a short summary of what OpenAI does?"
        response = send_openai_request(prompt)
        return jsonify({"success": True, "response": response})
    except Exception as e:
        logger.error(f"Error in test_openai route: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
