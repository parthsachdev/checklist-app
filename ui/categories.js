// get token from local storage
document.addEventListener('DOMContentLoaded', () => {
	var token = localStorage.getItem('token');
	if (!token) {
		window.location = '/app/login';
	}

	fetch('/categories', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).then(function (response) {
		if (response.status === 200) {
			return response.json();
		} else {
			alert('error fetching categories');
			throw new Error('error');
		}
	}).then(function (data){
		const categories = data.data;
		const categoryForm = document.getElementById('categoryForm')
		categoryForm.innerHTML = categories.map(function (category) {
			const inputHTML =  `<input type="checkbox" id="${category.category_name}" name="${category.category_name}" value="${category.category_id}" ${category.checked ? 'checked': ''} />`;
			const labelHTML = ` <label for="${category.category_name}">${category.category_name}</label>`;
			return inputHTML.concat(labelHTML);
		}).join(' ').concat('');

		const submitButton = document.createElement('button');
		// submitButton.id = 'submitButton';
		submitButton.setAttribute('type', 'submit');
		submitButton.setAttribute('id', 'submitButton');
		submitButton.textContent = 'Submit';
		categoryForm.appendChild(submitButton);
		submitButton.onsubmit = function (event) {
			event.preventDefault();
			const checkedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(function (checkbox) {
				return checkbox.value;
			});
			console.log({checkedCategories});
			fetch('/categories', {
				method: 'PUT',
				headers: {
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					checkList: checkedCategories
				})
			}).then(function (response) {
				if (response.status === 200) {
					alert('Categories updated');
				} else {
					alert('error updating categories');
					throw new Error('error');
				}
			}).catch(function (error) {
				console.error('Error:', error);
			});
		}
		}).catch(function (error) {
			console.error('Error:', error);
		});


});
