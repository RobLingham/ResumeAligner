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
        // Check if window.analysisResult is defined and not empty
        if (window.analysisResult && Object.keys(window.analysisResult).length > 0) {
            console.log('Raw analysis result:', window.analysisResult);
            analysisResult = JSON.parse(JSON.stringify(window.analysisResult));
            console.log('Parsed analysis result:', analysisResult);
        } else {
            throw new Error('Analysis result is undefined or empty');
        }
    } catch (error) {
        console.error('Error parsing analysis result:', error);
        displayError('Failed to load analysis result. Please try again.');
        return;
    }

    // Set score color
    const score = parseFloat(scoreText.textContent);
    console.log('Score:', score);
    const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-600';
    scoreText.className = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${scoreColor}`;
    scoreCircle.className = scoreColor;
    scoreCircle.style.strokeDashoffset = (100 - score) / 100 * 360;

    // Update strengths
    console.log('Strengths:', analysisResult.strengths);
    strengthsList.innerHTML = analysisResult.strengths.map(strength => `
        <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>${strength}</span>
        </li>
    `).join('');

    // Update improvements
    console.log('Improvements:', analysisResult.improvements);
    improvementsList.innerHTML = analysisResult.improvements.map(improvement => `
        <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>${improvement}</span>
        </li>
    `).join('');

    // Update interview questions
    console.log('Interview Questions:', analysisResult.interview_questions);
    interviewQuestions.innerHTML = analysisResult.interview_questions.map(question => `
        <li class="bg-gray-50 p-4 rounded-md">
            <p class="font-medium">${question}</p>
        </li>
    `).join('');

    // Toggle interview questions visibility
    toggleQuestionsBtn.addEventListener('click', () => {
        interviewQuestions.classList.toggle('hidden');
        toggleIcon.style.transform = interviewQuestions.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        console.log('Interview questions toggled');
    });

    console.log('Results page fully loaded and populated');
});

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative';
    errorDiv.role = 'alert';
    errorDiv.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${message}</span>
    `;
    document.querySelector('main').prepend(errorDiv);
    console.error('Error displayed:', message);
}
