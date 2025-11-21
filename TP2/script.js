// --- Toggle présence / participation ---
function toggleX(button) {
  if (button.textContent.trim() === "") {
    button.textContent = "✅";
  } else {
    button.textContent = "";
  }

  updateAbsences();
  updateParticipations();
  updateRowStylesAndMessages();
  saveData();
}

// --- Compte les absences ---
function updateAbsences() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const buttons = row.querySelectorAll(".attendance");
    const absenceCell = row.querySelector(".absence-count");

    let absences = 0;
    buttons.forEach((btn) => {
      if (btn.textContent.trim() === "") absences++;
    });
    absenceCell.textContent = absences + " Abs";
  });
}

// --- Compte les participations ---
function updateParticipations() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const partBtns = row.querySelectorAll(".participation");
    const partCell = row.querySelector(".participation-count");

    let participations = 0;
    partBtns.forEach((btn) => {
      if (btn.textContent.trim() === "✅") participations++;
    });
    partCell.textContent = participations + " prt";
  });
}

// --- Couleur + message ---
function updateRowStylesAndMessages() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const abs = parseInt(row.querySelector(".absence-count").textContent);
    const prt = parseInt(row.querySelector(".participation-count").textContent);
    const msg = row.querySelector(".message");

    if (abs < 3) row.style.backgroundColor = "#b8f5b8";
    else if (abs >= 3 && abs <= 4) row.style.backgroundColor = "#fff3b0";
    else if (abs >= 5) row.style.backgroundColor = "#f5b8b8";

    if (abs < 3 && prt >= 4) msg.textContent = "Good attendance – Excellent participation";
    else if (abs >= 3 && abs <= 4) msg.textContent = "Warning – attendance low – You need to participate more";
    else if (abs >= 5) msg.textContent = "Excluded – too many absences – You need to participate more";
    else msg.textContent = "Good attendance – Try to participate more";
  });
}

// --- Sauvegarde ---
function saveData() {
  const data = [];
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const rowData = [];
    const buttons = row.querySelectorAll("button");
    buttons.forEach((btn) => rowData.push(btn.textContent.trim()));
    data.push(rowData);
  });

  localStorage.setItem("attendanceData", JSON.stringify(data));
}

// --- Chargement ---
function loadData() {
  const data = JSON.parse(localStorage.getItem("attendanceData"));
  if (!data) return;

  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row, rowIndex) => {
    const buttons = row.querySelectorAll("button");
    data[rowIndex]?.forEach((value, btnIndex) => {
      buttons[btnIndex].textContent = value;
    });
  });

  updateAbsences();
  updateParticipations();
  updateRowStylesAndMessages();
}

// --- Ajout étudiant ---
document.getElementById("addStudentForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  let hasError = false;

  const studentId = document.getElementById("studentId").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const email = document.getElementById("email").value.trim();

  ["studentIdError","lastNameError","firstNameError","emailError","formSuccess"]
    .forEach(id => document.getElementById(id).textContent = "");

  if(!studentId) { document.getElementById("studentIdError").textContent="Student ID is required."; hasError=true; }
  else if(!/^\d+$/.test(studentId)) { document.getElementById("studentIdError").textContent="Student ID must contain only numbers."; hasError=true; }

  if(!lastName) { document.getElementById("lastNameError").textContent="Last Name is required."; hasError=true; }
  else if(!/^[a-zA-Z ]+$/.test(lastName)) { document.getElementById("lastNameError").textContent="Last Name must contain only letters and spaces."; hasError=true; }

  if(!firstName) { document.getElementById("firstNameError").textContent="First Name is required."; hasError=true; }
  else if(!/^[a-zA-Z ]+$/.test(firstName)) { document.getElementById("firstNameError").textContent="First Name must contain only letters and spaces."; hasError=true; }

  if(!email) { document.getElementById("emailError").textContent="Email is required."; hasError=true; }
  else if(!/^\S+@\S+\.\S+$/.test(email)) { document.getElementById("emailError").textContent="Invalid email format."; hasError=true; }

  if(!hasError){
    const tbody = document.querySelector("#attendanceTable tbody");
    const newRow = document.createElement("tr");

    let buttonsHTML = "";
    for (let i = 0; i < 6; i++) {
      buttonsHTML += `<td><button class="attendance" onclick="toggleX(this)"></button></td>`;
      buttonsHTML += `<td><button class="participation" onclick="toggleX(this)"></button></td>`;
    }

    newRow.innerHTML = `
      <td>${lastName}</td>
      <td>${firstName}</td>
      ${buttonsHTML}
      <td class="absence-count">0 Abs</td>
      <td class="participation-count">0 prt</td>
      <td class="message"></td>
    `;

    tbody.appendChild(newRow);
    this.reset();       
    saveData();          
    updateAbsences();
    updateParticipations();
    updateRowStylesAndMessages();

    document.getElementById("formSuccess").textContent =
    `Student ${firstName} ${lastName} added successfully!`;
  }
});

// --- Validation dynamique ---
document.addEventListener("DOMContentLoaded", () => {
  loadData(); 

  const lastNameField = document.getElementById("lastName");
  const firstNameField = document.getElementById("firstName");
  const studentIdField = document.getElementById("studentId");

  const lastNameMsg = document.createElement("div");
  lastNameMsg.style.color = "red";
  lastNameField.parentNode.appendChild(lastNameMsg);

  const firstNameMsg = document.createElement("div");
  firstNameMsg.style.color = "red";
  firstNameField.parentNode.appendChild(firstNameMsg);

  const idMsg = document.createElement("div");
  idMsg.style.color = "red";
  studentIdField.parentNode.appendChild(idMsg);

  lastNameField.addEventListener("input", () => {
    if (/[^a-zA-Z ]/.test(lastNameField.value)) {
      lastNameMsg.textContent = "⚠ Vous ne pouvez pas écrire des chiffres.";
      lastNameField.value = lastNameField.value.replace(/[^a-zA-Z ]/g, "");
    } else {
      lastNameMsg.textContent = "";
    }
  });

  firstNameField.addEventListener("input", () => {
    if (/[^a-zA-Z ]/.test(firstNameField.value)) {
      firstNameMsg.textContent = "⚠ Vous ne pouvez pas écrire des chiffres.";
      firstNameField.value = firstNameField.value.replace(/[^a-zA-Z ]/g, "");
    } else {
      firstNameMsg.textContent = "";
    }
  });

  studentIdField.addEventListener("input", () => {
    if (/[^0-9]/.test(studentIdField.value)) {
      idMsg.textContent = "⚠ Vous ne pouvez pas écrire des lettres.";
      studentIdField.value = studentIdField.value.replace(/[^0-9]/g, "");
    } else {
      idMsg.textContent = "";
    }
  });
});

// -------------------------------------------
// 🔵 EXERCICE 5 : JQUERY
// -------------------------------------------

$(document).ready(function() {

  // survol : highlight
  $("#attendanceTable tbody").on("mouseenter", "tr", function() {
    $(this).css("background-color", "#d0e8ff");
  });

  // quitter : enlever highlight
  $("#attendanceTable tbody").on("mouseleave", "tr", function() {
    $(this).css("background-color", "");
    updateRowStylesAndMessages();
  });

  // clic : afficher nom + absences
  $("#attendanceTable tbody").on("click", "tr", function() {
    const lastName = $(this).find("td").eq(0).text();
    const firstName = $(this).find("td").eq(1).text();
    const absences = $(this).find(".absence-count").text();

    alert("Student: " + firstName + " " + lastName + "\n" + "Absences: " + absences);
  });

});


