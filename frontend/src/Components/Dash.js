import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Nav from './Nav';
import Container from 'react-bootstrap/Container';
import Modal from 'react-modal';
import AddTodo from './AddTodo.js';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class Dash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timerLengthMins: 3,
      timerLengthSecs: 0,
      timerName: '',
      todos: [],
      groupName: '',
      modalIsOpen: false
    }

    this.addModal = this.addModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onTextboxChangeGroupName = this.onTextboxChangeGroupName.bind(this);

  }

  onTextboxChangeGroupName(event) {
    this.setState({groupName: event.target.value})
  }

  addModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  deleteTodo(todo) {
  const token = JSON.parse(localStorage.the_main_app).token;

  fetch(`http://localhost:3000/todo?token=${token}&todoId=${todo._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(json => {
    if (json.success) {
      this.props.getTodos(token)
      this.closeModal()
    } else {
      this.setState({timerError: json.message, isLoading: false})
    }
  });
}

noTodos() {
  if(this.props.todos.length === 0) {
    return (
      <div>
        <h2>Welcome to Simple Todo</h2>
        <h4>Press the Add Todo button above to create your first Todo.</h4>
      </div>
    )
  }
}

  render() {
    return (
      <div>
        <Nav username={this.props.username} addModal={this.addModal} getTodos={this.props.getTodos} loggedOut={this.props.loggedOut}></Nav>
        <div>
          <Container>
            {this.noTodos()}
            {this.props.todos.map(t => {
              return (
                <div className="todo" key={t._id}>
                  <div className="groupNameParent">
                    <h3>{t.name}</h3>
                    <Button onClick={() => this.deleteTodo(t)}>Done</Button>
                  </div>
                </div>
              )
            })}
          </Container>
          <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal} style={customStyles} contentLabel="Example Modal">
            <h2 ref={subtitle => this.subtitle = subtitle}>Add a Todo to your list</h2>
            <AddTodo getTodos={this.props.getTodos} closeModal={this.closeModal}></AddTodo>
          </Modal>
        </div>
      </div>
    )
  }

}

export default Dash;
