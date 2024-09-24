import chardet
from flask import Flask, render_template, request, jsonify, url_for, redirect, abort, session, make_response, flash
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

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

if not app.config.get('OPENAI_API_KEY'):
    logger.error("OPENAI_API_KEY is not set in the environment variables")
    raise ValueError("OPENAI_API_KEY is not set. Please set it in your environment variables.")

@app.route('/')
def index():
    logger.info("Rendering index page")
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        logger.info("POST request received, redirecting to analyze page")
        return redirect(url_for('analyze'))
    logger.info("Rendering upload page")
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
            return jsonify({'error': 'Please provide a resume file or text.'}), 400

        if not job_description:
            logger.error("Missing job description")
            return jsonify({'error': 'Please provide a job description.'}), 400

        logger.info("Parsing resume")
        parsed_resume = parse_resume(resume_content)
        logger.debug(f"Parsed resume (first 500 chars): {parsed_resume[:500]}...")

        logger.info("Parsing job description")
        parsed_jd = parse_job_description(job_description)
        logger.debug(f"Parsed job description (first 500 chars): {parsed_jd[:500]}...")
        
        logger.info("Analyzing alignment")
        analysis_result = analyze_alignment(parsed_resume, parsed_jd)
        
        if not analysis_result:
            logger.error("Failed to get analysis result from OpenAI")
            return jsonify({'error': 'Failed to analyze resume. Please try again later.'}), 500

        logger.info(f"Analysis result: {json.dumps(analysis_result, indent=2)}")
        
        session['analysis_result'] = json.dumps(analysis_result)
        
        response_data = {
            'redirect': url_for('results'),
            'analysis_result': analysis_result
        }
        response = make_response(jsonify(response_data))
        response.headers['Content-Type'] = 'application/json'
        logger.info("Sending analysis result and redirect URL")
        return response, 200

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}", exc_info=True)
        error_response = {'error': 'An error occurred while analyzing the resume. Please try again.'}
        logger.error(f"Returning error response: {json.dumps(error_response, indent=2)}")
        return jsonify(error_response), 500

@app.route('/results')
def results():
    logger.info("Rendering results page")
    analysis_result = session.get('analysis_result')
    if not analysis_result:
        logger.error("No analysis result found in session")
        flash("No analysis result found. Please upload your resume and job description again.", "error")
        return redirect(url_for('upload'))
    
    try:
        analysis_result = json.loads(analysis_result)
        logger.info(f"Loaded analysis result from session: {json.dumps(analysis_result, indent=2)}")
    except json.JSONDecodeError:
        logger.error("Failed to decode analysis result from session")
        flash("An error occurred while loading the analysis result. Please try again.", "error")
        return redirect(url_for('upload'))
    
    return render_template('results.html', analysis_result=analysis_result)

@app.errorhandler(404)
def page_not_found(e):
    logger.error(f"404 error: {str(e)}")
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    logger.error(f"500 error: {str(e)}")
    return render_template('500.html'), 500

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(host='0.0.0.0', port=5000, debug=True)
