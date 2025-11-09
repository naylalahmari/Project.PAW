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
  saveData(); // ✅ Sauvegarde après chaque clic
}

// --- Compte les absences ---
function updateAbsences() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const buttons = row.querySelectorAll(".attendance");
    const absenceCell = row.querySelector(".absence-count");

    if (buttons.length > 0 && absenceCell) {
      let absences = 0;
      buttons.forEach((btn) => {
        if (btn.textContent.trim() === "") absences++;
      });
      absenceCell.textContent = absences + " Abs";
    }
  });
}

// --- Compte les participations ---
function updateParticipations() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const partBtns = row.querySelectorAll(".participation");
    const partCell = row.querySelector(".participation-count");

    if (partBtns.length > 0 && partCell) {
      let participations = 0;
      partBtns.forEach((btn) => {
        if (btn.textContent.trim() === "✅") participations++;
      });
      partCell.textContent = participations + " prt";
    }
  });
}

// --- Étape 3 & 4 : couleur ligne et message ---
function updateRowStylesAndMessages() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach((row) => {
    const absenceCell = row.querySelector(".absence-count");
    const partCell = row.querySelector(".participation-count");
    const messageCell = row.querySelector("td:last-child");

    if (absenceCell && partCell && messageCell) {
      const absences = parseInt(absenceCell.textContent);
      const participations = parseInt(partCell.textContent);

      // Couleur selon absences
      if (absences < 3) row.style.backgroundColor = "#b8f5b8"; // vert clair
      else if (absences >= 3 && absences <= 4) row.style.backgroundColor = "#fff3b0"; // jaune clair
      else if (absences >= 5) row.style.backgroundColor = "#f5b8b8"; // rouge clair

      // Message
      let message = "";
      if (absences < 3 && participations >= 4) message = "Good attendance – Excellent participation";
      else if (absences >= 3 && absences <= 4) message = "Warning – attendance low – You need to participate more";
      else if (absences >= 5) message = "Excluded – too many absences – You need to participate more";
      else message = "Good attendance – Try to participate more";

      messageCell.textContent = message;
    }
  });
}

// --- Sauvegarde dans le localStorage ---
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

// --- Recharge les données après refresh ---
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

// --- Validation et ajout du formulaire étudiant ---
document.getElementById("addStudentForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  let hasError = false;

  const studentId = document.getElementById("studentId").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const email = document.getElementById("email").value.trim();

  // Reset erreurs
  ["studentIdError","lastNameError","firstNameError","emailError","formSuccess"].forEach(id => {
    document.getElementById(id).textContent="";
  });

  // Validation
  if(!studentId) { document.getElementById("studentIdError").textContent="Student ID is required."; hasError=true; }
  else if(!/^\d+$/.test(studentId)) { document.getElementById("studentIdError").textContent="Student ID must contain only numbers."; hasError=true; }

  if(!lastName) { document.getElementById("lastNameError").textContent="Last Name is required."; hasError=true; }
  else if(!/^[a-zA-Z]+$/.test(lastName)) { document.getElementById("lastNameError").textContent="Last Name must contain only letters."; hasError=true; }

  if(!firstName) { document.getElementById("firstNameError").textContent="First Name is required."; hasError=true; }
  else if(!/^[a-zA-Z]+$/.test(firstName)) { document.getElementById("firstNameError").textContent="First Name must contain only letters."; hasError=true; }

  if(!email) { document.getElementById("emailError").textContent="Email is required."; hasError=true; }
  else if(!/^\S+@\S+\.\S+$/.test(email)) { document.getElementById("emailError").textContent="Invalid email format."; hasError=true; }

  // Ajouter étudiant si pas d'erreur
  if(!hasError){
    const tbody = document.querySelector("#attendanceTable tbody");
    const newRow = document.createElement("tr");

    // 6 séances × 2 boutons (attendance / participation)
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
    this.reset();       // vide le formulaire
    saveData();          // sauvegarde
    updateAbsences();
    updateParticipations();
    updateRowStylesAndMessages();

    // --- Afficher message de confirmation ---
    document.getElementById("formSuccess").textContent = `Student ${firstName} ${lastName} added successfully!`;
  }
});

// --- Initialisation au chargement ---
document.addEventListener("DOMContentLoaded", () => {
  loadData(); // recharge les données sauvegardées

  // --- Empêcher la frappe incorrecte dans les champs du formulaire + messages ---
  const lastNameField = document.getElementById("lastName");
  const firstNameField = document.getElementById("firstName");
  const studentIdField = document.getElementById("studentId");

  // Crée des div pour les messages d'alerte
  const lastNameMsg = document.createElement("div");
  lastNameMsg.style.color = "red";
  lastNameField.parentNode.appendChild(lastNameMsg);

  const firstNameMsg = document.createElement("div");
  firstNameMsg.style.color = "red";
  firstNameField.parentNode.appendChild(firstNameMsg);

  const idMsg = document.createElement("div");
  idMsg.style.color = "red";
  studentIdField.parentNode.appendChild(idMsg);

  // Validation à la frappe
  lastNameField.addEventListener("input", () => {
    if (/[^a-zA-Z]/.test(lastNameField.value)) {
      lastNameMsg.textContent = "⚠ Vous ne pouvez pas écrire des chiffres.";
      lastNameField.value = lastNameField.value.replace(/[^a-zA-Z]/g, "");
    } else {
      lastNameMsg.textContent = "";
    }
  });

  firstNameField.addEventListener("input", () => {
    if (/[^a-zA-Z]/.test(firstNameField.value)) {
      firstNameMsg.textContent = "⚠ Vous ne pouvez pas écrire des chiffres.";
      firstNameField.value = firstNameField.value.replace(/[^a-zA-Z]/g, "");
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
