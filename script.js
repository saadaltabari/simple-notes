// Constants
const SavedNotesKey = "savedNotes";
// The HTML template that will be used for displaying notes

// Setup modal for adding/editing notes
var modal = document.getElementById("noteModal");
var noteIdInput = document.getElementById("noteIdInput");
var noteTitleInput = document.getElementById("noteTitleInput");
var noteDetailsInput = document.getElementById("noteDetailsInput");
var addNoteButton = document.getElementById("add-note");
var closeModalButton = document.getElementsByClassName("close")[0];

function openModal(note_id, note_title, note_desc) {
  noteIdInput.value = note_id || "";
  noteTitleInput.value = note_title || "";
  noteDetailsInput.value = note_desc || "";
  modal.style.display = "block";
}

function closeModal(){
  modal.style.display = "none";
  noteIdInput.value = "";
  noteTitleInput.value = "";
  noteDetailsInput.value = "";
}

// Show note modal when user clicks on the add-note icon
addNoteButton.onclick = function() {
  openModal();
};

// Close the noteModal when user clicks on (x)
closeModalButton.onclick = function() {
  closeModal();
};

// Close the noteModal when user clicks outside of the modal
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
};

function renderNote(note) {
  var truncText = function (txt) {
    if (txt.length >= 250){
      return txt.substr(0,247) + "...";
    }
    return txt;
  };
  return `<div class="note-item" onclick="openModal('${note.id}', '${note.title}', '${note.detail}')">
              <i class="fas fa-thumbtack pin"></i>
              <p class="noteTitle">${note.title}</p>
              <p class="noteDetail">${truncText(note.detail)}</p>
          </div>`
}

function pinNoteToBoard(note){
  document.getElementById("add-note").insertAdjacentHTML(
      "afterbegin",
      renderNote(note)
  );
}

function loadNotes() {
  var notes = JSON.parse(localStorage.getItem(SavedNotesKey) || "{}");
  for (var id in notes) {
    pinNoteToBoard(notes[id]);
  }

}

function saveNote() {
  var savedNotes = JSON.parse(localStorage.getItem(SavedNotesKey) || "{}");

  var noteObject = {
      title: noteTitleInput.value,
      detail: noteDetailsInput.value,
      id: noteIdInput.value
  };

  // Check if the user is creating a new Note
  if (!noteObject.id) {
    noteObject.id = "" + (Object.keys(savedNotes).length || 0);
    pinNoteToBoard(noteObject);
  } else {
    var noteIndexOnBoard = Object.keys(savedNotes).length - parseInt(noteObject.id) - 1;
    var noteCard = document.getElementsByClassName("note-item")[noteIndexOnBoard];
    noteCard.getElementsByClassName("noteTitle")[0].innerHTML = noteObject.title;
    noteCard.getElementsByClassName("noteDetail")[0].innerHTML = noteObject.detail;
  }
  // Save the note to storage
  savedNotes[noteObject.id] = noteObject;
  localStorage.setItem(SavedNotesKey, JSON.stringify(savedNotes));

  closeModal();
}

// Load previously saved notes
loadNotes();
