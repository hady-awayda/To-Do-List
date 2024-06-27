// Tasks are stored as an array of objects, but local storage only allows strings to be stored in it, hence why we use JSON.parse to convert it back to an array of objects

// Event listener for DOMContentLoaded: When the document is fully loaded, initialize event listeners and load tasks from local storage
document.addEventListener("DOMContentLoaded", () => {
  // Define Input Fields and Buttons
  const name = document.getElementById("task-name");
  const date = document.getElementById("task-date");
  const person = document.getElementById("task-person");
  const addButton = document.getElementById("add-task");
  const pending = document.getElementById("pending-tasks");
  const completed = document.getElementById("completed-tasks");
  const pastDue = document.getElementById("past-due-tasks");

  loadTasks();

  addButton.addEventListener("click", () => {
    addTask(name, date, person);
  });
});

// Function to retrieve the tasks from local storage and render them
const loadTasks = () => {
  const tasks = getTasks();

  tasks.forEach((task) => renderTask(task));
};

// Function to render a task
const renderTask = (task) => {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.classList.add(task.status);
  taskElement.setAttribute("draggable", true);

  const details = document.createElement("div");
  details.classList.add("details");
  details.innerHTML = `
	<strong>${task.name}</strong>
	<span>${task.person}</span>
	<span>${new Date(task.date).toLocaleDateString("en-US")}</span>
  `;

  const actionsElement = document.createElement("div");
  actionsElement.classList.add("actions");
  const completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.addEventListener("click", () => {
    task.status = "completed";
    updateTaskStatus(task);
  });

  actionsElement.appendChild(completeButton);

  taskElement.appendChild(detailsElement);
  taskElement.appendChild(actionsElement);

  if (task.status === "pending") {
    pending.appendChild(taskElement);
  } else if (task.status === "completed") {
    completed.appendChild(taskElement);
  } else if (task.status === "past-due") {
    pastDue.appendChild(taskElement);
  }

  taskElement.addEventListener("dragstart", dragStart);
  taskElement.addEventListener("dragend", dragEnd);

  checkTaskDueDate(task);
};

// Retrieve tasks from local storage which is stored as a JSON string and convert it back to an array of objects
const getTasks = () => {
  return JSON.parse(localStorage.getItem("tasks")) || [];
};

// Save tasks to local storage which is stored as a JSON string by converting it to a string using JSON.stringify
const setTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to add a new task to local storage
const addTask = (name, date, person) => {
  const task = createTask(name, date, person);

  // Here we initialize tasks as an empty array in case it doesn't exist in local storage, otherwise, we retreive the tasks from local storage as an array
  const tasks = getTasks();

  // And then we push the new task to the tasks array
  tasks.push(task);

  // And then we set the tasks array back to local storage
  setTasks(tasks);

  // Finally we render the new task
  renderTask(task);
};

// Return a new task object
const createTask = (name, date, person) => {
  return {
    name,
    date,
    person,
    status: "pending",
  };
};
