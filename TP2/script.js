function toggleX(button) {
  // Si le bouton est vide, on met une coche (présent)
  if (button.textContent.trim() === "") {
    button.textContent = "✅";
  } else {
    // sinon on efface la coche (absent)
    button.textContent = "";
  }

  // À chaque clic, on met à jour le nombre d'absences
  updateAbsences();
}

function updateAbsences() {
  // On récupère toutes les lignes du tableau
  const rows = document.querySelectorAll("#attendanceTable tr");

  rows.forEach((row) => {
    // On récupère les boutons de la ligne
    const buttons = row.querySelectorAll(".attendance");
    const absenceCell = row.querySelector(".absence-count");

    if (buttons.length > 0 && absenceCell) {
      let absences = 0;

      // On compte combien de boutons sont vides = absents
      buttons.forEach((btn) => {
        if (btn.textContent.trim() === "") absences++;
      });

      // On affiche le résultat dans la colonne "Absences"
      absenceCell.textContent = absences + " Abs";
    }
  });
}


function updateParticipations() {
  const rows = document.querySelectorAll("#attendanceTable tr");
  rows.forEach((row) => {
    const partBtns = row.querySelectorAll(".participation");
    const partCell = row.querySelector(".participation-count");

    if (partBtns.length > 0 && partCell) {
      let participations = 0;
      partBtns.forEach((btn) => {
        // on utilise includes pour être tolérant aux espaces invisibles
        if (btn.textContent && btn.textContent.includes("✅")) participations++;
      });
      partCell.textContent = participations;
    }
  });
} 


 