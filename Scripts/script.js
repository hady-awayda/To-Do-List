// Tasks are stored as an array of objects, but local storage only allows strings to be stored in it, hence why we use JSON.parse to convert it back to an array of objects

// Event listener for DOMContentLoaded: When the document is fully loaded, initialize event listeners and load tasks from local storage
document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("task-name");
  const date = document.getElementById("task-date");
  const person = document.getElementById("task-person");
  const addButton = document.getElementById("add-task");
  const clearButton = document.getElementById("clear-tasks");
  const pending = document.getElementById("pending-tasks");
  const completed = document.getElementById("completed-tasks");
  const pastDue = document.getElementById("past-due-tasks");
  console.log("dom loaded");

  addButton.addEventListener("click", () => {
    if (name.value === "" || date.value === "") {
      alert("Please fill in all fields");
      return;
    }
    addTask(name, date, person);
  });

  clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      const tasks = getTasks();
      tasks.length = 0;
      setTasks(tasks);
      pending.innerHTML = "";
      completed.innerHTML = "";
      pastDue.innerHTML = "";
    }
  });

  const updateTask = (task) => {
    const tasks = getTasks();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i].status = task.status;
        break;
      }
    }

    setTasks(tasks);

    rerender_tasks(task);
  };

  const rerender_tasks = () => {
    pending.innerHTML = "";
    completed.innerHTML = "";
    pastDue.innerHTML = "";

    loadTasks();
  };

  const dragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
    event.currentTarget.classList.add("dragging");
  };

  const dragEnd = (event) => {
    event.currentTarget.classList.remove("dragging");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const taskElement = document.querySelector(`.task[data-id='${id}']`);
    if (taskElement) {
      const task = getTasks().find((t) => t.ud === id);
      task.status = "completed";
      updateTask(task);
      event.currentTarget.classList.remove("over");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("over");
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove("over");
  };

  // Function to retrieve the tasks from local storage and render them
  const loadTasks = () => {
    const tasks = getTasks();

    for (let i = 0; i < tasks.length; i++) {
      renderTask(tasks[i]);
    }
  };

  const checkDueDate = (task) => {
    const now = new Date();
    if (task.status === "pending") {
      return new Date(task.date) < now ? true : false;
    }
  };

  const completeTask = (task) => {
    task.status = "completed";
    updateTask(task);
  };

  const deleteTask = (task) => {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
    rerender_tasks();
  };

  // Function to render a task.
  const renderTask = (task) => {
    const taskElement = document.createElement("div");
    checkDueDate(task) ? (task.status = "past-due") : null;
    taskElement.classList.add("task", task.status);
    taskElement.setAttribute("draggable", true);

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = task_design(task);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    if (task.status === "pending") {
      const completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = "Complete";
      completeButton.addEventListener("click", () => {
        completeTask(task);
      });

      actions.appendChild(completeButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteTask(task);
    });

    actions.appendChild(deleteButton);
    taskElement.appendChild(details);
    taskElement.appendChild(actions);

    if (task.status === "pending") {
      pending.appendChild(taskElement);
    } else if (task.status === "completed") {
      completed.appendChild(taskElement);
    } else if (task.status === "past-due") {
      pastDue.appendChild(taskElement);
    }

    taskElement.addEventListener("dragstart", dragStart);
    taskElement.addEventListener("dragend", dragEnd);

    console.log("rendering task is done");
  };

  // Retrieve tasks from local storage which is stored as a JSON string and convert it back to an array of objects
  const getTasks = () => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  };

  // Save tasks to local storage which is stored as a JSON string by converting it to a string using JSON.stringify
  const setTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("task successfully added!");
  };

  // Function to add a new task to local storage
  const addTask = (name, date, person) => {
    const task = createTask(name.value, date.value, person.value);

    // Here we initialize tasks as an empty array in case it doesn't exist in local storage, otherwise, we retreive the tasks from local storage as an array
    const tasks = getTasks();

    // And then we push the new task to the tasks array
    tasks.push(task);

    // And then we set the tasks array back to local storage
    setTasks(tasks);
    console.log(tasks);

    // Finally we render the new task
    renderTask(task);
  };

  // Return a new task object
  const createTask = (name, date, person) => {
    return {
      id: Date.now().toString(),
      name: name,
      date: date,
      person: person,
      status: "pending",
    };
  };

  const task_design = (task) => {
    return `
        <span class="name"><div>Task: </div><div>${task.name}</div></span>
        <span class="person"><div>Assigned to: </div><div>${
          task.person
        }</div></span>
        <span class="date"><div>Date: </div><div>${new Date(
          task.date
        ).toLocaleDateString("en-US")}</div></span>
      `;
  };

  completed.addEventListener("drop", handleDrop);
  completed.addEventListener("dragover", handleDragOver);
  completed.addEventListener("dragleave", handleDragLeave);

  loadTasks();
});
