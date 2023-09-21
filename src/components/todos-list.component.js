import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const Todo = props => (
    <tr>
        <td>{props.todo.todo_description}</td>
        <td>{props.todo.todo_responsible}</td>
        <td>{props.todo.todo_priority}</td>
        <td>
        {/* {props.todo._id} */}
            <Link to={"/edit/" + props.todo._id}><FontAwesomeIcon icon={faPenToSquare} style={{ paddingRight: 10 }}/></Link>
            <FontAwesomeIcon icon={faTrashCan} onClick={() => props.onDelete(props.todo._id)} style={{ cursor: 'pointer' ,color:'#518BFA'}}/>
        </td>
    </tr>
)

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = { todos: [] };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    todoList() {
        return this.state.todos.map(function (currentTodo, i) {
            return <Todo todo={currentTodo} key={i} />;
        })
    }
    handleDelete = (id) => {
        debugger;
        axios.delete('http://localhost:4000/todos/delete/' + id)
            .then(response => {
                console.log(response.data);
                if(response.data){
                    alert(response.data)
                }
                // Remove the deleted todo from the state
                this.setState({
                    todos: this.state.todos.filter(todo => todo._id !== id)
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
    todoList() {
        return this.state.todos.map((currentTodo, i) => {
            return <Todo todo={currentTodo} key={i} onDelete={this.handleDelete} />;
        });
    }
    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 30 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.todoList()}
                    </tbody>
                </table>
            </div>
        )
    }
}