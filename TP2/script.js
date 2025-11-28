// NAVIGATION ENTRE SECTIONS
function showSection(sectionId) { /*fonction qui affiche une section et cache les autres */
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none"); /*sélectionne toutes les balises section et les cache toutes */
  document.getElementById(sectionId).style.display = "block"; /*affiche seulement la section demandée */
}



// --- Toggle présence / participation ---
function toggleX(button) { /*quand on clique sur un bouton il met ✓ SINON il l’enlève */
  if (button.textContent.trim() === "") { /*bouton vide = mettre “✓”Sinon → effacer */
    button.textContent = "✅";
  } else {
    button.textContent = "";
  }
  /*il met à jour */
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
      if (btn.textContent.trim() === "") absences++;/*compte les boutons vides =absences*/
    });
    absenceCell.textContent = absences + " Abs";
  });
}

// --- Compte les participations ---
function updateParticipations() {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");/*selectionne tout les lignes du tableau*/

  rows.forEach((row) => {
    const partBtns = row.querySelectorAll(".participation");/*selectionne tout les boutons de participation*/
    const partCell = row.querySelector(".participation-count");/*selectionne la cellule de particpationµ*/

    let participations = 0;
    partBtns.forEach((btn) => { /* conntrole chaque bouton de participation*/
      if (btn.textContent.trim() === "✅") participations++;/*compte les ✓ */
    });
    partCell.textContent = participations + " prt"; /*mettre a jour le texte de la cellule*/
  });
}

// --- Couleur + message ---
function updateRowStylesAndMessages() { /*met a jour la couleur et le message de chaque ligne*/
  const rows = document.querySelectorAll("#attendanceTable tbody tr");/*selectionne toutes les lignes du tableau*/

  rows.forEach((row) => { 
    const abs = parseInt(row.querySelector(".absence-count").textContent);/*recupere le nombre d'absences*/
    const prt = parseInt(row.querySelector(".participation-count").textContent);/*recupere le nombre de particpation*/
    const msg = row.querySelector(".message"); /*recupere la cellule de message*/

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
function loadData() { /*Charge les données*/
  const data = JSON.parse(localStorage.getItem("attendanceData"));/*Remet les ✓*/
  if (!data) return; /*Met à jour absences/participations/couleurs*/

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
document.getElementById("addStudentForm")?.addEventListener("submit", function(e) {/*quand on envoie le formulaire*/
  e.preventDefault();/*empeche le chargement de la page*/
  let hasError = false;/*variable pour suivre les erreurs de validation*/

  const studentId = document.getElementById("studentId").value.trim();/*recupere les valeurs des champs*/
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
    const tbody = document.querySelector("#attendanceTable tbody");/*selectionne le corps du tableu*/
    const newRow = document.createElement("tr");/*creer une nouvelle ligne*/

    let buttonsHTML = "";
    for (let i = 0; i < 6; i++) {
      buttonsHTML += `<td><button class="attendance" onclick="toggleX(this)"></button></td>`;/*ajpute 6 boutons de presence*/
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
document.addEventListener("DOMContentLoaded", () => { /*quand le contenu de la page est chargé*/
  loadData(); /*charge les données sauvegardées*/

  const lastNameField = document.getElementById("lastName");/*selectionne le champ nom*/
  const firstNameField = document.getElementById("firstName");/*selectionne le champ prenom*/
  const studentIdField = document.getElementById("studentId");/*selectionne le champ id etudiant*/

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

// --------EXERCICE 4 : SHOW REPORT + CHART------

document.getElementById("showReportBtn").addEventListener("click", function() { 

  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  let total = rows.length;/*nombre total d'etudiants*/
  let presentCount = 0;
  let participatedCount = 0;

  rows.forEach(row => {
    const attendanceButtons = row.querySelectorAll(".attendance");
    const participationButtons = row.querySelectorAll(".participation");

    // Student present = at least one ✓ in attendance
    let isPresent = false;
    attendanceButtons.forEach(btn => { if (btn.textContent.trim() === "✅") isPresent = true; });
    if (isPresent) presentCount++;

    // Student participated = at least one ✓ in participation
    let hasParticipated = false;
    participationButtons.forEach(btn => { if (btn.textContent.trim() === "✅") hasParticipated = true; });
    if (hasParticipated) participatedCount++;
  });

  // Display report
  document.getElementById("reportSection").style.display = "block"; /*affiche la section rapport*/
  document.getElementById("totalStudents").textContent = "Total number of students: " + total;/*met a jour le texte*/
  document.getElementById("studentsPresent").textContent = "Students marked present: " + presentCount;
  document.getElementById("studentsParticipated").textContent = "Students who participated: " + participatedCount;

  // Chart.js
  const ctx = document.getElementById('reportChart').getContext('2d');

  if (window.myChart) window.myChart.destroy(); // avoid duplicate charts

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total', 'Present', 'Participated'],
      datasets: [{
        label: 'Attendance Report',
        data: [total, presentCount, participatedCount],
        backgroundColor: ['#7699ff','#6cd66c','#ffb366']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

});



// -------------EXERCICE 5 : JQUERY-------------

$(document).ready(function() { 

  // survol : highlight
  $("#attendanceTable tbody").on("mouseenter", "tr", function() { /*quand la souris entre dans une ligne*/
    $(this).css("background-color", "#d0e8ff"); /*change la couleur de fond*/
  });

  // quitter : enlever highlight
  $("#attendanceTable tbody").on("mouseleave", "tr", function() {/*quand la souris quitte une ligne*/
    $(this).css("background-color", "");/*remet la couleur d'origine*/
    updateRowStylesAndMessages();/*met a jour les couleurs selon les regles*/
  });

  // clic : afficher nom + absences
  $("#attendanceTable tbody").on("click", "tr", function() {/*quand on clique sur une ligne*/
    const lastName = $(this).find("td").eq(0).text();/*recupere le nom*/
    const firstName = $(this).find("td").eq(1).text();/*recupere le nom et le prenom*/
    const absences = $(this).find(".absence-count").text();/*recupere le nombre d'absences*/

    alert("Student: " + firstName + " " + lastName + "\n" + "Absences: " + absences);/*affiche une alerte avec les infos*/
  });

});


// ============== Exo6=================


// Excellent student = (absences < 3) AND (participations >= 4)
document.getElementById("highlightExcellentBtn").addEventListener("click", () => {
  const rows = document.querySelectorAll("#attendanceTable tbody tr");

  rows.forEach(row => {/*parcourt chaque ligne*/
    const abs = parseInt(row.querySelector(".absence-count").textContent);/*recupere le nombre d'absences*/
    const prt = parseInt(row.querySelector(".participation-count").textContent);/*recupere le nombre de partcipations*/

    if (abs < 3 && prt >= 4) {/*conditions pour etre un etu excellent*/
      row.classList.add("highlight-excellent");/*ajoute la classe pour changer la couleurs*/
    }
  });
});



// --------------- Reset Colors-----------------
document.getElementById("resetColorsBtn").addEventListener("click", () => {
  const rows = document.querySelectorAll("#attendanceTable tbody tr")

  rows.forEach(row => {
    row.classList.remove("highlight-excellent");/*enleve la classe de couleur*/
  });
});
// ========Exo 7====================

$(document).ready(function() {

    
    // 1) SEARCH BY NAME
    
    $("#searchInput").on("keyup", function () {/*quand on tape dans le champ de recherche*/
        const value = $(this).val().toLowerCase();/*recupere la valeur en miniscule*/

        $("#attendanceTable tbody tr").filter(function () {/*parcourt chaque ligne du tab*/
            const lastName = $(this).find("td:first").text().toLowerCase();/*recupere le nom en miniscule*/
            const firstName = $(this).find("td:nth-child(2)").text().toLowerCase();/*recupere le prenom en miniscule*/

            $(this).toggle(/*affiche ou cache la ligne selon la condition*/
                lastName.includes(value) || firstName.includes(value)/*condition de recherche*/
            );
        });
    });

    
    // 2) SORT BY ABSENCES ASCENDING
    
    $("#sortAbsAscBtn").on("click", function () { /*quand on clique sur le bouttons de tri*/
        const rows = $("#attendanceTable tbody tr").get();/*recupere touts les lignes du tableau*/

        rows.sort(function (a, b) {/*fonction du tri*/
            const absA = parseInt($(a).find(".absence-count").text());/*recupere la ligne d'absence de la ligne a*/
            const absB = parseInt($(b).find(".absence-count").text());/*recupere la ligne d'absence de la ligne b*/
            return absA - absB; // Ascending
        });

        $.each(rows, function (index, row) {/*parcourt chaque ligne triée*/
            $("#attendanceTable tbody").append(row);/*remet les lignes dans le tab dans l'odre trié*/
        });

        $("#sortMessage").text("Currently sorted by absences (ascending).");/*met a jour le message de tri*/
    });

    
    // 3) SORT BY PARTICIPATION DESCENDING
   
    $("#sortPrtDescBtn").on("click", function () {/*quand on clique sur le bouttons de tri*/
        const rows = $("#attendanceTable tbody tr").get();/*recupere touts les lignes du tableau*/

        rows.sort(function (a, b) {/*fonction du tri*/
            const prtA = parseInt($(a).find(".participation-count").text());/*recupere la ligne d'absence de la ligne a*/
            const prtB = parseInt($(b).find(".participation-count").text());/*recupere la ligne d'absence de la ligne b*/
            return prtB - prtA; // Descending
        });

        $.each(rows, function (index, row) {/*parcourt chaque ligne triée*/
            $("#attendanceTable tbody").append(row);/*remet les lignes dans le tab dans l'odre trié*/
        });

        $("#sortMessage").text("Currently sorted by participation (descending).");/*met a jour le message de tri*/
    });

});
 

