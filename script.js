"use strict";
////////////////////////////////////////////////////////////////////////////////
// GLOBALS
// Elements
// Obtener los elementos del html para que el JS los pueda gestionar
const pageTitle = document.getElementById('pageTitle');
const pageTopic = document.getElementById('pageTopic');
const newSemBtn = document.getElementById('newSemBtn');
const newSubjectBtn = document.getElementById('newSubjectBtn');
const semestersList = document.getElementById('semestersList');
const semesterPage = document.getElementById('semesterPage');
const semSlogan = document.getElementById('semSlogan');
const semesterModal = new bootstrap.Modal('#semesterModal');
// const newSemForm = document.getElementById('newSemForm');
const subjectModal = new bootstrap.Modal('#subjectModal');
const subjModalTitle = document.getElementById('subjModalTitle');
const subjectForm = document.getElementById('subjectForm');
const confirmDeleteSem = new bootstrap.Modal('#confirmDeleteSem');
const pendientesZone = document.getElementById('pendientes-zone');
const pendientesList = document.getElementById('pendientesList');
const empezadasColumn = document.getElementById('empezadas-column');
const empezadasList = document.getElementById('empezadasList');
const aprobadasColumn = document.getElementById('aprobadas-column');
const aprobadasList = document.getElementById('aprobadasList');
const suspendidasColumn = document.getElementById('suspendidas-column');
const suspendidasList = document.getElementById('suspendidasList');
// Hidden fields in Subject Form
const subjFormFields = {
    id: document.getElementById('subjId'),
    status: document.getElementById('subjStatus'),
    semId: document.getElementById('subjSemId'),
    name: document.getElementById('subjectName'),
    descrip: document.getElementById('subjectDescrip'),
    difficulty: document.getElementById('subjectDifficulty'),
    grade: document.getElementById('subjectGrade'),
    like: document.getElementById('subjectLike'),
};
const zones = [pendientesZone, empezadasColumn, aprobadasColumn,
    suspendidasColumn];

////////////////////////////////////////////////////////////////////////////////
// Constants
// Constantes para evitar números mágicos y para que sean más fáciles de entender los códigos de estado de las asignaturas
const PENDIENTE = 0;
const EMPEZADA = 1;
const APROBADA = 2;
const SUSPENDIDA = 3;

////////////////////////////////////////////////////////////////////////////////
// Variables
// Variables globales que serán necesarias en muchas funciones
let data;





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// UTILS
/**
 * Muestra los elementos del DOM que se pasen como parámetros.
 * Para ello, elimina la clase 'd-none' en cada elemento.
 */
function showMe(...elems) { elems.forEach(e => e.classList.remove('d-none')); }
/**
 * Oculta los elementos del DOM que se pasen como parámetros.
 * Para ello, añade la clase 'd-none' en cada elemento.
 */
function hideMe(...elems) { elems.forEach(e => e.classList.add('d-none')); }




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// DATA
// Funciones que simulan acceder a una base de datos para leer,escribir, editar
// y borrar datos (CRUD).
// Cuando estas funciones accedan a una BD real, el resto del programa no
// necesitará ningún cambio.

/**
 * Crea un nuevo semestre o asignatura en la base de datos.
 * @param {Object} info - Objeto con la información del semestre o asignatura
 */
async function createData(info) {
    // Create semester
    if (info.sem) {
        console.log('Creating semester', info.sem);
        // Assign new id to semester, using reduce
        // Aquí se imita la asignación de un id nuevo a un semestre, como hacen
        // las bases de datos. Se usa reduce para obtener el id más alto de los
        // semestres existentes y se le suma 1.
        const id = data.semesters.reduce((max, sem) => {
            return sem.id > max ? sem.id : max;
        }, 0) + 1;
        info.sem.id = id;

        data.semesters.push(info.sem);
    }

    // Create subject
    if (info.subj) {
        console.log('Creating subject', info.subj);

        const sem = await getSemesterById(info.subj.semId);

        // Obtener el id nuevo de la asignatura, usando reduce para obtener el
        // id más alto de todas las asignaturas de todos los semestres
        const id = data.semesters
            .map(sem => sem.subjects)
            .flat()
            .reduce((max, subj) => {
                return subj.id > max ? subj.id : max;
            }, 0) + 1;
        info.subj.id = id;

        sem.subjects.push(info.subj);  // TODO: REVISAR SI SE ESTÁ CREANDO
    }
}

/**
 * Obtiene los datos de la base de datos.
 * @returns {Object} - Objeto con los datos de la base de datos
 */
async function getData() {
    // Fake data from data.json
    const dataRaw = await fetch('data.json');
    const data = await dataRaw.json();
    return data;
}

/**
 * Obtiene un semestre por su id.
 */
async function getSemesterById(id) {
    id = Number(id);
    return data.semesters.find(sem => sem.id === id);
}

/**
 * Obtiene una asignatura por su id.
 * Recorre los semestres, obtiene sus asignaturas y las junta en un array.
 * Luego busca la asignatura por su id en ese array.
 */
async function getSubjectById(id) {
    id = Number(id);
    return data.semesters
        .map(sem => sem.subjects)
        .flat()
        .find(subj => subj.id === id);
}

/**
 * Actualiza el estado de una asignatura.
 * @param {Number} id - Id de la asignatura
 * @param {Number} status - Nuevo estado de la asignatura
 */
async function updateSubjectStatus(id, status) {

    // Cast to numbers
    id = Number(id);
    status = Number(status);

    const subj = await getSubjectById(id);
    if (subj) {
        subj.status = status;
        console.log(subj);

    } else {
        throw new Error(`Subject ${id} not found`);
    }
}

/**
 * Actualiza un semestre o asignatura en la base de datos.
 */
async function updateSubject(subj) {
    // Cast to numbers
    subj.id = Number(subj.id);
    subj.status = Number(subj.status);

    const subjOld = await getSubjectById(subj.id);

    if (subjOld) {
        subjOld.name = subj.name;
        subjOld.descrip = subj.descrip;
        subjOld.difficulty = subj.difficulty;
        subjOld.grade = subj.grade;
        subjOld.like = subj.like;
        subjOld.status = subj.status;
        subjOld.semId = subj.semId;

    } else {
        throw new Error(`Subject ${subj.id} not found`);
    }
}


/**
 * Borra un semestre o asignatura de la base de datos.
 */
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
/**
 * Muestra el modal de confirmación para borrar un elemento.
 */
async function deleteSem(id) {

    const sem = await getSemesterById(id);

    if (sem) {
        const semName = document.getElementById("semNameDelete");
        semName.innerHTML = sem.name;
        semName.dataset.id = id;
        confirmDeleteSem.show();
    }
}

/**
 * Borra el elemento seleccionado. Esta función viene del modal de confirmación.
 */
async function deleteSemConfirmed() {
    const semName = document.getElementById("semNameDelete");
    const id = semName.dataset.id;
    confirmDeleteSem.hide();
    await deleteData({ semId: id });
    refreshSemesters(data.semesters);
}

/**
 * TODO
 */
function editSubject(ev, id) {
    // ev.preventDefault();
    console.log("TODO: Edit subject " + id);
}
/**
 * Borra una asignatura. TODO: que sea a la vuelta del modal de confirmación.
 */
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
// Estas funciones crean el HTML de los elementos que se muestran en la página.
// Reciben un objeto con las propiedades del elemento, insertan esas propiedades
// en el HTML y devuelven el HTML creado.
// En realidad, esta funciones solo devuelven una string de texto. Luego, las
// funciones que las llaman y reciban esa string, la insertarán en la propiedad
// innerHTML de algún elemento del DOM. Será entonces cuando las strings se
// convertirán en elementos HTML con todo su funcionamiento y estilo.

/**
 * Crea el HTML de la card de un semestre.
 */
function createSemCard(sem) {
    let descrip = sem.descrip;
    // Trim description to 30 chars if needed
    if (descrip.length > 30) { descrip = sem.descript.slice(0, 27) + '...'; }

    return `<div id="semester${sem.id}" class="card mb-3 semester-card" data-id="${sem.id}">
    <button class="btn-close" onclick="deleteSem(${sem.id})"></button>
    <h5 class="card-header">
    ${sem.name}
    </h5>
    <div class="card-body">
        <p class="card-text">${descrip}</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary" onclick="openSem(${sem.id})">Ver</button>
        <button class="btn btn-secondary" onclick="editSem(${sem.id})">Editar</button>
    </div>
</div>`;
}

/**
 * Crea el HTML de la card de una asignatura.
 */
function createSubjectCard(subj) {
    let descrip = subj.descrip;
    // Trim description to 30 chars if needed
    if (descrip.length > 30) { descrip = subj.descript.slice(0, 27) + '...'; }

    return `<div class="card parrafo" draggable="true" id="subject${subj.id}" data-id="${subj.id}">
    <div class="card-body">
        <button class="btn-close" onclick="deleteSubject(${subj.id})"></button>
        <h5 class="card-title">${subj.name}</button></h5>
        <p class="card-text">${descrip}</p>
        <button class="custom-btn-card-dg" onclick="openSubjectForm(${subj.id})">EDITAR</button>
        <!-- button class="btn btn-primary" onclick="openSubjectForm(${subj.id})"><i class="bi bi-pencil-square"></i></button -->
        <!-- button class="btn btn-danger"><i class="bi bi-x-circle"></i></button -->
        <!-- button class="custom-btn-card2-dg" data-bs-toggle="modal" data-bs-target="#crearSemestreModal" onclick="agregarTarjeta()">BORRAR</button -->
    </div>
</div>`;
}







////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Handlers
// Funciones que gestionan los eventos.

/**
 * Recibe los datos del formulario de creación de un nuevo semestre.
 * Da formato adecuado a los datos.
 * Esconde el formulario.
 * Limpia el formulario
 * Crea el semestre en la base de datos.
 * Actualiza la lista de semestres.
 * @param {Event} ev - Evento de envío del formulario
 * @param {HTMLFormElement} form - Formulario de creación de semestre
 * @returns {Boolean} - Devuelve false para evitar que el formulario refresque
 * la página.
 */
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

    semesterModal.hide();
    form.reset();
    await createData({ sem });
    refreshSemesters(data.semesters);

    return false;
}

/**
 * Recibe los datos del formulario de creación de una nueva asignatura.
 * Da formato adecuado a los datos.
 * Esconde el formulario.
 * Limpia el formulario
 * Crea la asignatura en la base de datos.
 * Actualiza la lista de asignaturas.
 * @param {Event} ev - Evento de envío del formulario
 * @param {HTMLFormElement} form - Formulario de creación de asignatura
 * @returns {Boolean} - Devuelve false para evitar que el formulario refresque
 * la página.
 */
async function handleSubjectForm(ev, form) {
    ev.preventDefault();

    // Si en el formulario hay una id (en el campo escondido subjId), es
    // porque se está editando una asignatura. En ese caso, hay que actualizar
    // la asignatura en la BD en vez de crear una nueva.

    const subj = {
        id: form.subjId.value,
        semId: form.subjSemId.value,
        name: form.subjectName.value,
        descrip: form.subjectDescrip.value,
        difficulty: form.subjectDifficulty.value,
        grade: form.subjectGrade.value,
        like: form.subjectLike.checked,
        status:form.subjStatus.value,
    };

    subjectModal.hide();
    form.reset();

    if (subj.id) {
        // Si hay id, se está editando una asignatura
        await updateSubject(subj);
    } else {
        // Si no hay id, se está creando una asignatura nueva
        await createData({ subj });
    }

    refreshSubjects(await getSemesterById(subj.semId));
    return false;
}

// Funciones que gestionan el drag & drop

/**
 * Cambia el iconito del cursor cuando se arrastra un elemento al tipo "move".
 */
function dragover(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

/**
 * Cambia el color de fondo de la columna cuando se arrastra un elemento sobre
 * ella, para ello, le añade la clase 'dragover'.
 */
function dragenter(ev) {
    ev.preventDefault();
    // Remove dragover class from all zones
    zones.forEach(zone => zone.classList.remove('dragover'));
    this.classList.add('dragover');
}

/**
 * Por ahora no hace nada.
 */
function dragleave(ev) {
    ev.preventDefault();
}

/**
 * Cambia el estado de la asignatura cuando se suelta sobre una columna.
 * Para ello:
 * - Recupera el dato guardado por dragstart en el `dataTransfer` (el id de la
 * asignatura que se está arrastrando).
 * - Gracias al id recuperado, con `document.getElementById` obtiene el elemento
 * HTML mismo.
 * - Recupera el id de la asignatura que la BD reconocerá. Este id está guardado
 * en el atributo `data-id` de la card de la asignatura.
 * - Recupera el estado de la columna sobre la que se ha soltado el elemento.
 * Ese estado está guardado en el atributo `data-status` de la columna.
 * - Actualiza el estado de la asignatura en la BD, para ello pasa solo dos
 * datos: el id de la asignatura y el nuevo estado.
 * - Mueve la card de la asignatura a la columna correspondiente (usando
 * appendChild)
 */
async function dragdrop(ev) {
    ev.preventDefault();
    const column = ev.currentTarget;
    this.classList.remove('dragover');
    const subjId = ev.dataTransfer.getData('text/plain');
    const card = document.getElementById(subjId);
    const subjectId = card.dataset.id;
    const status = column.dataset.status;

    await updateSubjectStatus(subjectId, status);
    // La tarjeta se añade a un div que está dentro de la columna, por eso se
    // usa querySelector para seleccionar ese div y luego appendChild para
    // añadir la tarjeta a ese div.
    column.querySelector("div").appendChild(card);
}

/**
 * Guarda el id de la asignatura que se está arrastrando, para recuperarlo
 * luego en dragdrop.
 */
function dragstart(ev) {
    ev.dataTransfer.setData('text/plain', this.id);
}

/**
 * Elimina la clase 'dragover' (que añade un borde rojo) de todas las columnas.
 */
function dragend(ev) {
    // Remove dragover class from all zones
    zones.forEach(zone => zone.classList.remove('dragover'));
}

/**
 * Aplica los listeners de drag&drop a las columnas y la zona de "pendientes",
 * es decir, a todas las zonas que pueden recibir una asignatura arrastrada.
 */
function applyListeners() {
    // Drag&drop listeners
    // En vez de hacerlo una a una, podemos iterar por el array de zonas con
    // forEach y aplicar los listeners a cada una de ellas.

    // pendientesZone.addEventListener('dragover', dragover);
    // pendientesZone.addEventListener('dragenter', dragenter);
    // pendientesZone.addEventListener('dragleave', dragleave);
    // pendientesZone.addEventListener('drop', dragdrop);
    // empezadasColumn.addEventListener('dragover', dragover);
    // empezadasColumn.addEventListener('dragenter', dragenter);
    // empezadasColumn.addEventListener('dragleave', dragleave);
    // empezadasColumn.addEventListener('drop', dragdrop);
    // aprobadasColumn.addEventListener('dragover', dragover);
    // aprobadasColumn.addEventListener('dragenter', dragenter);
    // aprobadasColumn.addEventListener('dragleave', dragleave);
    // aprobadasColumn.addEventListener('drop', dragdrop);
    // suspendidasColumn.addEventListener('dragover', dragover);
    // suspendidasColumn.addEventListener('dragenter', dragenter);
    // suspendidasColumn.addEventListener('dragleave', dragleave);
    // suspendidasColumn.addEventListener('drop', dragdrop);

    zones.forEach(zone => {
        zone.addEventListener('dragover', dragover);
        zone.addEventListener('dragenter', dragenter);
        zone.addEventListener('dragleave', dragleave);
        zone.addEventListener('drop', dragdrop);
    });
}






////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// UI
// Estas funciones controlan el aspecto de la página (User Interface).
// Muestras u ocultan secciones y cambian el texto de los elementos del DOM que
// haga falta (el título, el eslogan, etc.)

/**
 * Muestra la lista de semestres y oculta la página de asignaturas.
 * También cambia el título y una palabra del eslogan.
 */
function goSemsList() {
    pageTitle.innerHTML = '_Semestres';
    pageTopic.innerHTML = 'curso';
    hideMe(semesterPage, semSlogan, newSubjectBtn);
    showMe(semestersList, newSemBtn);
}

/**
 * Vacía la lista de semestres (se trata del `div` que contiene las cards de
 * los semestres), y los vuelve a crear todos de nuevo.
 * Esto se hace para que se actualice la lista de semestres cuando se crea uno
 * nuevo, o bien se actualiza o se borra.
 */
function refreshSemesters(semesters) {
    semestersList.innerHTML = '';
    semesters.forEach(sem => {
        semestersList.innerHTML += createSemCard(sem);
    });
}

/**
 * Muestra la página de asignaturas y oculta la lista de semestres.
 * También cambia el título y una palabra del eslogan.
 * @param {Number} id - Id del semestre que se quiere abrir
 */
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


function editSem(id) {
    console.log("TODO");
}


/**
 * Vacía las listas de asignaturas (se trata de los `div` que contienen las
 * cards de las asignaturas), y las vuelve a crear todas de nuevo, cada una en
 * su lista correspondiente.
 */
function refreshSubjects(sem) {
    // Clear lists
    pendientesList.innerHTML = '';
    empezadasList.innerHTML = '';
    aprobadasList.innerHTML = '';
    suspendidasList.innerHTML = '';

    if (sem) {
        // Fill in semester subjects by status
        sem.subjects.forEach(subj => {
            const subjCard = createSubjectCard(subj);
            switch (subj.status) {
                case PENDIENTE:
                    pendientesList.innerHTML += subjCard;
                    break;
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

        // Add drag listeners to subject cards
        document.querySelectorAll('.parrafo').forEach(card => {
            card.addEventListener('dragstart', dragstart);
            card.addEventListener('dragend', dragend);
        });
    }
}

/**
 * Muestra el formulario de las asignaturas.
 * @param {Number} status - Estado de la asignatura que se quiere crear
 * o editar
 * @param {Number} id - Id de la asignatura que se quiere editar
 * (solo si se está editando).
 */
async function openSubjectForm(id=null) {
    // Set hidden values in form
    subjFormFields.semId.value = semesterPage.dataset.id;

    if (id) {
        // Si existe un id, estamos editando una asignatura existente
        subjModalTitle.innerHTML = 'Editar asignatura';
        const subj = await getSubjectById(id);
        // El status no se modifica desde el formulario
        subjFormFields.status.value = subj.status;
        subjFormFields.id.value = id;
        subjFormFields.name.value = subj.name;
        subjFormFields.descrip.value = subj.descrip;
        subjFormFields.difficulty.value = subj.difficulty;
        subjFormFields.grade.value = subj.grade;
        subjFormFields.like.checked = subj.like;

    } else {
        // Si no existe un id, estamos creando una asignatura nueva
        subjModalTitle.innerHTML = 'Nueva asignatura';
        subjFormFields.status.value = PENDIENTE;  // Status por defecto
        subjFormFields.id.value = '';
        subjFormFields.name.value = '';
        subjFormFields.descrip.value = '';
        subjFormFields.difficulty.value = '5'; // Valor por defecto
        subjFormFields.grade.value = '';
        subjFormFields.like.checked = false;
    }
    subjectModal.show();
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/**
 * Inicializa la página.
 * - Aplica los listeners de las zonas Drag&Drop
 * - Obtiene los datos de la base de datos y los guarda en el objeto global
 * `data`.
 * - Actualiza la lista de semestres, a partir de los datos que acaba de
 * obtener.
*/
async function init() {
    applyListeners();
    data = await getData();
    refreshSemesters(data.semesters);
}
////////////////////////////////////////////////////////////////////////////////
// Todo el código anterior no hace nigún cambio en el DOM. Solo define variables
// y constantes y también funciones.
// Solo cuando se llega a este punto empieza a realizarse algo en la página.
init();
