"use strict";
////////////////////////////////////////////////////////////////////////////////
// GLOBALS
// Elements
const pageTitle = document.getElementById('pageTitle');
const pageTopic = document.getElementById('pageTopic');
const newSemBtn = document.getElementById('newSemBtn');
const newSubjectBtn = document.getElementById('newSubjectBtn');
const semestersList = document.getElementById('semestersList');
const semesterPage = document.getElementById('semesterPage');
const semSlogan = document.getElementById('semSlogan');
const newSemesterForm = new bootstrap.Modal('#newSemesterForm');
const confirmDeleteSem = new bootstrap.Modal('#confirmDeleteSem');
const empezadasColumn = document.getElementById('empezadas-column');
const empezadasList = document.getElementById('empezadasList');
const aprobadasColumn = document.getElementById('aprobadas-column');
const aprobadasList = document.getElementById('aprobadasList');
const suspendidasColumn = document.getElementById('suspendidas-column');
const suspendidasList = document.getElementById('suspendidasList');

////////////////////////////////////////////////////////////////////////////////
// Constants
const PENDIENTE = 0;
const EMPEZADA = 1;
const APROBADA = 2;
const SUSPENDIDA = 3;

////////////////////////////////////////////////////////////////////////////////
// Variables
let data;





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// UTILS
function showMe(...elems) { elems.forEach(e => e.classList.remove('d-none')); }
function hideMe(...elems) { elems.forEach(e => e.classList.add('d-none')); }




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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

async function getSemesterById(id) {
    id = Number(id);
    return data.semesters.find(sem => sem.id === id);
}

async function getSubjectById(id) {
    id = Number(id);
    return data.semesters
        .map(sem => sem.subjects)
        .flat()
        .find(subj => subj.id === id);
}

async function updateSubjectStatus(id, status) {

    // Cast to numbers
    id = Number(id);
    status = Number(status);

    const subj = await getSubjectById(id);
    if (subj) {
        subj.status = status;

    } else {
        throw new Error(`Subject ${id} not found`);
    }
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
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// LOGIC
async function deleteSem(id) {

    const sem = await getSemesterById(id);

    if (sem) {
        const semName = document.getElementById("semNameDelete");
        semName.innerHTML = sem.name;
        semName.dataset.id = id;
        confirmDeleteSem.show();
    }
}

async function deleteSemConfirmed() {
    const semName = document.getElementById("semNameDelete");
    const id = semName.dataset.id;
    confirmDeleteSem.hide();
    await deleteData({ semId: id });
    refreshSemesters(data.semesters);
}

function editSubject(id) {
    console.log("TODO: Edit subject " + id);
}
async function deleteSubject(id) {
    await deleteData({ subjId: id });
    const semId = semesterPage.dataset.id;
    const sem = await getSemesterById(semId);
    refreshSubjects(sem);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// TEMPLATES
function createSemCard(sem) {
    let descrip = sem.descrip;
    // Trim description to 30 chars if needed
    if (descrip.length > 30) { descrip = sem.descript.slice(0, 27) + '...'; }

    return `<div id="semester${sem.id}" class="card mb-3" data-id="${sem.id}">
    <button class="btn-close" onclick="deleteSem(${sem.id})"></button>
    <h5 class="card-header">
    ${sem.name}
    </h5>
    <div class="card-body">
        <p class="card-text">${descrip}</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary" onclick="openSem(${sem.id})">Ver</button>
    </div>
</div>`;
}

function createSubjectCard(subj) {
    let descrip = subj.descrip;
    // Trim description to 30 chars if needed
    if (descrip.length > 30) { descrip = subj.descript.slice(0, 27) + '...'; }

    return `<div class="card parrafo" draggable="true" id="subject${subj.id}" data-id="${subj.id}">
    <div class="card-body">
        <button class="btn-close" onclick="deleteSubject(${subj.id})"></button>
        <h5 class="card-title">${subj.name}</button></h5>
        <p class="card-text">${descrip}</p>
        <button class="custom-btn-card-dg" data-bs-toggle="modal" data-bs-target="#crearSemestreModal" onclick="editSubject(${subj.id})">EDITAR</button>
        <!-- button class="btn btn-primary" onclick="editSubject(${subj.id})"><i class="bi bi-pencil-square"></i></button -->
        <!-- button class="btn btn-danger"><i class="bi bi-x-circle"></i></button -->
        <!-- button class="custom-btn-card2-dg" data-bs-toggle="modal" data-bs-target="#crearSemestreModal" onclick="agregarTarjeta()">BORRAR</button -->
    </div>
</div>`;
}




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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
    await createData({ sem });
    refreshSemesters(data.semesters);

    return false;
}

async function handleNewSubjectForm(ev, form) {
    ev.preventDefault();

    const subj = {
        name: form.subjName.value,
        descrip: form.subjDescrip.value,
        semId: form.subjSemId.value,
        status: PENDIENTE,
    };

    newSubjectForm.hide();
    await createData({ subj });
    // TODO: refresh subjects
    return false;
}

function dragover(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}
function dragenter(ev) {
    ev.preventDefault();
    // Remove dragover class from all sections
    document.querySelectorAll('.section').forEach(col => {
        col.classList.remove('dragover');
    });
    this.classList.add('dragover');
}
function dragleave(ev) {
    ev.preventDefault();
    // this.classList.remove('dragover');
}
async function dragdrop(ev) {
    ev.preventDefault();
    const column = ev.currentTarget;
    this.classList.remove('dragover');
    const data = ev.dataTransfer.getData('text/plain');
    const card = document.getElementById(data);
    const subjectId = card.dataset.id;
    const status = column.dataset.status;
    console.log({ subjectId, status });
    await updateSubjectStatus(subjectId, status);
    column.querySelector("div").appendChild(card);
}
function dragstart(ev) {
    ev.dataTransfer.setData('text/plain', this.id);
}
function dragend(ev) {
    // Remove dragover class from all sections
    document.querySelectorAll('.section').forEach(col => {
        col.classList.remove('dragover');
    });
}

function applyListeners() {
    // Drag&drop listeners
    empezadasColumn.addEventListener('dragover', dragover);
    empezadasColumn.addEventListener('dragenter', dragenter);
    empezadasColumn.addEventListener('dragleave', dragleave);
    empezadasColumn.addEventListener('drop', dragdrop);
    aprobadasColumn.addEventListener('dragover', dragover);
    aprobadasColumn.addEventListener('dragenter', dragenter);
    aprobadasColumn.addEventListener('dragleave', dragleave);
    aprobadasColumn.addEventListener('drop', dragdrop);
    suspendidasColumn.addEventListener('dragover', dragover);
    suspendidasColumn.addEventListener('dragenter', dragenter);
    suspendidasColumn.addEventListener('dragleave', dragleave);
    suspendidasColumn.addEventListener('drop', dragdrop);
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// UI
function goSemsList() {
    pageTitle.innerHTML = '_Semestres';
    pageTopic.innerHTML = 'curso';
    hideMe(semesterPage, semSlogan, newSubjectBtn);
    showMe(semestersList, newSemBtn);
}

function refreshSemesters(semesters) {

    semestersList.innerHTML = '';

    semesters.forEach(sem => {
        semestersList.innerHTML += createSemCard(sem);
    });
}

async function openSem(id) {

    console.log('Opening sem', id);

    pageTitle.innerHTML = '_Asignaturas';
    pageTopic.innerHTML = 'semestre';
    hideMe(semestersList, newSemBtn);
    const sem = await getSemesterById(id);
    refreshSubjects(sem);
    semesterPage.dataset.id = id;
    showMe(semesterPage, semSlogan, newSubjectBtn);
}

function refreshSubjects(sem) {
    // Clear lists
    empezadasList.innerHTML = '';
    aprobadasList.innerHTML = '';
    suspendidasList.innerHTML = '';

    if (sem) {
        // Fill in semester subjects by status
        sem.subjects.forEach(subj => {
            const subjCard = createSubjectCard(subj);
            switch (subj.status) {
                case EMPEZADA:
                    empezadasList.innerHTML += subjCard;
                    break;
                case APROBADA:
                    aprobadasList.innerHTML += subjCard;
                    break;
                case SUSPENDIDA:
                    suspendidasList.innerHTML += subjCard;
                    break;
            }
        });

        // Add dragstart listeners to subject cards
        document.querySelectorAll('.parrafo').forEach(card => {
            card.addEventListener('dragstart', dragstart);
            card.addEventListener('dragend', dragend);
        });
    }
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
async function init() {
    applyListeners();
    data = await getData();
    refreshSemesters(data.semesters);
}
init();
