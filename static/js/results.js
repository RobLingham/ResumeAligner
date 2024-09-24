document.addEventListener('DOMContentLoaded', function() {
    console.log('Results page loaded');
    let analysisResult;
    try {
        analysisResult = JSON.parse(localStorage.getItem('analysisResult'));
        console.log('Analysis result:', analysisResult);
    } catch (error) {
        console.error('Error parsing analysis result:', error);
        analysisResult = null;
    }

    if (!analysisResult) {
        console.error('No analysis result found');
        window.location.href = '/upload';
        return;
    }

    const scoreText = document.getElementById('scoreText');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreExplanation = document.getElementById('scoreExplanation');
    const strengthsList = document.getElementById('strengthsList');
    const improvementsList = document.getElementById('improvementsList');
    const interviewQuestions = document.getElementById('interviewQuestions');
    const toggleQuestionsBtn = document.getElementById('toggleQuestionsBtn');
    const toggleIcon = document.getElementById('toggleIcon');

    // Set score
    const score = analysisResult.score || 0;
    scoreText.textContent = `${score}%`;
    scoreCircle.style.strokeDashoffset = (100 - score) / 100 * 360;

    // Set score color
    const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-600';
    scoreText.className = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${scoreColor}`;
    scoreCircle.className = scoreColor;

    // Set explanation
    scoreExplanation.textContent = analysisResult.explanation || 'No explanation available.';

    // Helper function to render list items
    const renderListItems = (items, iconClass) => items.map(item => `
        <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${iconClass} mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>${item}</span>
        </li>
    `).join('');

    // Set strengths
    strengthsList.innerHTML = renderListItems(analysisResult.strengths || ['No strengths available'], 'text-green-500');

    // Set improvements
    improvementsList.innerHTML = renderListItems(analysisResult.improvements || ['No improvements available'], 'text-yellow-500');

    // Set interview questions
    interviewQuestions.innerHTML = (analysisResult.interview_questions || ['No interview questions available']).map(question => `
        <li class="bg-gray-50 p-4 rounded-md">
            <p class="font-medium">${question}</p>
        </li>
    `).join('');

    // Toggle interview questions visibility
    toggleQuestionsBtn.addEventListener('click', () => {
        interviewQuestions.classList.toggle('hidden');
        toggleIcon.style.transform = interviewQuestions.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    console.log('Results page fully loaded and populated');
});
