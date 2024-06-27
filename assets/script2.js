// document.addEventListener("DOMContentLoaded", () => {
//   const taskNameInput = document.getElementById("task-name");
//   const taskDateInput = document.getElementById("task-date");
//   const taskPersonInput = document.getElementById("task-person");
//   const addTaskButton = document.getElementById("add-task");
//   const pendingTasksContainer = document.getElementById("pending-tasks");
//   const completedTasksContainer = document.getElementById("completed-tasks");
//   const pastDueTasksContainer = document.getElementById("past-due-tasks");

//   const loadTasksFromLocalStorage = () => {
//     const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     tasks.forEach((task) => renderTask(task));
//   };

//   const saveTasksToLocalStorage = (tasks) => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   };

//   const addTask = (name, date, person) => {
//     const task = {
//       id: Date.now(),
//       name,
//       date,
//       person,
//       status: "pending",
//     };

//     const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     tasks.push(task);
//     saveTasksToLocalStorage(tasks);
//     renderTask(task);
//   };

//   const renderTask = (task) => {
//     const taskElement = document.createElement("div");
//     taskElement.classList.add("task");
//     taskElement.classList.add(task.status);
//     taskElement.setAttribute("draggable", true);
//     taskElement.dataset.id = task.id;

//     const detailsElement = document.createElement("div");
//     detailsElement.classList.add("details");
//     detailsElement.innerHTML = `
//           <strong>${task.name}</strong>
//           <span>${new Date(task.date).toLocaleString()}</span>
//           <span>Assigned to: ${task.person}</span>
//       `;

//     const actionsElement = document.createElement("div");
//     actionsElement.classList.add("actions");
//     const completeButton = document.createElement("button");
//     completeButton.textContent = "Complete";
//     completeButton.addEventListener("click", () => {
//       task.status = "completed";
//       updateTaskStatus(task);
//     });

//     actionsElement.appendChild(completeButton);

//     taskElement.appendChild(detailsElement);
//     taskElement.appendChild(actionsElement);

//     if (task.status === "pending") {
//       pendingTasksContainer.appendChild(taskElement);
//     } else if (task.status === "completed") {
//       completedTasksContainer.appendChild(taskElement);
//     } else if (task.status === "past-due") {
//       pastDueTasksContainer.appendChild(taskElement);
//     }

//     taskElement.addEventListener("dragstart", dragStart);
//     taskElement.addEventListener("dragend", dragEnd);

//     checkTaskDueDate(task);
//   };

//   const updateTaskStatus = (updatedTask) => {
//     const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     const index = tasks.findIndex((task) => task.id === updatedTask.id);
//     tasks[index] = updatedTask;
//     saveTasksToLocalStorage(tasks);
//     renderTasks();
//   };

//   const renderTasks = () => {
//     pendingTasksContainer.innerHTML = "";
//     completedTasksContainer.innerHTML = "";
//     pastDueTasksContainer.innerHTML = "";
//     const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     tasks.forEach((task) => renderTask(task));
//   };

//   const checkTaskDueDate = (task) => {
//     const now = new Date();
//     if (new Date(task.date) < now && task.status === "pending") {
//       task.status = "past-due";
//       updateTaskStatus(task);
//     }
//   };

//   const dragStart = (event) => {
//     event.dataTransfer.setData("text/plain", event.target.dataset.id);
//     event.currentTarget.classList.add("dragging");
//   };

//   const dragEnd = (event) => {
//     event.currentTarget.classList.remove("dragging");
//   };

//   const handleDrop = (event) => {
//     const id = event.dataTransfer.getData("text/plain");
//     const taskElement = document.querySelector(`.task[data-id='${id}']`);
//     const task = JSON.parse(localStorage.getItem("tasks")).find(
//       (t) => t.id == id
//     );
//     task.status = "completed";
//     updateTaskStatus(task);
//     event.currentTarget.classList.remove("over");
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.add("over");
//   };

//   const handleDragLeave = (event) => {
//     event.currentTarget.classList.remove("over");
//   };

//   addTaskButton.addEventListener("click", () => {
//     const name = taskNameInput.value;
//     const date = taskDateInput.value;
//     const person = taskPersonInput.value;

//     if (name && date && person) {
//       addTask(name, date, person);
//       taskNameInput.value = "";
//       taskDateInput.value = "";
//       taskPersonInput.value = "";
//     }
//   });

//   completedTasksContainer.addEventListener("drop", handleDrop);
//   completedTasksContainer.addEventListener("dragover", handleDragOver);
//   completedTasksContainer.addEventListener("dragleave", handleDragLeave);

//   loadTasksFromLocalStorage();
// });

// To