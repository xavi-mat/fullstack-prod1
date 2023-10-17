"use strict";
////////////////////////////////////////////////////////////////////////////////
// GLOBALS
// Elements
const newSemesterForm = new bootstrap.Modal('#newSemesterForm');
const confirmDeleteSem = new bootstrap.Modal('#confirmDeleteSem');

////////////////////////////////////////////////////////////////////////////////
// Constants


////////////////////////////////////////////////////////////////////////////////
// Variables
let data;


////////////////////////////////////////////////////////////////////////////////
// UTILS
function getSemesterById(id) {
    return data.semesters.find(sem => sem.id == id);
}

////////////////////////////////////////////////////////////////////////////////
// DATA
// Funciones que simulan acceder a una base de datos para leer,escribir, editar
// y borrar datos (CRUD).
// Cuando estas funciones accedan a una BD real, el resto del programa no
// necesitará ningún cambio.
async function createData(info) {
    // Create semester
    if (info.sem) {
        console.log('Creating semester', info.sem);

        // Assign new id to semester, using reduce
        const id = data.semesters.reduce((max, sem) => {
            return sem.id > max ? sem.id : max;
        }, 0) + 1;
        info.sem.id = id;

        data.semesters.push(info.sem);
    }

    // Create subject
    if (info.subj) {
        // TODO: Create subject
        console.log('TODO: Creating subject', info.subj);
    }
}
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
    if (info.subjId) {
        // Delete subject by Id
        console.log('Deleting subject', info.subjId);
        data.semesters.forEach(sem =>
            sem.subjects = sem.subjects.filter(
                subj => subj.id != info.subjId)
        );
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
async function handleNewSemForm(ev, form) {
    ev.preventDefault();

    const sem = {
        name: form.semName.value,
        year: form.semYear.value,
        start: form.semStart.value,
        end: form.semEnd.value,
        descrip: form.semDescrip.value,
        color: form.semColor.value,
        type: form.semType.value,
        tutorized: form.semTutor.checked,
        subjects: [],
    };

    newSemesterForm.hide();
    // TODO: Show spinner
    await createData({ sem });
    // TODO: Hide spinner
    refreshSemesters(data.semesters);

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
