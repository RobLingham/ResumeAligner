document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.className = 'hidden fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50';
    loadingIndicator.innerHTML = '<div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>';
    document.body.appendChild(loadingIndicator);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analyze();
    });

    function analyze() {
        const formData = new FormData(form);
        loadingIndicator.classList.remove('hidden');

        fetch('/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.classList.add('hidden');
            if (data.redirect) {
                window.location.href = data.redirect;
            } else if (data.error) {
                displayError(data.error);
            }
        })
        .catch(error => {
            loadingIndicator.classList.add('hidden');
            console.error('Error:', error);
            displayError('An unexpected error occurred. Please try again.');
        });
    }

    function displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${message}</span>
        `;
        form.prepend(errorDiv);
    }
});
