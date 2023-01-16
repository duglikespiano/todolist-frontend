import { Fragment, useState, useEffect } from 'react';
import styles from './TodoCard.module.css';
import verticalEllipsis from './image/icons8-vertical-ellipsis-menu-with-three-dots-expansion-96.png';

export default function TodoCard() {
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

	const [categoryModal, setCategoryModal] = useState(false);
	const [categoryName, setCategoryName] = useState(
		localStorage.getItem('categoryName') || 'Untitled'
	);

	const inputTodo = 'TodoCard_inputTodo__5KYUV';
	const modifyTodo = 'TodoCard_modifyTodo__Rg6C9';

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

	function handleModifyTodo(i) {
		if (document.getElementById(modifyTodo).value.trim() === '') {
			alert('Input proper text');
			throw new Error();
		}

		fetch('http://localhost:8000/todo', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fetchedData[i]),
		})
			.then(setFetchedData((fetchedData) => (fetchedData = [...fetchedData])))
			.catch((error) => {
				console.error('Error', error);
			});

		fetchedData[i].todo = document.getElementById(modifyTodo).value;
		fetchedData[i].toggle = !fetchedData[i].toggle;
	}

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

	function removeTodo(i) {
		fetch('http://localhost:8000/todo', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fetchedData[i]),
		})
			.then(
				setFetchedData(
					fetchedData.filter((todo) => todo.id !== fetchedData[i].id)
				)
			)
			.catch((error) => console.log('Error', error));
	}

	function setModifyButtonToggle(i) {
		let count = 0;

		fetchedData.forEach((todo) => {
			if (todo.toggle === true) {
				count++;
			}
		});

		if (count === 1 && fetchedData[i].toggle === true) {
			fetchedData[i].toggle = !fetchedData[i].toggle;
		} else if (count === 1) {
			fetchedData.map((todo) => (todo.toggle = false));
			fetchedData[i].toggle = !fetchedData[i].toggle;
		} else {
			fetchedData[i].toggle = !fetchedData[i].toggle;
		}
		setFetchedData((fetchedData) => (fetchedData = [...fetchedData]));
	}

	function resetAddTodoInput(event) {
		if (event.key === 'Escape') {
			document.getElementById(inputTodo).value = '';
		}
	}

	function resetModifyTodoInput(event) {
		if (event.key === 'Escape') {
			document.getElementById(modifyTodo).value = '';
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

				{fetchedData.map((todo, i) => (
					<div key={i} className={styles.toDoBox}>
						<span className={styles.toDoText}>{todo.todo}</span>

						<button
							className={styles.buttonTodoModify}
							onClick={() => {
								setModifyButtonToggle(i);
							}}
						>
							{fetchedData[i].toggle ? 'Cancel' : 'Modify'}
						</button>

						<button
							className={styles.buttonTodoRemove}
							onClick={() => {
								removeTodo(i);
							}}
						>
							Remove
						</button>
						<br />
						{fetchedData[i].toggle ? (
							<form>
								<input
									autoFocus
									id={styles.modifyTodo}
									placeholder="Input to modify todo.."
									onKeyDown={(event) => {
										resetModifyTodoInput(event, i);
									}}
								/>
								<button
									id={styles.buttonConfirmTodoModify}
									onClick={(event) => {
										event.preventDefault();
										handleModifyTodo(i);
									}}
								>
									Confirm{' '}
								</button>
							</form>
						) : null}
					</div>
				))}
			</div>
		</Fragment>
	);
}
