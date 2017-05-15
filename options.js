// Saves options to chrome.storage
function save_options() {
    var ip = document.getElementById('ip_input').value;
    if (validateIP(ip)) {
        chrome.storage.sync.set({
            ip: ip
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('saved');
            status.textContent = 'IP saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 4000);
        });
    }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        ip: '192.168.0.10'
    }, function(items) {
        document.getElementById('ip_input').value = items.ip;
    });
}

function validateIP(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    alert("You have entered an invalid IP address!")
    return (false)
}


document.addEventListener("DOMContentLoaded", function () {
    // Attach listeners to all the buttons
    document.getElementById("ip_submit").addEventListener("click", save_options, false);

    restore_options();
});