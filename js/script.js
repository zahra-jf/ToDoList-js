const ItemForm = document.getElementById("Item-form");
const listInput = document.getElementById("list-input");
const textInvalid = document.getElementById("text-invalid");
const mainUl = document.getElementById("main-ul");
const clearAll = document.getElementById("clear-all");
const formFilter = document.getElementById("form-filter");
const editBtn = ItemForm.querySelector("button");
let isEditMode = false;
let myBar = document.getElementById("myBar");
let textPercent = document.getElementById("percent-text");
let progress_bar = document.querySelectorAll(".myProgress");

// evevts
document.addEventListener("DOMContentLoaded", onDocumentLoad);
ItemForm.addEventListener("submit", submit);
// mainUl.addEventListener("click", onClick);
clearAll.addEventListener("click", clearFunction);
formFilter.addEventListener("input", filterFunction);

checkUI();

function makeId(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function onDocumentLoad() {
  let itemFromStorage = getItemStorage();
  itemFromStorage.forEach(function (item) {
    createLi(item.value, item.completed);
  });
  checkUI();
  percentOfCompeletedTask();
}

function submit(e) {
  e.preventDefault();
  const itemValue = listInput.value;
  if (itemValue == "") {
    textInvalid.innerText = "Please put an item !";
    return;
  } else {
    textInvalid.innerText = "";
  }
  if (isEditMode) {
    const itemToEdit = mainUl.querySelector(".edit-text");
    removeItem(itemToEdit.parentElement.parentElement);
    editBtn.classList.replace("btn-primary", "btn-secondary");
    editBtn.innerHTML = "+ Add";
    isEditMode = false;
  } else {
    if (checkRepetitiousItem(itemValue)) {
      textInvalid.innerText = "That task already exists!";
      return;
    } else {
      textInvalid.innerText = "";
    }
  }
  createLi(itemValue);

  listInput.value = "";

  addToStorage(itemValue);

  checkUI();
}

function checkRepetitiousItem(searchableValue) {
  let itemsFromStorage = getItemStorage();
  let flag = false;
  itemsFromStorage.forEach(function (item) {
    if (item.value === searchableValue) {
      flag = true;
    }
  });
  return flag;
}

function createLi(itemValue, completed = false) {
  let id = makeId(5);
  let newLi = createNewLi();
  let leftDiv = createLeftDiv();
  let iconCheck = createIconCheck(id);
  iconCheck.addEventListener("click", function () {
    completeTask(id);
  });
  let textDiv = createTextDiv(id, itemValue, completed);
  leftDiv.appendChild(iconCheck);
  leftDiv.appendChild(textDiv);
  textDiv.addEventListener("click", function () {
    editItem(id);
  });

  let iconX = createDeleteIcon(id);
  iconX.addEventListener("click", function () {
    deleteTask(id);
  });

  newLi.appendChild(leftDiv);
  newLi.appendChild(iconX);
  mainUl.appendChild(newLi);
  checkMarkToggle(id, completed);
}

function createNewLi() {
  let newLi = document.createElement("li");
  newLi.className =
    "items list-group-item  d-flex  justify-content-between  align-items-center ";
  return newLi;
}

function createLeftDiv() {
  let leftDiv = document.createElement("div");
  leftDiv.className =
    "d-flex flex-row align-items-center justify-content-center ";
  return leftDiv;
}

function createIconCheck(id) {
  let iconCheck = document.createElement("i");
  iconCheck.className = "bi bi-square";
  iconCheck.id = "check-" + id;
  return iconCheck;
}

function createTextDiv(id, itemValue, completed) {
  let textDiv = document.createElement("div");
  textDiv.innerText = itemValue;
  textDiv.className = "hoverMode mx-2 task-test";
  textDiv.id = "text-" + id;
  if (completed) {
    textDiv.classList.add("line-on-text");
  }
  return textDiv;
}

function createDeleteIcon(id) {
  let iconX = document.createElement("i");
  iconX.className = "icon-item bi bi-trash3";
  iconX.id = "delete-" + id;
  return iconX;
}

function editItem(id) {
  isEditMode = true;
  mainUl
    .querySelectorAll(".task-test")
    .forEach((item) => item.classList.remove("edit-text"));
  let thisText = document.getElementById("text-" + id);
  thisText.classList.add("edit-text");
  listInput.value = thisText.textContent;
  editBtn.classList.replace("btn-secondary", "btn-primary");
  editBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update task";
}

function deleteTask(id) {
  let thisLi = document.getElementById("delete-" + id);
  removeItem(thisLi.parentElement);
  percentOfCompeletedTask();
}

function completeTask(id) {
  let textDiv = document.getElementById("text-" + id);
  let text = textDiv.textContent;
  textDiv.classList.toggle("line-on-text");
  percentOfCompeletedTask();

  let items = getItemStorage();
  let newCompleted = false;
  items.forEach(function (item) {
    if (text === item.value) {
      newCompleted = !item.completed;
      removeItemFromstorag(item.value);
      addToStorage(item.value, newCompleted);
    }
  });
  checkMarkToggle(id, newCompleted);
}

function checkMarkToggle(id, newCompleted) {
  let thisCheck = document.getElementById("check-" + id);
  if (newCompleted) {
    thisCheck.classList.remove("bi-square");
    thisCheck.classList.add("bi-check-square");
  } else {
    thisCheck.classList.remove("bi-check-square");
    thisCheck.classList.add("bi-square");
  }
}

function percentOfCompeletedTask() {
  let totalTasks = mainUl.querySelectorAll("li").length;
  let completedes = mainUl.querySelectorAll("li .line-on-text").length;
  let percent = (completedes / totalTasks) * 100;
  let width = 0 + "%";
  percentText = 0 + "%";
  if (totalTasks) {
    width = percent + "%";
    percentText = Math.round(percent) + "%";
  }
  myBar.style.width = width;
  textPercent.innerText = percentText;
}

function removeItem(item) {
  item.remove();
  removeItemFromstorag(item.textContent);
  checkUI();
}

function clearFunction() {
  mainUl.innerHTML = "";
  checkUI();
  localStorage.removeItem("items");
  editBtn.classList.replace("btn-primary", "btn-secondary");
  editBtn.innerHTML = "+ add ";
  isEditMode = false;
  percentOfCompeletedTask();
}

function checkUI() {
  const items = mainUl.querySelectorAll("li");
  if (items.length === 0) {
    clearAll.style.display = "none";
    formFilter.style.display = "none";
  } else {
    clearAll.style.display = "block";
    formFilter.style.display = "block";
  }
}

function filterFunction(e) {
  const filterText = e.target.value.toLowerCase();
  const getli = mainUl.querySelectorAll("li");
  getli.forEach(function (item) {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(filterText) === 0) {
      item.classList.replace("d-none", "d-flex");
    } else {
      item.classList.replace("d-flex", "d-none");
    }
  });
}

function addToStorage(item, completeStatus = false) {
  let itemFromStorage = getItemStorage();
  let inputValue = { value: item, completed: completeStatus };
  itemFromStorage.push(inputValue);
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function getItemStorage() {
  let itemFromStorage = [];
  if (localStorage.getItem("items") !== null) {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemFromStorage;
}

function removeItemFromstorag(value) {
  let itemFromStorage = [];
  if (localStorage.getItem("items") !== null) {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  itemFromStorage = itemFromStorage.filter((i) => i.value !== value);
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function progress() {
  var checked_progress = document.querySelectorAll(".line-on-text");
  var length = checked_progress.length;
  progress_bar.forEach(function (id) {
    id.classList.remove("active");
  });

  for (i = 0; i < length; i++) {
    progress_bar[i].classList.add("active");
  }
}
