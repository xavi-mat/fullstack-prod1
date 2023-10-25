document.getElementById('crearSemestreModalContainer').innerHTML = `
    <div class="modal fade" id="crearSemestreModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Crear Semestre</h5>
                    <button type="button" class="btn-close m-2" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Formulario para crear semestre -->
                    <form>
                        <!-- Campo: Nombre del Semestre -->
                        <div class="mb-3">
                            <label for="nombreSemestre" class="form-label">Nombre del Semestre</label>
                            <input type="text" class="form-control" id="nombreSemestre" placeholder="Ingrese el nombre"
                                required>
                        </div>

                        <!-- Campo: Especialidad -->
                        <div class="mb-3">
                            <label for="especialidad" class="form-label">Especialidad</label>
                            <input type="text" class="form-control" id="especialidad" placeholder="Ingrese la especialidad">
                        </div>

                        <!-- Campos: Fecha de Inicio y Fecha de Fin -->
                        <div class="row">
                            <div class="col-md-6">
                                <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
                                <input type="date" class="form-control" id="fechaInicio">
                            </div>
                            <div class="col-md-6">
                                <label for="fechaFin" class="form-label">Fecha de Fin</label>
                                <input type="date" class="form-control" id="fechaFin">
                            </div>
                        </div>

                        <!-- Campo: Color -->
                        <div class="mb-3">
                            <label for="color" class="form-label">Color</label>
                            <select class="form-select" id="color">
                                <option value="#adc3b0">Verde</option>
                                <option value="#ffba08">Naranja</option>
                                <option value="#fab482">Salmon</option>
                                <option value="#c398b7">Lila</option>
                                <option value="#ffe66d">Amarillo</option>
                                <option value="#d8dc6a">Lima</option>
                                <!-- Agrega más opciones de color según tus necesidades -->
                            </select>
                        </div>

                        <!-- Campo: Descripción -->
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="descripcion" rows="3"
                                placeholder="Ingrese la descripción"></textarea>
                        </div>

                        <!-- Botón de Enviar -->
                        <button type="button" class="btn btn-primary" onclick="enviarFormulario()">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;

// Función para abrir el modal
function abrirModal() {
    $('#crearSemestreModal').modal('show');
}

// Función para cerrar el modal
function cerrarModal() {
    $('#crearSemestreModal').modal('hide');
}

// Función para enviar el formulario (puedes agregar la lógica necesaria)
function enviarFormulario() {
    // Lógica para procesar el formulario

    // Cierra el modal después de procesar el formulario
    cerrarModal();
}

