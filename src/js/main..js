const addContactBtnEl = document.querySelector("#add-contact");
const modalEl = document.querySelector("#modal");
const modalClosebtn = document.querySelector("#modal-close-btn");
const formEl = document.forms.inputForm;
const contactList = document.querySelector("#contact-list");
console.log(formEl);
console.log(modalClosebtn);

// console.log(addContactBtnEl, modalEl);

let datas = [];
console.log(datas.length);

const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(formEl);
  console.log(...formData);
  const getFormData = Object.fromEntries(formData);
  console.log(getFormData);
  transferToDatabase(getFormData);
  formEl.reset();
  closeModal();
};

const handleFormdata = (e) => {
  console.log("formdata fired");
  console.log(e);
  const formData = e.formData;

  formData.append("id", datas.length + 1);
};

function transferToDatabase(data) {
  datas.push(data);
  contactList.innerHTML = "";
  datas.forEach((dataobj) => showData(dataobj));
  console.log(datas);
}

function showData(data) {
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

formEl.addEventListener("submit", handleSubmit);
formEl.addEventListener("formdata", handleFormdata);

function openModal() {
  modalEl.classList.remove("hidden");
}
function closeModal() {
  modalEl.classList.add("hidden");
}

addContactBtnEl.addEventListener("click", openModal);
modalClosebtn.addEventListener("click", closeModal);
