let todoController = (function() {
  let Todo = function(id, description, status) {
    this.id = id;
    this.description = description;
    this.status = status;
  };

  let data = [];

  return {
    addTodo: function(desc, status) {
      let id, newTodo;
      if (data.length > 0) {
        id = data[data.length - 1].id + 1;
      } else {
        id = 0;
      }
      newTodo = new Todo(id, desc, status);
      data.push(newTodo);
      return newTodo;
    },
    deleteTodo: function(id) {
      let ids, index;

      ids = data.map(function(cur) {
        return cur.id;
      });
      console.log(ids);
      index = ids.indexOf(id);

      if (index !== -1) {
        data.splice(index, 1);
      }
    },
    todoStatus: function(id, status) {
      data.map(function(cur) {
        //console.log(cur);
        if (id === cur.id) {
          cur.status = status;
        }
      });
    },

    test: function() {
      console.log(data);
    }
  };
})();

let UIController = (function() {
  let DOMStrings = {
    addTodo: '.add__todo',
    addBtn: '.add__btn',
    todoList: '.todo__list',
    deleteBtn: '.item__delete--btn',
    itemDone: '.item__done',
    itemTag: '.item__tag'
  };

  return {
    getInput: function() {
      return {
        description: document.querySelector(DOMStrings.addTodo).value,
        status: 'toDo'
      };
    },
    addTodoItem: function(obj) {
      var html;
      html = `<div class="item clearfix" id="todo-${obj.id}">
      <input class="item__done" type="checkbox" />
      <div class="item__description">${obj.description}</div>
      <div class="right clearfix">
        <div class="item__tag">${obj.status}</div>
        <div class="item__edit">
          <button class="item__edit--btn">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        <div class="item__delete">
          <button class="item__delete--btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>`;
      document
        .querySelector(DOMStrings.todoList)
        .insertAdjacentHTML('beforeend', html);
    },
    clearInput: function() {
      document.querySelector(DOMStrings.addTodo).value = '';
    },

    getStatus(itemID) {
      let el, todoStatus, todoTag;
      el = document.getElementById(itemID);
      todoStatus = el.querySelector(DOMStrings.itemDone).checked;
      todoTag = el.querySelector(DOMStrings.itemTag);

      if (todoStatus) {
        todoTag.textContent = 'Done';
        todoTag.classList.toggle('done');
        return 'Done';
      } else {
        todoTag.textContent = 'ToDo';
        todoTag.classList.toggle('done');
        return 'ToDo';
      }
    },

    deleteTodoItem(itemID) {
      let el = document.getElementById(itemID);
      el.parentNode.removeChild(el);
    },
    getDomStrings: function() {
      return DOMStrings;
    }
  };
})();

let controller = (function(todoCtrl, UICtrl) {
  let DOM = UICtrl.getDomStrings();
  let todoListSelector = document.querySelector(DOM.todoList);

  document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddTodo);
  document.addEventListener('keypress', function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      ctrlAddTodo();
    }
  });

  todoListSelector.addEventListener('click', ctrlDeleteTodo);
  todoListSelector.addEventListener('click', updateStatus);

  function ctrlAddTodo() {
    let input, newTodo;
    // 1. get description fron input field
    input = UICtrl.getInput();
    if (input.description !== '') {
      // 2. add todo to todo ctrl
      newTodo = todoCtrl.addTodo(input.description, input.status);
      // 3. add todo to ui
      UICtrl.addTodoItem(newTodo);
    }
    UICtrl.clearInput();
  }

  function ctrlDeleteTodo(e) {
    //console.log(e.target.classList.value);
    let itemID, splitID, deleteClass;
    deleteClass = e.target.classList.value;
    if (deleteClass.indexOf('fa-trash-alt') === -1) {
      return;
    }
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    //console.log(itemID);
    splitID = parseInt(itemID.split('-')[1]);
    // remove todo from data
    todoCtrl.deleteTodo(splitID);
    // remove todo from ui
    UICtrl.deleteTodoItem(itemID);
  }

  function updateStatus(e) {
    let itemID, splitID, statusClass, todoStatus;
    statusClass = e.target.classList.value;
    if (statusClass.indexOf('item__done') === -1) {
      return;
    }
    itemID = e.target.parentNode.id;
    splitID = parseInt(itemID.split('-')[1]);
    // update status in UI
    todoStatus = UICtrl.getStatus(itemID);
    // update status in data
    todoCtrl.todoStatus(splitID, todoStatus);
  }
})(todoController, UIController);
