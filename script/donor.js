document.addEventListener('DOMContentLoaded', function() {
    const donorForm = document.getElementById('donorForm');
    const messageDiv = document.getElementById('form-message');

    donorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('donor-name').value.trim(),
            age: parseInt(document.getElementById('donor-age').value),
            blood_type: document.getElementById('donor-blood').value,
            organ: document.getElementById('donor-organ').value,
            phone: '',
            email: ''
        };

        // Validate form data
        if (!formData.name || !formData.age || !formData.blood_type || !formData.organ) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (formData.age < 18 || formData.age > 65) {
            showMessage('Donor age must be between 18 and 65 years.', 'error');
            return;
        }

        try {
            // Submit form data
            const response = await fetch('/api/donors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(result.message, 'success');
                donorForm.reset();
                
                // Redirect to matches page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/matches';
                }, 2000);
            } else {
                showMessage(result.error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error registering donor:', error);
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

