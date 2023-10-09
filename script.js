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