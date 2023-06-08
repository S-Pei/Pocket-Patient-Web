var base_url = window.location.origin;
(function() {
  
  const firstName = sessionStorage.getItem("patientFirstName")
  const lastName = sessionStorage.getItem("patientLastName")
  const id = sessionStorage.getItem("patientID")
  const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))

  document.getElementById("patient-name").innerHTML = firstName + ' ' + lastName
  document.getElementById("patient-id").innerHTML = 'NHS Number:' + id

  reconnectWebsocket();

  enterVisitEntry();

})();

// function connect_and_send_websocket() { 
//   let websocket = sessionStorage.getItem("websocket");
//   console.log(websocket);
//   if (websocket != null) { 
//     websocket.connect();
//     console.log("connecting websocket");
//   }
// }

function enterVisitEntry() {
  document.getElementById("add-visit").addEventListener("click", (e) => {
      e.preventDefault();
      
      let admissionDate = document.getElementById("entry-admission-date").value;
      let dischargeDate = document.getElementById("entry-discharge-date").value;
      let summary = document.getElementById("entry-summary").value;
      let consultant = document.getElementById("entry-consultant").value;
      let visitType = document.getElementById("entry-visit-type").value;
      let letter = document.getElementById("entry-letter").value;
  
      const firstName = sessionStorage.getItem("patientFirstName")
      const lastName = sessionStorage.getItem("patientLastName")
    
      //compare to database
      $.ajax({
        type: "POST",
        url: base_url + "/api/doctor/patient-data/medical-history/",
        data: {
          'patientID': sessionStorage.getItem("patientID"),
          'patientName': firstName + ' ' + lastName,
          'entryAdmissionDate': admissionDate,
          'entryDischargeDate': dischargeDate,
          'entrySummary': summary,
          'entryConsultant': consultant,
          'entryVisitType': visitType,
          'entryLetter': letter
        },
        success: function (returned_value) {
          if (returned_value.ok == true) { 
            //addMedHistoryEntry(admissionDate, dischargeDate, summary, consultant, visitType)
            sessionStorage.setItem("medicalHistory", JSON.stringify(returned_value["medical-history"]))
            window.location.replace('/visit')
          }
        },
        error: function () { }
      });
    })
}