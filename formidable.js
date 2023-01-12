(() => {
    var successClass;
    var errorClass;
    var webhookURL;
    var payload = {};

    function init(options) {
        // settings for the forms
        successClass = options.successClass || 'w-form-done';
        errorClass = options.errorClass || 'w-form-fail';
        webhookURL = options.action;
        var allForms = document.querySelectorAll('form');
        // take all forms and convert them to be handled
        allForms.forEach(f => {
            f.addEventListener('submit', handleSubmit, true);
        });
    };
    function loader() {
        // get the attributes on the script
        var script = document.querySelector('script[data-formidable]');
        var options = {};
        options.successClass = script.getAttribute('data-success-class');
        options.errorClass = script.getAttribute('data-error-class');
        options.action = script.getAttribute('data-action');
        options.callback = script.getAttribute('data-callback');
        // initialize the forms
        init(options);
    };

    function handleSubmit(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        // send the payload to the webhook via AJAX per post
        try {
            // take all inputy values and add them to the payload dynamically, based on the name attribute
            var inputs = e.target.querySelectorAll('input[name], textarea[name]');
            inputs.forEach(i => {
                payload[i.name] = i.value;
            });
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', webhookURL, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(payload));
            // hide the form
            e.target.style.display = 'none';
            e.target.parentElement.querySelector('.' + successClass).style.display = 'block';
            if (options.callback) {
                options.callback();
            }
        } catch (error) {
            // hide the form
            e.target.style.display = 'none';
            // show the error message
            e.target.parentElement.querySelector('.' + errorClass).style.display = "block"
        }
    };
    window.addEventListener('load', loader);
})();