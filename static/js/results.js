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

    // Set score color
    const score = parseFloat(scoreText.textContent);
    console.log('Score:', score);
    const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-600';
    scoreText.className = `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${scoreColor}`;
    scoreCircle.className = scoreColor;
    scoreCircle.style.strokeDashoffset = (100 - score) / 100 * 360;

    console.log('Strengths:', strengthsList.innerHTML);
    console.log('Improvements:', improvementsList.innerHTML);
    console.log('Interview Questions:', interviewQuestions.innerHTML);

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
