document.addEventListener('DOMContentLoaded', function() {
    const recipientForm = document.getElementById('recipientForm');
    const messageDiv = document.getElementById('form-message');

    recipientForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('recipient-name').value.trim(),
            age: parseInt(document.getElementById('recipient-age').value),
            blood_type: document.getElementById('recipient-blood').value,
            organ: document.getElementById('recipient-organ').value,
            urgency: document.getElementById('recipient-urgency').value,
            phone: '',
            email: ''
        };

        // Validate form data
        if (!formData.name || !formData.age || !formData.blood_type || !formData.organ || !formData.urgency) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (formData.age < 1 || formData.age > 80) {
            showMessage('Recipient age must be between 1 and 80 years.', 'error');
            return;
        }

        try {
            // Submit form data
            const response = await fetch('/api/recipients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(result.message, 'success');
                recipientForm.reset();
                
                // Redirect to matches page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/matches';
                }, 2000);
            } else {
                showMessage(result.error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error registering recipient:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.style.color = type === 'success' ? 'green' : 'red';
        messageDiv.style.display = 'block';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});
