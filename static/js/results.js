document.addEventListener('DOMContentLoaded', function() {
    console.log('Results page loaded');

    const scoreText = document.getElementById('scoreText');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreExplanation = document.getElementById('scoreExplanation');
    const strengthsList = document.getElementById('strengthsList');
    const improvementsList = document.getElementById('improvementsList');
    const interviewQuestions = document.getElementById('interviewQuestions');
    const toggleQuestionsBtn = document.getElementById('toggleQuestionsBtn');
    const toggleIcon = document.getElementById('toggleIcon');

    let analysisResult;
    try {
        if (window.analysisResult && Object.keys(window.analysisResult).length > 0) {
            console.log('Raw analysis result:', window.analysisResult);
            analysisResult = window.analysisResult;
        } else {
            throw new Error('Analysis result is undefined or empty');
        }
    } catch (error) {
        console.error('Error parsing analysis result:', error);
        displayError('Failed to load analysis result. Please try again.');
        return;
    }

    if (!analysisResult || typeof analysisResult !== 'object') {
        console.error('Invalid analysis result format:', analysisResult);
        displayError('Invalid analysis result format. Please try again.');
        return;
    }

    // Parse analysis result
    const score = parseFloat(analysisResult.alignment_score || analysisResult.score || 0);
    const strengths = analysisResult.strengths || [];
    const improvements = analysisResult.areas_for_improvement || analysisResult['areas For Improvement'] || [];
    const questions = analysisResult.interview_questions || analysisResult['interview Preparation Questions'] || [];
    const explanation = analysisResult.explanation || analysisResult.explanation_of_score || 'No explanation available';

    console.log('Parsed analysis result:', {
        score,
        strengths,
        improvements,
        questions,
        explanation
    });

    // Set score
    if (isNaN(score)) {
        console.error('Invalid score:', score);
        displayError('Invalid score. Please try again.');
        return;
    }

    const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-600';
    scoreText.textContent = `${score}%`;
    scoreText.className = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${scoreColor}`;
    scoreCircle.className = scoreColor;
    scoreCircle.style.strokeDashoffset = (100 - score) / 100 * 360;

    // Update strengths
    updateList(strengthsList, strengths, 'No specific strengths identified.');

    // Update improvements
    updateList(improvementsList, improvements, 'No specific areas for improvement identified.');

    // Update interview questions
    updateList(interviewQuestions, questions, 'No specific interview questions generated.');

    // Update score explanation
    scoreExplanation.textContent = explanation;

    // Toggle interview questions visibility
    toggleQuestionsBtn.addEventListener('click', () => {
        interviewQuestions.classList.toggle('hidden');
        toggleIcon.style.transform = interviewQuestions.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        console.log('Interview questions toggled');
    });

    console.log('Results page fully loaded and populated');
});

function updateList(element, items, emptyMessage) {
    if (Array.isArray(items) && items.length > 0) {
        element.innerHTML = items.map(item => `
            <li class="bg-gray-50 p-4 rounded-md">
                <p class="font-medium">${item}</p>
            </li>
        `).join('');
    } else {
        console.warn(`No items available for ${element.id}`);
        element.innerHTML = `<li>${emptyMessage}</li>`;
    }
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
    errorDiv.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${message}</span>
        <button class="absolute top-0 right-0 px-4 py-3" onclick="this.parentElement.remove()">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
        </button>
    `;
    document.querySelector('main').prepend(errorDiv);
    console.error('Error displayed:', message);
}
