import { Fragment, useState, useEffect } from 'react';
import styles from './CategoryAndInput.module.css';
import verticalEllipsis from './image/icons8-vertical-ellipsis-menu-with-three-dots-expansion-96.png';
import TodoContent from './TodoContent';

export default function CategoryAndInput() {
	class Object {
		constructor(todo, category, toggle) {
			this.todo = todo;
			this.category = category;
			this.toggle = toggle;
		}
	}

	const [fetchedData, setFetchedData] = useState([]);
	useEffect(() => {
		fetch('http://localhost:8000/todo')
			.then((res) => res.json())
			.then((data) =>
				setFetchedData((fetchedData) => (fetchedData = data.data))
			);
	}, []);

	function modifyCategoryName() {
		const modifyCategoryName = prompt('Input to modify category name').trim();
		if (modifyCategoryName === '' || modifyCategoryName === null) {
			alert('Input proper text');
			throw new Error();
		}

		const data = { category: modifyCategoryName };
		fetch('http://localhost:8000/category', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(
				fetchedData.forEach((todo) => {
					todo.category = modifyCategoryName;
				})
			)
			.then(setFetchedData((fetchedData) => (fetchedData = [...fetchedData])))
			.catch((error) => {
				console.error('Error', error);
			});
		localStorage.setItem('categoryName', modifyCategoryName);
		setCategoryName((categoryName) => (categoryName = modifyCategoryName));
	}

	const [categoryModal, setCategoryModal] = useState(false);
	const [categoryName, setCategoryName] = useState(
		localStorage.getItem('categoryName') || 'Untitled'
	);

	const inputTodo = 'TodoCard_inputTodo__5KYUV';

	function addTodo(event) {
		event.preventDefault();

		if (document.getElementById(inputTodo).value.trim() === '') {
			alert('Input proper text');
			throw new Error();
		}

		const newTodoObject = new Object(
			document.getElementById(inputTodo).value,
			categoryName,
			false
		);

		fetch('http://localhost:8000/todo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newTodoObject),
		})
			.then(setFetchedData((fetchedData) => [...fetchedData, newTodoObject]))
			.catch((error) => {
				console.error('Error', error);
			});
		document.getElementById(inputTodo).value = '';
		document.getElementById(inputTodo).focus();
	}

	function resetAddTodoInput(event) {
		if (event.key === 'Escape') {
			document.getElementById(inputTodo).value = '';
		}
	}

	function toggleCategoryModal(event) {
		if (categoryModal === true && event.target === window) {
		}
		setCategoryModal((categoryModal) => (categoryModal = !categoryModal));
	}

	function removeAllTodos() {
		const data = { category: fetchedData[0].category };
		fetch('http://localhost:8000/category', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(setFetchedData(fetchedData.slice(0, 0)))
			.then(
				setCategoryModal((categoryModal) => (categoryModal = !categoryModal))
			)
			.catch((error) => {
				console.error('Error', error);
			});
	}
	return (
		<Fragment>
			<div id={styles.mainContentBody}>
				<div className={styles.categoryNameBox}>
					<div
						className={styles.categoryName}
						id="categoryNameInput"
						onClick={modifyCategoryName}
					>
						{categoryName}
					</div>
					<div className={styles.imgCategoryModifyModalBox}>
						{categoryModal && (
							<div className={styles.categoryFunctionButtonModal}>
								<button
									className={styles.categoryFunctionButton}
									onClick={removeAllTodos}
								>
									Clear all
								</button>
							</div>
						)}
						<img
							onClick={toggleCategoryModal}
							className={styles.imgCategoryModifyModal}
							src={verticalEllipsis}
							alt=""
						/>
					</div>
				</div>
				<div>
					<form>
						<input
							id={styles.inputTodo}
							placeholder="Input to add todo.."
							onKeyDown={(event) => {
								resetAddTodoInput(event);
							}}
						/>
						<button id={styles.buttonTodoAdd} onClick={addTodo}>
							Add
						</button>
					</form>
				</div>
				<TodoContent />
			</div>
		</Fragment>
	);
}
