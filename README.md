# fullstack-prod1

## BACKLOG
* Datos de semestre en la página de semestre
* `refreshSubjects()` no debería necesitar parámetros, en `semesterPage.dataset.id` está la id del semestre que hay que refescar.

## TODO
* Color picker por Katiane
* el color del semestre debería colorear el fondo de la tarjeta de semestre

## DONE
* Estilizar zona de asignaturas pendientes
* mejorar la estética de las tarjetas de los semestres
    * Fusionar rama de jau2
* Refrescar asignaturas cuando se añaden
* Botón de nueva asignatura en las columnas
    * La función de abrir modal debe recibir dos datos: status e id
    * si existe status, es para crear una nueva asignatura con ese estado (no hay id)
    * Si existe id, es para modificar una asignatura que ya existe (ya tiene su status, no necesita cogerlo de la función)
* BUG: los inputs del formulario de asignatura devuelven siempre textos, es necesario pasar ciertos datos a Numnber() para que tengan sentido (el id, el semId, el status).
* Añadir asignaturas
    * Cada una con el estado del botón en el que se ha hecho clic
        * Para ello, manipular el modal de creación de asignaturas al abrirlo con un data-status
* modal de edición de asignatura
* Pensar mejor los dos campos extras de las asignaturas (ahora mismo están 'nota' y 'like')
* modal de confirmación de borrado de asignatura
    * Usar el mismo modal de confirmación que los semestres, con alguna modificación (o quizá no)
* Menú principal sticky
* modal de edición de semestre
