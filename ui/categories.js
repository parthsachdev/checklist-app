function putCategories (token) {
	const allBoxes = document.querySelectorAll('input[type="checkbox"]');
	const allCheckedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
	const checkedCategories = Array.from(allCheckedBoxes).map(checkbox => checkbox.value);
	fetch('/categories', {
		method: 'PUT',
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			checkList: checkedCategories,
			existingList: Array.from(allBoxes).map(checkbox => checkbox.value)
		})
	}).then((response) => {
		if (response.status === 200) {
			alert('Categories updated');
		} else {
			alert('error updating categories');
			throw new Error('error');
		}
	}).catch(console.error);
}

async function getCategories(pageNumber, token) {
	fetch(`/categories?pageNumber=${pageNumber}`, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).then((response) => {
		if (response.status === 200) {
			return response.json();
		} else {
			alert('error fetching categories');
			throw new Error('error');
		}
	}).then((data) => {
		const submitButton = document.getElementById('submitButton');
		submitButton.onclick = (event) => {
			event.preventDefault();
			putCategories(token);
		}

		const categoryForm = document.getElementById('categoryForm');
		Array.from(categoryForm.children).forEach((child) => categoryForm.removeChild(child));

		const categories = data.data;
		categories.map(category => {

			const inputEle = document.createElement('input');
			inputEle.type = 'checkbox';
			inputEle.id = category.category_name;
			inputEle.name = category.category_name;
			inputEle.value = category.category_id;
			inputEle.checked = category.checked;

			const labelEle = document.createElement('label');
			labelEle.setAttribute('for', category.category_name);
			labelEle.innerText = category.category_name;

			return [inputEle, labelEle, document.createElement('br')];
		})
		.flat(1)
		.forEach(ele => categoryForm.appendChild(ele));

		const totalPages = +data.totalPages;
		const paginationList = document.getElementById('paginationList');
		if (paginationList.children.length === 0) {
			for (let i=1; i<=totalPages; i++) {
				const pageBtn = document.createElement('li');
				pageBtn.id = `page-${i}`;
				pageBtn.innerHTML = `${i}`;
				pageBtn.style = 'list-style-type: none; display: inline; margin-right: 10px; color: blue; text-decoration: underline; cursor: pointer';
				paginationList.appendChild(pageBtn);
				pageBtn.addEventListener('click', (event) => getCategories(i, token));
			}
		}

	}).catch(console.error);

}

// get token from local storage
document.addEventListener('DOMContentLoaded', () => {
	const token = localStorage.getItem('token');
	if (!token) {
		window.location = '/app/login';
	}

	getCategories(1, token);
});
