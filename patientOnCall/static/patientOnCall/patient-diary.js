var base_url = window.location.origin;

(function() {  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const id = sessionStorage.getItem("patientID")
  const diary = JSON.parse(sessionStorage.getItem("patientDiary"))

  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

  insertDiaryEntries(diary);
})();

function insertDiaryEntries(diary) {
  let i = 0;
  for (entry of diary) {
    addDiaryEntry(
      i,
      entry["id"],
      entry["date"],
      entry["content"],
      entry["readByDoctor"],
      i == 0
    )
    i++;
  }
}

function addDiaryEntry(rowNum, id, date, content, readByDoctor, isLastRow) {
  var table = document.getElementById("main-patient-diary-box-table");

  let isReadByDoctorElem = document.createElement("div");
  isReadByDoctorElem.classList.add("read-by-doctor-indicator-col");
  isReadByDoctorElem.setAttribute("diary-id", id);
  isReadByDoctorElem.innerHTML = "*";
  if (readByDoctor) { isReadByDoctorElem.classList.add("invisible"); }

  let dateElem = document.createElement("div");
  dateElem.classList.add("info-table-item", "diary-date", "diary-info",`row-${rowNum}`);
  if (isLastRow) { dateElem.classList.add("last-row"); }
  if (!readByDoctor) { dateElem.classList.add("not-read-by-doctor-info"); }
  dateElem.setAttribute("id", `diary-date-${rowNum}`);
  dateElem.setAttribute("diary-id", id);
  dateElem.innerHTML = date;

  let contentElem = document.createElement("div");
  contentElem.classList.add("info-table-item", "diary-content", "diary-info", `row-${rowNum}`);
  if (isLastRow) { contentElem.classList.add("last-row"); }
  if (!readByDoctor) { contentElem.classList.add("not-read-by-doctor-info"); }
  contentElem.setAttribute("id", `diary-content-${rowNum}`);
  contentElem.setAttribute("diary-id", id);
  let contentTextElem = document.createElement("div");
  contentTextElem.classList.add("diary-content-text");
  contentTextElem.innerHTML = content;
  contentElem.appendChild(contentTextElem);

  let columnTitleElem = document.getElementById("info-table-content-title");

  table.insertBefore(contentElem, columnTitleElem.nextSibling);
  table.insertBefore(dateElem, columnTitleElem.nextSibling);
  table.insertBefore(isReadByDoctorElem, columnTitleElem.nextSibling);

  row_hover(rowNum);
  row_click_redirect(rowNum);
}

function row_hover(rowNum) {
  var rowClass = 'row-' + rowNum 
  var row = document.getElementsByClassName(rowClass);
  for(var i = 0; i <  row.length; i ++) {
      row[i].onmouseover = function() {
        for (var j = 0; j < row.length; j++) {
          row[j].classList.add("hovered-row");
        }
      };
      row[i].onmouseout = function() {
        for (var j = 0; j < row.length; j++) {
          row[j].classList.remove("hovered-row");
        }
      };   
  }
}

function row_click_redirect(rowNum) {
  var rowClass = 'row-' + rowNum 
  var row = document.getElementsByClassName(rowClass);
  if (row.length <= 0) { return; }
  for(var i = 0; i < row.length; i ++) {
      row[i].onclick = function(event) {
        let diaryId = event.target.getAttribute("diary-id");
        setDiaryEntryToRead(diaryId);
        window.location.href = base_url + "/patient-diary/entry?diaryId=" + diaryId;
      };
  }
}

function setDiaryEntryToRead(diaryId) {
  let diary = JSON.parse(sessionStorage.getItem("patientDiary"));
  var i = 0;
  for (entry of diary) {
    if (entry["id"] == diaryId) {
      entry["readByDoctor"] = true;
      diary[i] = entry;
      sessionStorage.setItem("patientDiary", JSON.stringify(diary));
      break;
    }
    i++;
  }
}

// function connect_to_websocket() {
//   websocket = create_websocket(
//     () => {
//       console.log('Connected to websocket.');
//     },
//     (response) => {
//       let data = JSON.parse(response.data);
//       let event = data["event"]

//       if (event == "NEW_DIARY_ENTRY") {
//         addDiaryEntryToSession(data["newDiaryData"]);
//         addDiaryEntry(
//           getNumOfExistingRows(),
//           data["newDiaryData"]["id"],
//           data["newDiaryData"]["date"],
//           data["newDiaryData"]["content"],
//           false,
//           false
//         )
//       }
//     }
//   )
// }

function getNumOfExistingRows() {
  return ($(".info-table-item").length / 2) - 1;
}

function addDiaryEntryToSession(diaryEntry) {
  let diary = JSON.parse(sessionStorage.getItem("patientDiary"));
  diary.push(diaryEntry);
  sessionStorage.setItem("patientDiary", JSON.stringify(diary));
}