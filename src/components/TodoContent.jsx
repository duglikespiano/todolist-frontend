import { Fragment, useState } from 'react';
import styles from './CategoryAndInput.module.css';

export default function TodoContent(props) {
	const [fetchedData, setFetchedData] = useState([]);
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
	function resetModifyTodoInput(event) {
		if (event.key === 'Escape') {
			document.getElementById(modifyTodo).value = '';
		}
	}
	const modifyTodo = 'TodoCard_modifyTodo__Rg6C9';

	return (
		<Fragment>
			<div>호호호</div>
			{/* {props.fetchedData?.map((todo, i) => (
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
			))} */}
		</Fragment>
	);
}
