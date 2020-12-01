document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    let enterDelay = 5000;
    const elems = document.querySelectorAll('.tooltipped');
    const instances = M.Tooltip.init(elems, enterDelay);
});