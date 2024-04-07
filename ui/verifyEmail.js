function verifyEmail(event) {
	event.preventDefault();
	const code = document.querySelector('input[name="otp"]').value;
	const email = sessionStorage.getItem('email');

	console.log({code, email});

	if (!email) {
		alert('First Register');
		window.location = '/app/register';
	}

	fetch('/verify-email', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email, code})
	}).then(response => {
		if (response.status === 201) {
			return response.json();
		} else {
			alert('Verification failed');
			throw new Error('Verification failed');
		}
	}).then(data => {
		alert(data.message);
		window.location = '/app/login';
	}).catch(console.error);
}
