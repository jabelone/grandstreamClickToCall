// Saves values entered to chrome.storage
function save_options() {
    var ip = document.getElementById('ip_input').value;
	var pw = document.getElementById('pw_input').value;
	var prot = document.getElementById('prot_input').value;
	var scrape = document.getElementById('scrape').value;
	var prefix = document.getElementById('prefix').value;
    if (validateIP(ip,prefix)) {
        chrome.storage.sync.set({
            ip: ip,
			pw: pw,
			prot: prot,
			scrape: scrape,
			prefix: prefix
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('saved');
            status.textContent = 'Data saved.';
			chrome.runtime.sendMessage("Q5reload");
            setTimeout(function() {
                status.textContent = '';
            }, 2000);
        });
		
    }
}

// Pull values from chrome.storage if stored. 
function restore_options() {
    chrome.storage.sync.get({
        ip: '192.168.0.10',
		pw: 'password',
		prot: 'http://',
		scrape: 'no',
		prefix: '1'
    }, function(items) {
        document.getElementById('ip_input').value = items.ip;
		document.getElementById('pw_input').value = items.pw;
		document.getElementById('prot_input').value = items.prot;
		document.getElementById('scrape').value = items.scrape;
		document.getElementById('prefix').value = items.prefix;
    });
}

function validateIP(ipaddress,prefix) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress) && /^[0-9]*$/g.test(prefix)) {
        return (true)
    }
    alert("Invalid entry, please correct.")
    return (false)
}


document.addEventListener("DOMContentLoaded", function () {
    // Attach listeners to all the buttons
    document.getElementById("ip_submit").addEventListener("click", save_options, false);

    restore_options();
});
