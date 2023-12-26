/*===============================Getting Html Elements via query selector================================*/
const addContactBtnEl = document.querySelector("#add-contact");
const modalEl = document.querySelector("#modal");
const modalClosebtn = document.querySelector("#modal-close-btn");
const formEl = document.forms.inputForm;
const contactList = document.querySelector("#contact-list");
const modalTitle = document.querySelector("#modal-title");
const saveBtn = document.querySelector("#save");
const updateBtn = document.querySelector("#update");
const deleteBtn = document.querySelector("#delete");
//getting form elements using destructuring
const {
  firstname,
  lastname,
  email,
  phone,
  streetAdr,
  city,
  district,
  state,
  label,
} = formEl.elements;

/*====================================getting local storage and assiging in array to perform operations =======================================*/

let contactDetailsArr;
if (localStorage.getItem("contactList") === null) {
  contactDetailsArr = [];
} else {
  contactDetailsArr = JSON.parse(localStorage.getItem("contactList"));
}

/*=============================handle event functions================================*/

//handle submit event
const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(formEl);
};

//handle form data event
const handleFormdata = (e) => {
  //   console.log("formdata fired");
  //   console.log(e);
  const formData = e.formData;
  let firstnamevalid = checkFirstName(),
    lastNameValid = checkLastName(),
    emailValid = checkEmailValid(),
    phoneNumValid = checkPhoneNum(),
    streetAdrvalid = checkStreetAdr(),
    cityValid = checkCity(),
    districtValid = checkDistrict(),
    stateValid = checkState(),
    labelValid = checkLabel();

  const isFormValid =
    firstnamevalid &&
    lastNameValid &&
    emailValid &&
    phoneNumValid &&
    streetAdrvalid &&
    cityValid &&
    districtValid &&
    stateValid &&
    labelValid;
  // console.log(validStatus);

  if (isFormValid) {
    formData.append("id", contactDetailsArr.length + 1);
    const getFormData = Object.fromEntries(formData);
    console.log(getFormData); //show in console
    transferDataToLocalstorage(getFormData);
    contactList.innerHTML = ""; //clear innerhtml  while add data
    passArrDataToDisplay();
    formEl.reset(); // reset forms value
    closeModal();
  }
};
/*=================================Event listners=====================================*/

document.addEventListener("DOMContentLoaded", passArrDataToDisplay);

formEl.addEventListener("submit", handleSubmit);

formEl.addEventListener("formdata", handleFormdata);

addContactBtnEl.addEventListener("click", openModal);

modalClosebtn.addEventListener("click", closeModal);

//click event to show data in contact list
contactList.addEventListener("click", (e) => {
  let target = e.target;
  //   console.log(target.parentElement);
  if (target.tagName === "TD") {
    let getid = target.parentElement.dataset.id;
    let availableData;
    contactDetailsArr.forEach((el) => {
      if (el.id == getid) {
        availableData = el;
      }
    });
    deleteBtn.setAttribute("data-id", getid);
    updateBtn.setAttribute("data-id", getid);
    displayFormWithSelectedContactData(availableData);
  }
});

//delete operation
deleteBtn.addEventListener("click", (e) => {
  let currentId = e.target.dataset.id;
  contactDetailsArr.forEach((el, index) => {
    if (el.id === currentId) {
      contactDetailsArr.splice(index, 1);
    }
  });
  //   contactDetailsArr = contactDetailsArr.filter(
  //     (element) => element.id !== currentId
  //   );
  setLocalStorage();
  contactList.innerHTML = "";
  passArrDataToDisplay();
  closeModal();
});
/*=====================================Utility functions=========================================*/

//set local storage with current datas
function transferDataToLocalstorage(data) {
  contactDetailsArr.push(data); //store in database
  setLocalStorage();
}
function setLocalStorage() {
  localStorage.setItem("contactList", JSON.stringify(contactDetailsArr));
}
//passing arr data to display contact details
function passArrDataToDisplay() {
  contactDetailsArr.forEach((el) => createTrUi(el));
}

//function to create table row with contact details and append in table body
function createTrUi(data) {
  const tableRow = document.createElement("tr");
  tableRow.classList.add("hover:bg-orange-400", "cursor-pointer");
  tableRow.setAttribute("data-id", data.id);
  console.log(data.id);
  tableRow.innerHTML = `
      
      <td class="py-4">${data.id}</td>
      <td class="font-semibold text-gray-700">${data.firstname}</td>
      <td class="text-center">${data.streetAdr}</td>
      <td>
        <span class="bg-slate-200 px-2 py-1 rounded text-gray-700"
          >${data.label}</span
        >
      </td>
      <td>${data.email}
      </td>
      <td>${data.phone}</td>
    `;
  contactList.appendChild(tableRow);
}

function openModal() {
  modalEl.classList.remove("hidden");
}

function closeModal() {
  modalEl.classList.add("hidden");
  saveBtn.classList.remove("hidden");
  updateBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  formEl.reset();
}

function displayFormWithSelectedContactData(dataobj) {
  openModal();

  firstname.value = dataobj.firstname;
  lastname.value = dataobj.lastname;
  email.value = dataobj.email;
  phone.value = dataobj.phone;
  streetAdr.value = dataobj.streetAdr;
  city.value = dataobj.city;
  district.value = dataobj.district;
  state.value = dataobj.state;
  label.value = dataobj.label;

  modalTitle.innerText = "Update or Delete Contact";

  saveBtn.classList.add("hidden");
  updateBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
}

/*=================================validation functions===================================*/

const isRequired = (value) => (value === "" ? false : true);
const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;
const isEmail = (email) => {
  const regx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regx.test(email);
};
const isAlphabets = (alphabets) => {
  const regx = /^[A-Za-z]+$/;
  return regx.test(alphabets);
};
const isMobileNum = (mobilenum) => {
  const regx = /^\d{10}$/;
  return regx.test(mobilenum);
};

function showErrorMsg(fieldName, message) {
  const SmallTag = fieldName.nextElementSibling;
  SmallTag.innerText = " ";
  SmallTag.innerText = message;
}

const checkFirstName = () => {
  let valid = false;
  const min = 3,
    max = 20;
  const firstName = firstname.value.trim();
  if (!isRequired(firstName)) {
    showErrorMsg(firstname, "FirstName cannot be blank");
  } else if (!isBetween(firstName.length, min, max)) {
    showErrorMsg(firstname, `enter between ${min} and ${max} characters.`);
  } else if (!isAlphabets(firstName)) {
    showErrorMsg(firstname, "enter only alphabets");
  } else {
    showErrorMsg(firstname, "");
    valid = true;
  }
  return valid;
};
const checkLastName = () => {
  let valid = false;

  const lastName = lastname.value.trim();
  if (!isRequired(lastName)) {
    showErrorMsg(lastname, "FirstName cannot be blank");
  } else if (!isAlphabets(lastName)) {
    showErrorMsg(lastname, "enter only alphabets");
  } else {
    showErrorMsg(lastname, "");
    valid = true;
  }
  return valid;
};
const checkEmailValid = () => {
  let valid = false;

  const emailVal = email.value.trim();
  if (!isRequired(emailVal)) {
    showErrorMsg(email, "email cannot be blank");
  } else if (!isEmail(emailVal)) {
    showErrorMsg(email, "email is not valid");
  } else {
    showErrorMsg(email, "");
    valid = true;
  }
  return valid;
};

const checkPhoneNum = () => {
  let valid = false;

  const phoneNum = phone.value.trim();

  if (!isRequired(phoneNum)) {
    showErrorMsg(phone, "phone num cannot be blank");
  } else if (!isMobileNum(phoneNum)) {
    showErrorMsg(phone, "phone num is not valid");
  } else {
    showErrorMsg(phone, "");
    valid = true;
  }
  return valid;
};

const checkStreetAdr = () => {
  let valid = false;
  const min = 5,
    max = 30;
  const streetAddress = streetAdr.value.trim();

  if (!isRequired(streetAddress)) {
    showErrorMsg(streetAdr, "streetAdress cannot be blank");
  } else if (!isBetween(streetAddress.length, min, max)) {
    showErrorMsg(streetAdr, `enter between ${min} and ${max} characters.`);
  } else {
    showErrorMsg(streetAdr, "");
    valid = true;
  }
  return valid;
};
const checkCity = () => {
  let valid = false;

  const cityname = city.value.trim();

  if (!isRequired(cityname)) {
    showErrorMsg(city, "streetAdress cannot be blank");
  } else if (!isAlphabets(cityname)) {
    showErrorMsg(city, "enter only alphabets");
  } else {
    showErrorMsg(city, "");
    valid = true;
  }
  return valid;
};

const checkDistrict = () => {
  let valid = false;

  const districtName = district.value.trim();

  if (!isRequired(districtName)) {
    showErrorMsg(district, "pls select District");
  } else {
    showErrorMsg(district, "");
    valid = true;
  }
  return valid;
};
const checkState = () => {
  let valid = false;

  const stateName = state.value.trim();

  if (!isRequired(stateName)) {
    showErrorMsg(state, "pls select State");
  } else {
    showErrorMsg(state, "");
    valid = true;
  }
  return valid;
};

const checkLabel = () => {
  let valid = false;

  const labelName = label.value.trim();

  if (!isRequired(labelName)) {
    showErrorMsg(label, "pls select Label");
  } else {
    showErrorMsg(label, "");
    valid = true;
  }
  return valid;
};
/*=================================validation functions end===================================*/
