console.log("Hola Mundo")

const parrafos = document.querySelectorAll(".parrafo")
const section = document.querySelectorAll(".section")

parrafos.forEach(parrafo => {
    parrafo.addEventListener("dragstart", evento => {
        console.log("Inicio de arrastre")
        parrafo.classList.add("dragging")
        event.dataTransfer.setData("id", parrafo.id)
    })

    parrafo.addEventListener("dragend", () => {
        console.log("Fin de arrastre")
        parrafo.classList.remove("dragging")    
    })
})

section.forEach(section => {
    section.addEventListener("dragover", event => {
    event.preventDefault()    
    console.log("Drag Over")  
    })

    section.addEventListener("drop", event => {
        console.log("Drop")
        const id_parrafo = event.dataTransfer.getData("id")
        console.log("El parrafo es", id_parrafo )
        const parrafo = document.getElementById(id_parrafo)
        section.appendChild(parrafo)
    })

})
