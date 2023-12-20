//get html elements via query selectors
const addContactBtnEl = document.querySelector("#add-contact");
const modalEl = document.querySelector("#modal");
const modalClosebtn = document.querySelector("#modal-close-btn");
const formEl = document.forms.inputForm;
const contactList = document.querySelector("#contact-list");

let contactDetails;

//getting localstorage and assign values to variable and show ui based on data stored in local storage
function getContactDetails() {
  if (localStorage.getItem("contactList") == null) {
    contactDetails = [];
  } else {
    contactDetails = JSON.parse(localStorage.getItem("contactList"));
    contactDetails.forEach((dataobj) => showUi(dataobj));
  }
}

document.addEventListener("DOMContentLoaded", getContactDetails); // shows datas while on load

//handle submit event
const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(formEl);
  //   console.log(...formData);

  //   console.log(getFormData);
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
    formData.append("id", contactDetails.length + 1);
    const getFormData = Object.fromEntries(formData);
    transferToDatabase(getFormData);
    contactList.innerHTML = ""; //clear innerhtml  while add data
    getContactDetails();
    formEl.reset(); // reset forms value
    closeModal();
  }
};

formEl.addEventListener("submit", handleSubmit);
formEl.addEventListener("formdata", handleFormdata);

function transferToDatabase(data) {
  contactDetails.push(data); //store in database
  let database = localStorage.setItem(
    "contactList",
    JSON.stringify(contactDetails)
  );

  //getting datas from database
  //   console.log(contactDetails);
}

function showUi(data) {
  const tableRow = document.createElement("tr");
  tableRow.classList.add("hover:bg-orange-400", "cursor-pointer");
  tableRow.setAttribute("data-id", data.id);
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
}

addContactBtnEl.addEventListener("click", openModal);
modalClosebtn.addEventListener("click", closeModal);

// function validation(formData) {
//   let firstName = formData.get("firstname");
//   let lastName = formData.get("lastname");
//   let email = formData.get("email");
//   let phone = formData.get("phone");
//   let streetAdr = formData.get("streetAdr");
//   let city = formData.get("city");

//   //show errormsg
//   function showErrorMsg(fieldName, message) {
//     const errorFieldEl = formEl.elements[fieldName];
//     const errorMsgEl = document.createElement("small");
//     errorMsgEl.classList.add("errormsg");
//     errorMsgEl.innerText = message;

//     //existing error msg
//     const existingError = errorFieldEl.nextElementSibling;
//     if (existingError && existingError.className === "errormsg") {
//       existingError.replaceWith(errorFieldEl);
//     } else {
//       errorFieldEl.after(errorMsgEl);
//     }
//   }
//   // // showErrorMsg("firstname", "hello im error");
//   //clear error msg
//   document.querySelectorAll(".errormsg").forEach((el) => el.remove());

//   // check required
//   if (!firstName) {
//     showErrorMsg("firstname", "required");
//     return false;
//   }
//   if (!lastName) {
//     showErrorMsg("lastname", "required");
//     return false;
//   }
//   if (!email) {
//     showErrorMsg("email", "required");
//     return false;
//   }
//   if (!phone) {
//     showErrorMsg("phone", "required");
//     return false;
//   }
//   if (!streetAdr) {
//     showErrorMsg("streetAdr", "required");
//     return false;
//   }
//   if (!city) {
//     showErrorMsg("city", "required");
//     return false;
//   }
//   //other validation
//   const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
//   let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email
//   let phoneRegex = /^\d{10}$/; //phone number contain only 10 numbers

//   if (!strRegex.test(firstName)) {
//     showErrorMsg("firstname", "contains only alphabets");
//     return false;
//   }
//   if (!strRegex.test(lastName)) {
//     showErrorMsg("lastname", "contains only alphabets");
//     return false;
//   }
//   if (!emailRegex.test(email)) {
//     showErrorMsg("email", "check the email format");
//     return false;
//   }
//   if (!phoneRegex.test(phone)) {
//     showErrorMsg("phone", "phone number shoud have 10 digits");
//     return false;
//   }
//   if (!strRegex.test(city)) {
//     showErrorMsg("city", "contains only alphabets");
//     return false;
//   }
//   if (streetAdr.length < 5) {
//     showErrorMsg("streetAdr", "street address should have 5 characters");
//     return false;
//   }

//   return true;
// }

// function showErrorMsg(el, message) {
//   const errorMsgEl = document.createElement("small");
//   errorMsgEl.classList.add("errormsg");
//   errorMsgEl.innerText = message;

//   //existing error msg
//   const existingError = el.nextElementSibling;
//   if (existingError && existingError.className === "errormsg") {
//     existingError.replaceWith(errorMsgEl);
//   } else {
//     el.after(errorMsgEl);
//   }

//   // // showErrorMsg("firstname", "hello im error");
//   //clear error msg
//   // formEl.querySelectorAll(".errormsg").forEach((elements) => elements.remove());
// }

//new method

//utility fuctions => resuable function i
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

// function clearMsg(fieldName) {
//   fieldName.nextElementSibling.remove();
//   console.log(fieldName.name, "success");
// }

console.log(formEl.elements);
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
