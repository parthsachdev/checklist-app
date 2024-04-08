document.addEventListener('DOMContentLoaded', (ev) => {
	const token = localStorage.getItem('token');
	if (token) {
		window.location = '/app/categories';
	}
});

function registerUser(event) {
	event.preventDefault();
	const email = document.querySelector('input[name="email"]').value;
	const password = document.querySelector('input[name="password"]').value;
	const username = document.querySelector('input[name="username"]').value;

	fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({username, email, password})
	}).then((response) => {
		if (response.status === 200) {
			return response.json();
		} else {
			alert('Failed to register. Please try again');
			throw new Error('Register Failed');
		}
	}).then((data) => {
		alert(data.message);
		sessionStorage.setItem('email', email);
		window.location = '/app/verifyEmail';
	}).catch(console.error);
}
