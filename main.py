from flask import Flask, render_template, request, jsonify
from utils.resume_parser import parse_resume
from utils.job_description_parser import parse_job_description
from utils.openai_analysis import analyze_alignment
import os
import logging
import json

app = Flask(__name__)
app.config.from_object('config')

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        logger.info("Received analyze request")
        resume_content = None
        job_description = request.form.get('job_description')

        if 'resume_file' in request.files:
            resume_file = request.files['resume_file']
            if resume_file.filename != '':
                resume_content = resume_file.read()
                logger.info(f"Resume file received: {resume_file.filename}")
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
        logger.info("Parsing job description")
        parsed_jd = parse_job_description(job_description)
        
        logger.info("Analyzing alignment")
        analysis_result = analyze_alignment(parsed_resume, parsed_jd)
        
        logger.info(f"Analysis result: {json.dumps(analysis_result, indent=2)}")
        return jsonify(analysis_result)
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}", exc_info=True)
        error_response = {'error': 'An error occurred while analyzing the resume'}
        logger.error(f"Returning error response: {json.dumps(error_response, indent=2)}")
        return jsonify(error_response), 500

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
