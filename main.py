from flask import Flask, render_template, request, jsonify
from utils.resume_parser import parse_resume
from utils.job_description_parser import parse_job_description
from utils.openai_analysis import analyze_alignment
import os

app = Flask(__name__)
app.config.from_object('config')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    resume_text = request.form.get('resume_text')
    job_description = request.form.get('job_description')

    if not resume_text:
        resume_file = request.files.get('resume_file')
        if resume_file:
            resume_text = resume_file.read().decode('utf-8')
        else:
            return jsonify({'error': 'Missing resume'}), 400

    if not job_description:
        return jsonify({'error': 'Missing job description'}), 400

    parsed_resume = parse_resume(resume_text)
    parsed_jd = parse_job_description(job_description)
    
    analysis_result = analyze_alignment(parsed_resume, parsed_jd)
    
    return jsonify(analysis_result)

@app.route('/results')
def results():
    return render_template('results.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
