"use strict";
////////////////////////////////////////////////////////////////////////////////
// GLOBALS
// Elements
const confirmDeleteSem = new bootstrap.Modal('#confirmDeleteSem');


////////////////////////////////////////////////////////////////////////////////
// Constants


////////////////////////////////////////////////////////////////////////////////
// Variables
let data;


////////////////////////////////////////////////////////////////////////////////
// UTILS
function getSemesterById(id) { return data.semesters.find(sem => sem.id == id); }

////////////////////////////////////////////////////////////////////////////////
// DATA
async function getData() {
    // Fake data from data.json
    const dataRaw = await fetch('data.json');
    const data = await dataRaw.json();
    return data;
}

async function deleteData(info) {

    if (info.semId) {
        // Delete semester by Id
        console.log('Deleting semester', info.semId);
        data.semesters = data.semesters.filter(sem => sem.id != info.semId);
    }

}

////////////////////////////////////////////////////////////////////////////////
// LOGIC
function deleteSem(id) {

    const sem = getSemesterById(id);

    if (sem) {
        const semName = document.getElementById("semNameDelete");
        semName.innerHTML = sem.name;
        semName.dataset.id = id;
        confirmDeleteSem.show();
        // document.getElementById('confirmDeleteSemBtn').onclick = () => {
            //     confirmDeleteSem.hide();
            //     console.log('Deleting sem', id);
            // };
        }
}

async function deleteSemConfirmed() {
    const semName = document.getElementById("semNameDelete");
    const id = semName.dataset.id;
    confirmDeleteSem.hide();
    await deleteData({ semId: id });
    refreshSemesters(data.semesters);
}

////////////////////////////////////////////////////////////////////////////////
// TEMPLATES
function createSemCard(data) {

    let descrip = data.descrip;
    // Trim description to 30 chars if needed
    if (descrip.length > 30) { descrip = data.descript.slice(0, 27) + '...'; }

    return `<div class="card mb-3">
    <button class="btn-close" onclick="deleteSem(${data.id})"></button>
    <h5 class="card-header">
    ${data.name}
    </h5>
    <div class="card-body" data-id="${data.id}">
        <p class="card-text">${descrip}</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary" onclick="openSem(${data.id})">Ver</button>
    </div>
</div>`;
}


////////////////////////////////////////////////////////////////////////////////
// Handlers
function handleNewSemForm(ev, form) {
    ev.preventDefault();

    const data = {
        name: form.semName.value,
        year: form.semYear.value,
        start: form.semStart.value,
        end: form.semEnd.value,
        descrip: form.semDescrip.value,
        color: form.semColor.value,
        type: form.semType.value,
        tutor: form.semTutor.value,
    };

    console.log(data);

    return false;
}

////////////////////////////////////////////////////////////////////////////////
// UI
function refreshSemesters(semesters) {
    const sems = document.getElementById('semestersList');
    sems.innerHTML = '';

    semesters.forEach(sem => {
        sems.innerHTML += createSemCard(sem);
    });
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function init() {
    data = await getData();
    refreshSemesters(data.semesters);
}
init();
