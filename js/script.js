function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, columnName) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);

    // Asegurarse de que estamos soltando dentro de una columna
    var column = event.target.closest('.column');
    if (column) {
        // Mover la tarjeta a la columna correspondiente
        column.appendChild(draggedElement);
    }
}
