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
            showError('Please upload a resume or paste resume content');
            return;
        }

        if (!jobDescription.value) {
            showError('Please enter a job description');
            return;
        }

        showLoading();
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
                throw new Error(error.error || 'An error occurred while analyzing the resume');
            }
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'An error occurred while analyzing the resume. Please try again.');
        } finally {
            hideLoading();
            analyzeBtn.disabled = false;
        }
    });

    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.display = 'flex';
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
        loadingIndicator.style.display = 'none';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${message}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        `;
        document.querySelector('main').insertBefore(errorDiv, document.querySelector('main').firstChild);
        
        // Auto-remove the error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        // Allow manual closing of the error message
        errorDiv.querySelector('svg').addEventListener('click', () => {
            errorDiv.remove();
        });
    }
});
