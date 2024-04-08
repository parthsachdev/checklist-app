document.addEventListener('DOMContentLoaded', (ev) => {
	const token = localStorage.getItem('token');
	if (token) {
		window.location = '/app/categories';
	}
});

document.getElementById('loginForm').onsubmit = function (event) {
	event.preventDefault();
	const email = document.querySelector('input[name="email"]').value;
	const password = document.querySelector('input[name="password"]').value;
	fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email, password
		})
	}).then((response) => {
		if (response.status === 200) {
			return response.json();
		} else {
			alert('Login failed. Please try again.');
			throw new Error('Login failed');
		}
	}).then((data) => {
		localStorage.setItem('token', data.token);
		window.location = '/app/categories';
	}).catch(console.error);
}
