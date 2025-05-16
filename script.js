document.addEventListener("DOMContentLoaded", () => {
  // for accessing the input input fields

  const studentName = document.getElementById("username");
  const studentID = document.getElementById("student-id");
  const mobileNo = document.getElementById("mobile-no");
  const email = document.getElementById("email");

  //for input error display
  const inputError = document.getElementById("input-error");

  // for accessing submit button
  const submitButton = document.getElementById("submit-button");

  // for accessing the tbody of the table where rows will be appended
  const tableBody = document.getElementById("table-body");

  //for accessing empty record element
  const emptyRecord = document.getElementById("empty-record");

  // initializing the array for storing student data in local storage
  let studentDataArray = JSON.parse(localStorage.getItem("studentData")) || [];

  dataEntryFromLocal();

  // function for taking data from input fields and setting data in the table and localStorage
  function fetchStudentData() {
    if (
      studentName.value === "" ||
      studentID.value === "" ||
      mobileNo.value === "" ||
      email.value === ""
    ) {
      inputError.innerText = "All fields are mendatory";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");

      return;
    }

    //regex test for full name
    let fullNameRegex = /^[A-Za-z\s]+$/;
    if (!fullNameRegex.test(studentName.value.trim())) {
      inputError.innerText = "Invalid FullName";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    // regex test for student ID
    const idRegex = /^\d{5}$/;
    if (!idRegex.test(studentID.value)) {
      inputError.innerText = "Invalid Student ID (ID should be 5 digits)";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    // studentID test for existing id
    let idArray = studentDataArray.map((obj) => obj["student_id"]);
    if (idArray.includes(studentID.value)) {
      inputError.innerText = "Student ID already exists";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    // regex test for email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.value.trim())) {
      inputError.innerText = "Invalid Email Address";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    // email test for existing email address
    let emailArray = studentDataArray.map((obj) => obj["email"]);
    if (emailArray.includes(email.value.trim())) {
      inputError.innerText = "Email Address already registered";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    // regex test for mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNo.value)) {
      inputError.innerText = "Invalid Phone Number";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    // mobile number test for existing mobile number
    let mobileNoArray = studentDataArray.map((obj) => obj["mobile_no"]);
    if (mobileNoArray.includes(mobileNo.value)) {
      inputError.innerText = "Mobile Number is already registered";
      inputError.classList.add("visible");
      inputError.classList.remove("invisible");
      return;
    }

    inputError.innerText = "";
    if (inputError.classList.contains("visible")) {
      inputError.classList.add("invisble");
      inputError.classList.remove("visible");
    }

    let studentRecord = {
      student_name: studentName.value,
      student_id: studentID.value,
      mobile_no: mobileNo.value,
      email: email.value,
    };
    studentDataArray.push(studentRecord);
  }

  // function for intserting data object into local storage
  function dataEntryFromLocal() {
    localStorage.setItem("studentData", JSON.stringify(studentDataArray));
    tableBody.innerHTML = "";
    if (studentDataArray.length === 0) {
      if (emptyRecord.classList.contains("hidden")) {
        emptyRecord.classList.remove("hidden");
      }
    } else {
      if (!emptyRecord.classList.contains("hidden")) {
        emptyRecord.classList.add("hidden");
      }
      console.log(emptyRecord.classList.contains("hidden"));
      studentDataArray.forEach((element) => {
        writingInTable(element);
      });
    }
  }

  // Submit button event listener for submit student details
  submitButton.addEventListener("click", () => {
    fetchStudentData();
    dataEntryFromLocal();
    clearInputs();
  });

  // function for clearing out input field
  function clearInputs() {
    studentName.value = "";
    studentID.value = "";
    mobileNo.value = "";
    email.value = "";
  }

  // function for writing input data onto the table
  function writingInTable(obj) {
    let tr = document.createElement("tr");
    tr.setAttribute("id", obj["student_id"]);
    tr.innerHTML = `<th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
                  ${obj["student_id"]}
                </th>
                <td class="px-6 py-4">${obj["student_name"]}</td>
                <td class="px-6 py-4">${obj["email"]}</td>
                <td class="px-6 py-4">${obj["mobile_no"]}</td>
                <td class="px-6 py-4">
                  <button
                    class="button-style" id="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    class="button-style" id="delete-btn"
                  >
                    Delete
                  </button>
                  
                </td>`;

    tableBody.appendChild(tr);

    tr.addEventListener("click", (e) => {
      if (e.target.innerText.toLowerCase().trim() === "edit") {
        let parentId = e.target.closest("tr").id;

        let currentdata = studentDataArray.filter(
          (obj) => parentId === obj["student_id"]
        )[0];
        editDataEntry(currentdata);
        console.log("clicked");
        console.log(studentDataArray);

        studentDataArray = studentDataArray.filter(
          (obj) => obj["student_id"] !== parentId
        );
        console.log(studentDataArray);
        dataEntryFromLocal();
      }
    });
    tr.addEventListener("click", (e) => {
      if (e.target.innerText.toLowerCase().trim() === "delete") {
        console.log("clicked");
        let parentId = e.target.closest("tr").id;

        let currentdata = studentDataArray.filter(
          (obj) => parentId === obj["student_id"]
        )[0];
        deleteDataEntry(currentdata);
      }
    });
  }

  // function for editing data in the table
  function editDataEntry(currentdata) {
    studentName.value = currentdata["student_name"];
    studentID.value = currentdata["student_id"];
    email.value = currentdata["email"];
    mobileNo.value = currentdata["mobile_no"];
  }

  // function for deleting a entry in the record
  function deleteDataEntry(currentdata) {
    studentDataArray = studentDataArray.filter((data) => data !== currentdata);
    dataEntryFromLocal();
  }
});
