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

// evevts
document.addEventListener("DOMContentLoaded", displayItem);
ItemForm.addEventListener("submit", addLi);
mainUl.addEventListener("click", onClick);
clearAll.addEventListener("click", clearFunction);
formFilter.addEventListener("input", filterFunction);

checkUI();

function displayItem() {
  let itemFromStorage = getItemStorage();
  itemFromStorage.forEach(function (item) {
    let newLi = createLi(item.value, item.completed);
    addIcon(newLi);
  });
  checkUI();
  percentOfCompeletedTask();
}

function addLi(e) {
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
    removeItem(itemToEdit);
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
  let newLi = createLi(itemValue);

  addIcon(newLi);

  listInput.value = "";

  addToStorage(itemValue);

  checkUI();
}

function checkRepetitiousItem(searchableValue) {
  let itemsFromStorage = getItemStorage();
  let flag = false;
  itemsFromStorage.forEach(function (item) {
    let result = item.value.includes(searchableValue);
    if (result) {
      flag= true;
    }
  });
  return flag;
}

function createLi(itemValue, completed = false) {
  let newLi = document.createElement("li");
  newLi.className =
    "items list-group-item  d-flex justify-content-between  align-items-center ";
  mainUl.appendChild(newLi);

  let textDiv = document.createElement("div");
  newLi.appendChild(textDiv);
  textDiv.innerText = itemValue;
  textDiv.className = "hoverMode";
  if (completed) {
    textDiv.classList.add("line-on-text");
  }
  return newLi;
}

function addIcon(newLi) {
  let iconX = document.createElement("i");
  iconX.className = "icon-item bi bi-x ";

  let iconCheck = document.createElement("i");
  iconCheck.className = "bi bi-check";

  let iconDiv = document.createElement("div");
  newLi.appendChild(iconDiv);

  iconDiv.appendChild(iconX);
  iconDiv.appendChild(iconCheck);
}

function onClick(e) {
  let selectedLi = e.target;
  if (selectedLi.classList.contains("bi-x")) {
    removeItem(selectedLi.parentElement.parentElement);
    percentOfCompeletedTask();
  } else if (selectedLi.classList.contains("bi-check")) {
    completeTask(selectedLi.parentElement.parentElement.firstChild);
  } else {
    editItem(selectedLi.parentElement);
  }
}

function completeTask(textDiv) {
  textDiv.classList.toggle("line-on-text");
  percentOfCompeletedTask();

  let text = textDiv.textContent;
  let items = getItemStorage();
  items.forEach(function (item) {
    if (text === item.value) {
      let completed = false;
      if (textDiv.classList.contains("line-on-text")) {
        completed = true;
      }
      removeItemFromstorag(item.value);
      addToStorage(item.value, completed);
    }
  });
}

function percentOfCompeletedTask() {
  let totalTasks = mainUl.querySelectorAll("li").length;
  let completedes = mainUl.querySelectorAll("li .line-on-text").length;
  let percent = (completedes / totalTasks) * 100;
  let width = 0 + "%";
   percentText = 0+ "%";
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

function editItem(item) {
  isEditMode = true;
  mainUl
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-text"));
  listInput.value = item.textContent;
  item.classList.add("edit-text");
  editBtn.classList.replace("btn-secondary", "btn-primary");
  editBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update task";
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
      // change with replace
      item.classList.add("d-flex");
      item.classList.remove("d-none");
    } else {
      item.classList.add("d-none");
      item.classList.remove("d-flex");
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

var progress_bar = document.querySelectorAll(".myProgress");
function progress() {
  var checked_progress = document.querySelectorAll(".line-on-text");
  var length = checked_progress.length;
  progress_bar.forEach(function (index) {
    index.classList.remove("active");
  });

  for (i = 0; i < length; i++) {
    progress_bar[i].classList.add("active");
  }
}
