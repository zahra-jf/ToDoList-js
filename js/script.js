const ItemForm = document.getElementById("Item-form");
const listInput = document.getElementById("list-input");
const textInvalid = document.getElementById("text-invalid");
const mainUl = document.getElementById("main-ul");
const clearAll = document.getElementById("clear-all");
const formFilter = document.getElementById("form-filter");
const editBtn = ItemForm.querySelector("button");


// evevts
document.addEventListener("DOMContentLoaded", displayItem);
ItemForm.addEventListener("submit", addLi);
mainUl.addEventListener("click", onClick);
clearAll.addEventListener("click", clearFunction);
formFilter.addEventListener("input", filterFunction);


checkUI();

function displayItem() {
  let itemFromStorage = [];
  if (localStorage.getItem("items") !== null) {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  itemFromStorage.forEach(function (item) {
    let newLi = createLi(item);
    addIcon(newLi);
  });
  checkUI();
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
  let newLi = createLi(itemValue);

  addIcon(newLi);

  listInput.value = "";

  addToStorage(itemValue);

  checkUI();
}

function createLi(itemValue) {
  let newLi = document.createElement("li");
  newLi.className =
    "items list-group-item list-group-item-secondary d-flex justify-content-between align-items-center";
  newLi.innerText = itemValue;

  // newLi.onclick = function () {
  //   editItem(this);
  // };
  mainUl.appendChild(newLi);
  return newLi;
}

function addIcon(newLi) {
  let iconX = document.createElement("i");
  iconX.className = "icon-item bi bi-x ";
  newLi.appendChild(iconX);
}

function onClick(e) {
  if (e.target.classList.contains("bi-x")) {
    removeItem(e.target.parentElement);
  } else {
    edieItem(e.target);
  } 
}

function removeItem(item) {
 item.remove();
 removeItemFromstorag(item.textContent);
 checkUI();  
}

function edieItem(item) {
   mainUl.querySelectorAll("li").forEach((item) => item.classList.remove("edie-text"));
   listInput.value =item.textContent;
   item.classList.add("edie-text");
   editBtn.classList.replace("btn-secondary", "btn-primary");
   editBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update Item"; 
}

function clearFunction() {
  mainUl.innerHTML = "";
  checkUI();
  localStorage.removeItem("items");
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

function addToStorage(item) {
  let itemFromStorage = [];
  if (localStorage.getItem("items") !== null) {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  itemFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function removeItemFromstorag(item) {
  let itemFromStorage = [];
  if (localStorage.getItem("items") !== null) {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  itemFromStorage = itemFromStorage.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}





// let addBtn = document.getElementById("addBtn");
// addBtn.addEventListener("click", addLi);

// function addLi() {
//   let addLi = document.createElement("li");
//   addLi.classList.add(
//     "items list-group-item list-group-item-secondary d-flex justify-content-between align-items-center"
//   );
//   addLi.innerText = inputValue;
//   let mainUl = document.getElementById("main-ul");
//   mainUl.appendChild(addLi);

//   if ((inputValue = "")) {
//     let textInvalid = document.getElementById("text-invalid");
//     textInvalid.innerText = "error";
//   }
// }
