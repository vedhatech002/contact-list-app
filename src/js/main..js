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
  if (validation(formData)) {
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

function validation(formData) {
  let firstName = formData.get("firstname");
  let lastName = formData.get("lastname");
  let email = formData.get("email");
  let phone = formData.get("phone");
  let streetAdr = formData.get("streetAdr");
  let city = formData.get("city");

  // console.log(firstName, lastName, email, phone, streetAdr, city);
  // let formDataKeys = [...formData.keys()];

  // console.log(formDataKeys);

  // function checkRequired() {
  //   let requiredValid = [];
  //   formDataKeys.forEach((el) => {
  //     let inputFields = document.forms.elements[el];
  //     if (inputFields.value === "") {
  //       showErrorMsg(inputFields, "required");
  //       requiredValid.push(false);
  //     }
  //   });
  //   return requiredValid.includes(false);
  // }

  // function showErrorMsg(fieldEl, message) {
  //   let inputFields = document.forms[fieldEl];
  //   console.log(inputFields.nextElementSibling);
  //   inputFields.nextElementSibling.innerText = message;
  // }
  // showErrorMsg("firstname", "required");

  //show errormsg
  function showErrorMsg(fieldName, message) {
    const errorFieldEl = formEl.elements[fieldName];
    const errorMsgEl = document.createElement("small");
    errorMsgEl.classList.add("errormsg");
    errorMsgEl.innerText = message;

    //existing error msg
    const existingError = errorFieldEl.nextElementSibling;
    if (existingError && existingError.className === "errormsg") {
      existingError.replaceWith(errorFieldEl);
    } else {
      errorFieldEl.after(errorMsgEl);
    }
  }
  // // showErrorMsg("firstname", "hello im error");
  //clear error msg
  document.querySelectorAll(".errormsg").forEach((el) => el.remove());

  // check required
  if (!firstName) {
    showErrorMsg("firstname", "required");
    return false;
  }
  if (!lastName) {
    showErrorMsg("lastname", "required");
    return false;
  }
  if (!email) {
    showErrorMsg("email", "required");
    return false;
  }
  if (!phone) {
    showErrorMsg("phone", "required");
    return false;
  }
  if (!streetAdr) {
    showErrorMsg("streetAdr", "required");
    return false;
  }
  if (!city) {
    showErrorMsg("city", "required");
    return false;
  }
  //other validation
  const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email
  let phoneRegex = /^\d{10}$/; //phone number contain only 10 numbers

  if (!strRegex.test(firstName)) {
    showErrorMsg("firstname", "contains only alphabets");
    return false;
  }
  if (!strRegex.test(lastName)) {
    showErrorMsg("lastname", "contains only alphabets");
    return false;
  }
  if (!emailRegex.test(email)) {
    showErrorMsg("email", "check the email format");
    return false;
  }
  if (!phoneRegex.test(phone)) {
    showErrorMsg("phone", "phone number shoud have 10 digits");
    return false;
  }
  if (!strRegex.test(city)) {
    showErrorMsg("city", "contains only alphabets");
    return false;
  }
  if (streetAdr.length < 5) {
    showErrorMsg("streetAdr", "street address should have 5 characters");
    return false;
  }

  return true;
}
