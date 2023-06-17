var base_url = window.location.origin;

document.getElementById("profile").onclick = function() {
  window.location.href = base_url + "/main"  
}

document.getElementById("patient-summary").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = base_url + "/main"  
})

document.getElementById("medication").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/medication"
  })

document.getElementById("visit-history").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/visit"
  })

document.getElementById("lab-history").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = base_url + "/lab-history"
})

document.getElementById("imaging-history").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = base_url + "/imaging"
  })

document.getElementById("patient-diary").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = base_url + "/patient-diary-categories"
})



if (sessionStorage.getItem("displayDisclaimer") != null && sessionStorage.getItem("displayDisclaimer") == "true") {
  $("#disclaimer-note").removeClass("invisible");
} else {
  $("#disclaimer-note").addClass("invisible");
}
var websocket = null;

function connect_to_websocket() {
  websocket = create_websocket(
    () => {
      console.log('Connected to websocket.');
      if (window.location.href == base_url + "/visit/") {
        console.log(isCreated);
        if (isCreated) {
            const id = sessionStorage.getItem("patientID")
            const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
            websocket.send(JSON.stringify({
                "event": "NEW_HOSP_VISIT_ENTRY",
                "patientId": id,
                "hospital_visit_history": medicalHistory,
                "doctor_update": true
              }))
        }
      }
    },
    (response) => {
      let data = JSON.parse(response.data);
      let event = data["event"]
      console.log("Has response from websocket.")
      if (event == "REVOKE_PATIENT_DATA_ACCESS") {
        console.log("NOO I GOT KICKED");
        sessionStorage.clear();
        window.location.href = base_url;
      } else if (event == "NEW_MEDICATION_ENTRY") {
        let newMedicationData = data["newMedicationData"]
        let updatedCurrMedication = JSON.parse(data["currentMedication"])
        sessionStorage.setItem("currentMedication", JSON.stringify(updatedCurrMedication))

        if (window.location.href == base_url + "/medication/") {
          console.log("In medication page")
          let nextMedId = getNextMedicationId(newMedicationData["id"], updatedCurrMedication);
          if (nextMedId == null) {
            addMedication(
              true,
              newMedicationData["id"],
              newMedicationData["drug"],
              newMedicationData["dosage"],
              newMedicationData["startDate"],
              newMedicationData["endDate"],
              newMedicationData["duration"],
              newMedicationData["route"],
              newMedicationData["comments"],
              newMedicationData["byPatient"]
            )
          } else {
            insertNewMedBeforeMedWithId(
              nextMedId, 
              true,
              newMedicationData["id"],
              newMedicationData["drug"],
              newMedicationData["dosage"],
              newMedicationData["startDate"],
              newMedicationData["endDate"],
              newMedicationData["duration"],
              newMedicationData["route"],
              newMedicationData["comments"],
              newMedicationData["byPatient"]
            );
          }
        }
      } else if (event == "EDIT_MEDICATION_ENTRY") {
        let newMedicationData = data["updatedMedicationData"]
        let updatedCurrMedication = JSON.parse(data["currentMedication"])
        sessionStorage.setItem("currentMedication", JSON.stringify(updatedCurrMedication))

        if (window.location.href == base_url + "/medication/") {
          console.log("In medication page")
          udpateMedicationDetails(newMedicationData);
          // let nextMedId = getNextMedicationId(newMedicationData["id"], updatedCurrMedication);
          // if (nextMedId == null) {
          //   addMedication(
          //     true,
          //     newMedicationData["id"],
          //     newMedicationData["drug"],
          //     newMedicationData["dosage"],
          //     newMedicationData["startDate"],
          //     newMedicationData["endDate"],
          //     newMedicationData["duration"],
          //     newMedicationData["route"],
          //     newMedicationData["comments"],
          //     newMedicationData["byPatient"]
          //   )
          // } else {
          //   insertNewMedBeforeMedWithId(
          //     nextMedId, 
          //     true,
          //     newMedicationData["id"],
          //     newMedicationData["drug"],
          //     newMedicationData["dosage"],
          //     newMedicationData["startDate"],
          //     newMedicationData["endDate"],
          //     newMedicationData["duration"],
          //     newMedicationData["route"],
          //     newMedicationData["comments"],
          //     newMedicationData["byPatient"]
          //   );
          // }
        }
      } else if (event == "REMOVE_MEDICATION_ENTRY") {
        if (window.location.href == base_url + "/medication/") {
          let removedID = data["removedID"];
          document.getElementById(removedID + '-drug').remove();
          document.getElementById(removedID + '-dosage').remove();
          document.getElementById(removedID + '-start-date').remove();
          document.getElementById(removedID + '-end-date').remove();
          document.getElementById(removedID + '-duration').remove();
          document.getElementById(removedID + '-route').remove();
          document.getElementById(removedID + '-comments').remove();
          document.getElementById(removedID + '-owner').remove();
        }
      } else if (event == "CHANGE-IN-MEDICATION") {
        if (window.location.href == base_url + "/edit-medication/") {
          console.log("Change in medication has been sent successfully");
          window.location.href = "/medication"
        }
      } else if (event == "NEW_HOSP_VISIT_ENTRY") {
          let newMh = data["new_visit_entry"]
          const medicalHistory = JSON.parse(sessionStorage.getItem("medicalHistory"))
          console.log(medicalHistory)
          sessionStorage.setItem("medicalHistory",JSON.stringify(data["hospital_visit_history"]))
          if (window.location.href == base_url + "/visit/") {  
            addMedHistoryEntry(medicalHistory.length, newMh["admissionDate"], newMh["dischargeDate"],
              newMh["summary"], newMh["visitType"], newMh["letter"])
          }
      } else if (event == "NEW_DIARY_ENTRY") {
        console.log('NEW_DIARY_ENTRY');
        addDiaryEntryToSession(data["category"], data["newDiaryData"]);
        console.log(window.location.href == base_url + "/patient-diary/")
        console.log(getCategoryFromUrl())
        console.log(data["category"].replace(/ /g,'').toLowerCase())
        console.log(getCategoryFromUrl() === data["category"].replace(/ /g,'').toLowerCase())
        if (window.location.href == base_url + `/patient-diary/?category=${data["category"].replace(/ /g,'').toLowerCase()}`) {
          addDiaryEntry(
            getNumOfExistingRows(),
            data["newDiaryData"]["id"],
            data["newDiaryData"]["date"],
            data["newDiaryData"]["content"],
            false,
            false
          )
        }
      } else if (event == "NEW_DIARY_CLASS") {
        addDiaryCategoryToSession(data["category"]);
        if (window.location.href == base_url + "/patient-diary-categories/") {
          let categoryElement = createCategoryElement(data["category"]);
          categoryElement.addEventListener("click", () => {
            let categoryFormatted = data["category"].replace(/ /g,'').toLowerCase();
            window.location.href = base_url + `/patient-diary/?category=${categoryFormatted}`;
          })
          insertCategoryElement(categoryElement);
          checkIfMoreThanOneCategory();
        }
      }
    }
  )
}

(function() {
  console.log("Ran apon load in base.js")
  
  connect_to_websocket();
})();

function addDiaryCategoryToSession(category) {
  let diary = JSON.parse(sessionStorage.getItem("patientDiary"));
  diary[category] = [];
  sessionStorage.setItem("patientDiary", JSON.stringify(diary));
  console.log(sessionStorage.getItem("patientDiary"));
}

function addDiaryEntryToSession(category, diaryEntry) {
  let diary = JSON.parse(sessionStorage.getItem("patientDiary"));
  diary[category].push(diaryEntry);
  sessionStorage.setItem("patientDiary", JSON.stringify(diary));
  console.log(JSON.parse(sessionStorage.getItem("patientDiary")));
}