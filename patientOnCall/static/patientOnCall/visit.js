var base_url = window.location.origin;

(function() {  
    const firstName = sessionStorage.getItem("patientFirstName")
    const lastName = sessionStorage.getItem("patientLastName")
    const id = sessionStorage.getItem("patientID")
    const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
    medicalHistory.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    
    document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
    document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

    console.log(medicalHistory);
    insertMedHistoryEntries(medicalHistory);
    for(var i = 1; i <= medicalHistory.length; i ++) {
        row_hover(i, medicalHistory[i-1]["visitType"]);
        row_click(i);
    }

})();

function insertMedHistoryEntries(medicalHistory) {
  var i = 0
  while (i < medicalHistory.length) {
      addMedHistoryEntry(i+1, 
       medicalHistory[i]["id"],
       medicalHistory[i]["admissionDate"],
       medicalHistory[i]["dischargeDate"],
       medicalHistory[i]["summary"],
       medicalHistory[i]["visitType"],
       medicalHistory[i]["letter"])
      i++;
  }
}
function addMedHistoryEntry(rowNum, id, admissionDate, dischargeDate, summary, visitType, letter) {
    // Create a new entry for the table
    const labHistory = JSON.parse(sessionStorage.getItem("labHistory"))
    const imagingHistory = JSON.parse(sessionStorage.getItem("imagingHistory"))
    var tableBody = document.getElementById("main-current-visit-box-table");
    var row = "row-" + rowNum
    console.log(row)

    const entryDate = document.createElement("div");
    entryDate.classList.add("info-table-item");
    entryDate.classList.add(row);
    if (admissionDate === dischargeDate) {
        console.log("same date")
        entryDate.textContent = admissionDate;
    } else {
        entryDate.textContent = admissionDate + "\n" + "-\n" + dischargeDate;
    }

    // const entryAdmissionDate = document.createElement("div");
    // entryAdmissionDate.classList.add("info-table-item");
    // entryAdmissionDate.classList.add(row);
    // entryAdmissionDate.textContent = admissionDate;

    // const entryDischargeDate = document.createElement("div");
    // entryDischargeDate.classList.add("info-table-item");
    // entryDischargeDate.classList.add(row);
    // entryDischargeDate.textContent = dischargeDate;

    const entrySummary = document.createElement("div");
    entrySummary.classList.add("info-table-item");
    entrySummary.classList.add(row);
    entrySummary.textContent = summary;

    // const entryConsultant = document.createElement("div");
    // entryConsultant.classList.add("info-table-item");
    // entryConsultant.textContent = consultant;

    const entryVisitType = document.createElement("div");
    entryVisitType.classList.add("info-table-item");
    entryVisitType.classList.add(row);
    entryVisitType.classList.add("visit-type");
    entryVisitType.textContent = visitType;
    if (visitType == "GP Consultation") {
        entryVisitType.style.backgroundColor = "#C55252";
    } else if (visitType== "Hospital Clinic"){
        entryVisitType.style.backgroundColor = "#6BC4EB";
    } else {
        entryVisitType.style.backgroundColor = "#FFDA29"
    }

    
    const entryConsultant = document.createElement("div");
    entryConsultant.classList.add("info-table-item");
    entryConsultant.classList.add(row);
    entryConsultant.textContent = "Dr John Lee"
    
    const entryLetterBox = document.createElement("div");
    entryLetterBox.classList.add("info-table-item");
    entryLetterBox.classList.add(row);

    const entryLetter = document.createElement("a");
    // entryLetter.classList.add("info-table-item");
    // entryLetter.classList.add(row);
    console.log(letter)
    if  (letter === "False" || letter === "/media/False") {
        console.log("NOOOOO")
    } else {
        entryLetter.href = base_url + letter;
        if (visitType == "GP Consultation") {
            entryLetter.textContent = "GP Letter";
        }
        else {
            entryLetter.textContent = "Discharge Letter";
        }
    } 
    entryLetterBox.appendChild(entryLetter)

    const entryLabAndImaging = document.createElement("div");
    entryLabAndImaging.classList.add("info-table-item");
    entryLabAndImaging.classList.add(row);
    entryLabAndImaging.classList.add("add-lab-button");

    for(var i = 0; i < labHistory.length; i ++) {
        if (labHistory[i]["visitEntry"] === id) {
            labEntry = document.createElement("a"); 
            labEntry.href = labHistory[i]["report"]
            labEntry.innerText = labHistory[i]["labType"] + '\n'
            entryLabAndImaging.appendChild(labEntry)
        }
    }
    for(var i = 0; i < imagingHistory.length; i ++) {
        if (imagingHistory[i]["visitEntry"] === id) {
            imagingEntry = document.createElement("a"); 
            imagingEntry.href = imagingHistory[i]["report"]
            imagingEntry.innerText = imagingHistory[i]["scanType"] + '(' + imagingHistory[i]["region"] + ')\n'
            entryLabAndImaging.appendChild(imagingEntry)
        }
    }

    tableBody.appendChild(entryDate);
    tableBody.appendChild(entrySummary);
    tableBody.appendChild(entryVisitType);
    tableBody.appendChild(entryConsultant);
    tableBody.appendChild(entryLetterBox);
    tableBody.appendChild(entryLabAndImaging);

}

function row_hover(rowNum, visitType){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    function changeColor(bgcolor, fontWeight){
        for(var i = 0; i < n; i++) {
            row[i].style.backgroundColor = bgcolor; 
            // row[i].style.fontWeight = fontWeight; 
        }
    }
    for(var i = 0; i < n; i ++) {
        row[i].onmouseover = function() {
            changeColor("#73C1D2", "bold");

        };
        row[i].onmouseout = function() {
            changeColor("", "normal");
            if (visitType== "GP Consultation"){
                row[2].style.backgroundColor = "#C55252";
            } else if (visitType== "Hospital Clinic"){
                row[2].style.backgroundColor = "#6BC4EB";
            } else {
                row[2].style.backgroundColor = "#FFDA29"
            }
        };   
    }
}

function row_click(rowNum){
    var rowClass = 'row-' + rowNum 
    var row = document.getElementsByClassName(rowClass);
    var n = row.length;
    for(var i = 0; i < n; i ++) {
        row[i].onclick = function() {
            window.location.href = base_url + "/edit-visit/" + rowNum
        };
    }
}

document.getElementById("add-visit").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/add-visit"
  })


document.getElementsByClassName("add-lab-button").onclick = function() {
    window.location.href = base_url + "/add-imaging"
};

// function connect_to_websocket() {
//     websocket = create_websocket(
//       () => {
//         console.log('Connected to websocket.');
//         console.log(isCreated);
//         if (isCreated) {
//             const id = sessionStorage.getItem("patientID")
//             const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
//             websocket.send(JSON.stringify({
//                 "event": "NEW_HOSP_VISIT_ENTRY",
//                 "patientId": id,
//                 "hospital_visit_history": medicalHistory,
//                 "doctor_update": true
//               }))
//         }
//       },
//       // Patient adds a new hospital visit entry
//       (response) => {
//         let data = JSON.parse(response.data);
//         let event = data["event"]
//         let newMh = data["new_visit_entry"]
    
  
//         if (event == "NEW_HOSP_VISIT_ENTRY") {
//           const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
//           console.log(medicalHistory)
//           sessionStorage.setItem("medicalHistory",JSON.stringify(data["hospital_visit_history"]))
//           addMedHistoryEntry(medicalHistory.length, newMh["admissionDate"], newMh["dischargeDate"],
//             newMh["summary"], newMh["visitType"], newMh["letter"])
//         }
//       }
//     )
//   }

