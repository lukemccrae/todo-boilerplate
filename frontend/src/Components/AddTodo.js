import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';

class AddTodo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      todos: [],
      todoName: ''
    }
    this.todoNameRef = React.createRef();
    this.saveTodo = this.saveTodo.bind(this);
    this.onTextboxChangeTodoName = this.onTextboxChangeTodoName.bind(this);
  }

  onTextboxChangeTodoName(event) {
    this.setState({todoName: event.target.value})
  }

  componentDidMount() {
    this.todoNameRef.current.focus();
  }


  saveTodo() {
    const token = JSON.parse(https://simple-todo-d5482.herokuapp.comStorage.the_main_app).token;

    fetch(`https://simple-todo-d5482.herokuapp.com/host:3000/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.todoName,
        token: token
      })
    }).then(res => res.json()).then(json => {
      if (json.success) {
        this.props.getTodos();
        this.props.closeModal();
      } else {
        this.setState({timerError: json.message, isLoading: false})
      }
    });
  }



  render() {
    return (
      <div>
        <input type="text" ref={this.todoNameRef} placeholder="Todo Name" value={this.state.todoName} onChange={this.onTextboxChangeTodoName}/>
        <div>
          <Button onClick={this.saveTodo}>Save</Button>
        </div>
      </div>
    )
  }

}

export default AddTodo;
