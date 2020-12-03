//from html forms codealong
/* function send(e) {
    e.preventDefault();
    e.stopPropagation();
    let failures = validateForm();

    if (failures.length === 0) {
        //send 
        document.getElementById('symptoms').submit();
    } else {
        //clear old warnings
        document.getElementById('.input-field').forEach(function(el) {
            el.setAttribute('data-errormsg', '');
            el.classList.remove('error');
        });
        //show new warnings
        failures.forEach(warning => {
            //create and display message
            const field = document.getElementById(warning.input);
            field.parentElement.classList.add('error');
            field.parentElement.setAttribute('data-errormsg', warning.msg);
        });
    }
}

function validateForm() {
    let failures = [];
    const severity = document.getElementById('severity');
    if (severity.value > 5 || severity.value < 1) {
        failures.push({ input: severity.id, msg: 'Symptom Severity has an invalid value' });
    }
    return failures
} */

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    //let enterDelay = 5000;
    //const elems = document.querySelectorAll('.tooltipped');
    //const instances = M.Tooltip.init(elems, enterDelay);
    //document.getElementById('send').addEventListener('click', send);
});