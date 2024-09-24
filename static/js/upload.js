document.addEventListener('DOMContentLoaded', function() {
    const resumeUpload = document.getElementById('resumeUpload');
    const resumeFileName = document.getElementById('resumeFileName');
    const resumeText = document.getElementById('resumeText');
    const jobDescription = document.getElementById('jobDescription');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator hidden';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Analyzing...</p>';
    document.body.appendChild(loadingIndicator);

    let resumeFile = null;

    resumeUpload.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.txt';
        input.onchange = (e) => {
            resumeFile = e.target.files[0];
            resumeFileName.textContent = `File uploaded: ${resumeFile.name}`;
            resumeFileName.classList.remove('hidden');
        };
        input.click();
    });

    resumeUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        resumeUpload.classList.add('border-blue-500');
    });

    resumeUpload.addEventListener('dragleave', () => {
        resumeUpload.classList.remove('border-blue-500');
    });

    resumeUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        resumeUpload.classList.remove('border-blue-500');
        resumeFile = e.dataTransfer.files[0];
        resumeFileName.textContent = `File uploaded: ${resumeFile.name}`;
        resumeFileName.classList.remove('hidden');
    });

    analyzeBtn.addEventListener('click', async () => {
        if (!resumeFile && !resumeText.value) {
            alert('Please upload a resume or paste resume content');
            return;
        }

        if (!jobDescription.value) {
            alert('Please enter a job description');
            return;
        }

        loadingIndicator.classList.remove('hidden');
        analyzeBtn.disabled = true;

        const formData = new FormData();
        if (resumeFile) {
            formData.append('resume_file', resumeFile);
        } else {
            formData.append('resume_text', resumeText.value);
        }
        formData.append('job_description', jobDescription.value);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                if (result.redirect) {
                    localStorage.setItem('analysisResult', JSON.stringify(result.analysis_result));
                    window.location.href = result.redirect;
                } else {
                    throw new Error('Invalid response from server');
                }
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing the resume');
        } finally {
            loadingIndicator.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });
});
