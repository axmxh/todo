let todoController = (function() {
  let Todo = function(id, description, status) {
    this.id = id;
    this.description = description;
    this.status = status;
  };

  let data = [];

  return {
    newTodo: function(desc) {
      let id, newTodo;
      if (data.length !== 0) {
        id = data[data.length - 1].id + 1;
      } else {
        id = 0;
      }
      newTodo = new Todo(id, desc, (status = 'toDo'));
      data.push(newTodo);
      return newTodo;
    },
    test: function() {
      console.log(data);
    }
  };
})();

let UIController = (function() {
  let DOMStrings = {
    addTodo: '.add__todo',
    addBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        description: document.querySelector(DOMStrings.addTodo).value
      };
    },
    getDomStrings: function() {
      return DOMStrings;
    }
  };
})();

let controller = (function(todoCtrl, UICtrl) {
  let DOM = UICtrl.getDomStrings();
  document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddTodo);

  function ctrlAddTodo() {
    let input;
    // 1. get description fron input field
    input = UICtrl.getInput();
    if (input.description !== '') {
      todoCtrl.newTodo(input.description);
    }
    //console.log(input.description);
  }
})(todoController, UIController);
