/* Constants */

// localstorage index
const savedNotesKey = "savedNotes";

// get HTML elements from DOM
const notesList = document.getElementById("noteList")
const modal = document.getElementById("noteModal");
const noteIdInput = document.getElementById("noteIdInput");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteDetailsInput = document.getElementById("noteDetailsInput");
const addNoteButton = document.getElementById("add-note");
const closeModalButton = document.getElementsByClassName("close")[0];


/****** Modal functions *******/
function openModal(noteId) {
  /*
    display the note create/edit modal and populate it with
    note information if the modal is used for editing.
  */
  var noteObject = JSON.parse(localStorage.getItem(savedNotesKey) || "{}")[noteId];
  if (noteObject) {
      noteIdInput.value = noteId;


      document.getElementsByClassName("color-option " + (noteObject.color))[0].checked = true;
      noteTitleInput.value = noteObject.title;
      noteDetailsInput.value = noteObject.detail;
  }
  modal.style.display = "block";
}

function closeModal(){
    /*
        close the note create/edit and resets input values
    */
    modal.style.display = "none";
    noteIdInput.value = "";
    noteTitleInput.value = "";
    noteDetailsInput.value = "";
}

function getNoteSelectedColor() {
    /*
        return the value of the selected note color
        from the modal
    */
    var colorElements = document.getElementsByName("color");
    for (var i = 0; i < colorElements.length ;i++) {
        radioBtn = colorElements[i];
        if (radioBtn.checked) {
            return radioBtn.value;
        }
    }
    return "yellow";
}
/***************************************/


/****** Note display functions *******/
function renderNote(note) {
    /*
        return a rendered HTML template for note items
        that are to be added to the note list
    */

    function truncText(txt) {
        if (txt.length >= 250){
          return txt.substr(0,247) + "...";
        }
        return txt;
    }
    return `<div id="${note.id}" class="note-item ${note.color}"
               onclick="openModal('${note.id}')"
                >
              <i class="fas fa-thumbtack pin"></i>
              <p class="noteTitle">${note.title}</p>
              <p class="noteDetail">${truncText(note.detail)}</p>
          </div>`
}

function pinNoteToBoard(note){
    /*
        renders a note and adds it to the DOM
    */
    notesList.insertAdjacentHTML(
      "afterbegin",
      renderNote(note)
    );
}
/***************************************/

/****** Note management actions *******/
function loadNotes() {
    /*
        Load previously saved notes from localstorage
    */
    var notes = JSON.parse(localStorage.getItem(savedNotesKey) || "{}");
    for (var id in notes) {
        pinNoteToBoard(notes[id]);
    }

}

function deleteNote(){
    /*
        Delete note from localstorage and remove note HTML element
        from DOM
    */
    var noteId = document.getElementById("noteIdInput").value

    var savedNotes = JSON.parse(localStorage.getItem(savedNotesKey) || "{}");
    delete savedNotes[noteId];
    localStorage.setItem(savedNotesKey, JSON.stringify(savedNotes));

    var noteCard = document.getElementById(noteId);
    notesList.removeChild(noteCard);

    closeModal();
}

function saveNote() {
    /*
        Create a new note or update existing note and save it to localstorage
    */

    // load saved notes
    var savedNotes = JSON.parse(localStorage.getItem(savedNotesKey) || "{}");

    var noteObject = {
        id: noteIdInput.value,
        color: getNoteSelectedColor(),
        title: noteTitleInput.value,
        detail: noteDetailsInput.value
    };

    // Check if the user is creating a new Note
    if (!noteObject.id) {
        noteObject.id = "note-" + (Object.keys(savedNotes).length || 0);
        pinNoteToBoard(noteObject);
    } else {
        var noteCard = document.getElementById(noteObject.id);
        noteCard.getElementsByClassName("noteTitle")[0].innerHTML = noteObject.title;
        noteCard.getElementsByClassName("noteDetail")[0].innerHTML = noteObject.detail;
        noteCard.className = "note-item " + noteObject.color;
    }
    // Save the note to storage
    savedNotes[noteObject.id] = noteObject;
    localStorage.setItem(savedNotesKey, JSON.stringify(savedNotes));

    closeModal();
}
/***************************************/

/****** Add listeners on elements *******/
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
/***************************************/

// Load previously saved notes
loadNotes();
