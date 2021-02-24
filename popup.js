function Handset(ip, protocol, password) {
    var self = this;
    this.ip = ip;
    this.protocol = protocol;
    this.password = password;
    this.api_status = "/cgi-bin/api-get_phone_status";
    this.api_start_call = "/cgi-bin/api-make_call";
    this.api_phone_operation = "/cgi-bin/api-phone_operation";
    this.api_sys_operation = "/cgi-bin/api-sys_operation";
    this.status = "unknown";
    this.update_delay = 2000;

    this.updateStatus = function (status, callback) {
        if (document.getElementById("phone_details_title")) document.getElementById("phone_details_title").remove();
		//Commented out IP address header to clean up the interface <Q5>
        //document.getElementById("phone_details_ip").innerHTML = "<strong>IP Address: </strong>" + self.ip;
		// Changed wording from Available to Idle <Q5>
        if (status === "available") self.status = "Idle";
        if (status === "busy") self.status = "Busy";
        document.getElementById("phone_details_status").innerHTML = "Connected: " + self.status;
        if(callback) callback();  //check before calling it.
    };

    this.getStatus = function (callback) {
        //Call the handsets api
        var callUrl = this.protocol + this.ip + this.api_status + "?passcode=" + this.password;
        var x = new XMLHttpRequest(); //Make a new http request
        x.open("GET", callUrl); // Make it a get request
        x.responseType = "json"; // The handset API responds with JSON - var"s parse it

        x.onload = function () {
            // Parse and process the response from the handset
            var response = x.response;
            //console.log("response:\n" + JSON.stringify(response, null, 4)); // Output the response - for debugging
            if (!response || !response.response) {
                console.log("No response recevied...");
                return;
            }
            if (typeof(response.response) !== "string") {
                console.log("Unexpected response received!");
                return;
            }
            //console.log(response); // Output the response - for debugging
            if(callback) callback(response.body);  //check before calling it.
        };
        x.send(); // Send API call
    };

    this.startCall = function (number, account, callback) {
        var opt = {
            type: "basic",
            title: "Dialing Number",
            message: number,
            iconUrl: "assets/icons/icon.png",
            priority: 2,
            buttons: [{title:"Dismiss"}, {title:"End Call"}]
			//buttons: [{title:"Dismiss"}]
        };
        chrome.notifications.create("", opt);

        //Call the handset"s api
        var callUrl = this.protocol + this.ip + this.api_start_call + "?phonenumber=" + number +
            "&account=" + account + "&password=" + this.password;
        var x = new XMLHttpRequest(); //Make a new http request
        x.open("GET", callUrl); // Make it a get request
        x.responseType = "json"; // The handset API responds with JSON - var"s parse it

        x.onload = function () {
            // Parse and process the response from the handset
            var response = x.response;
            //console.log("response:\n" + JSON.stringify(response, null, 4)); // Output the response - for debugging
            if (!response || !response.response) {
                console.log("No response received");
                return;
            }

            if (typeof(response.response) !== "string") {
                console.log("Unexpected response received")
                return;
            }
            if (callback) callback(response);  //check before calling it.
        };
        x.send(); // Send API call
    };

    this.startCallTyped = function () {
        var number_to_dial = document.getElementById("type_to_dial_number").value;
		// Q5 Networks added phone number formatting BEGIN <Q5>
		//remove everything except for numbers from tel: destination <Q5>
		number_to_dial = number_to_dial.replace(/[^0-9*]/g, '');
		//determine length of tel number string <Q5>
		tellength = number_to_dial.length;
		// this will work for US only - if 10 digit number add 1 prefix. Issue was occuring for numbers beginning with conflicting prefixes on platform. <Q5>
		if(tellength == 10 ) {
			number_to_dial = prefix + number_to_dial;
		}
		// Q5 Networks added phone number formatting ENDS <Q5>
		
			self.startCall(number_to_dial, "0");
		
    };

    this.sendOperation = function (operation, sys, callback) {
        var callUrl;
        if (sys) callUrl = this.protocol + this.ip + this.api_sys_operation + "?request=" + operation + "&passcode=" + this.password;
        else callUrl = this.protocol + this.ip + this.api_phone_operation + "?cmd=" + operation + "&passcode=" + this.password;
    var x = new XMLHttpRequest(); //Make a new http request
    x.open("GET", callUrl); // Make it a get request
    x.responseType = "json"; // The handset API responds with JSON - var"s parse it

    x.onload = function () {
        // Parse and process the response from the handset
        var response = x.response;
        //console.log("response:\n" + JSON.stringify(response, null, 4)); // Output the response - for debugging
        if (!response || !response.response) {
            console.log("No response received");
            return;
        }

        if (typeof(response.response) !== "string") {
            console.log("Unexpected response received")
            return;
        }
        if (callback) callback(response);  //check before calling it.
    };
    x.send(); // Send API call
    };

    this.notify = function (title, message) {
        var opt = {
            type: "basic",
            title: title,
            message: message,
            iconUrl: "assets/icons/icon.png",
            priority: 2,
            buttons: [{title:"Dismiss"}]
        };
        chrome.notifications.create("", opt);
    };

    this.acceptCall = function () {
        self.sendOperation("acceptcall");
        self.notify("Accepted Call", "");
    };

    this.endCall = function () {
        self.sendOperation("endcall");
        //self.notify("Ended Call", "");
    };

    this.holdCall = function () {
        self.sendOperation("holdcall");
        self.notify("Toggling Call Hold", "");
    };

    this.rejectCall = function () {
        self.sendOperation("rejectcall");
        self.notify("Rejecting Call", "");
    };

    this.reboot = function () {
        self.sendOperation("REBOOT", 1);
        self.notify("Rebooting Handset", "");
    };

    this.getIP = function () {
        chrome.storage.sync.get({
            ip: '10.1.1.1',
			pw: 'password',
			prot: 'http://',
			scrape: 'no',
			prefix: ''
        }, function(items) {
            self.ip = items.ip;
			self.password = items.pw;
			self.protocol = items.prot;
			self.scrape = items.scrape;
			self.prefix = items.prefix;
            console.log("Updated to: "+ items.prot + items.ip + " an PW: "+ items.pw);
            return items.ip;
        });
    }
}


var phone = new Handset("10.0.2.30", "http://", "password");
phone.getIP();

console.log("IP: " + phone.protocol + phone.ip + " password: " + phone.password);

document.addEventListener("DOMContentLoaded", function () {
    // Attach listeners to all the buttons
    document.getElementById("type_to_dial_submit").addEventListener("click", phone.startCallTyped, false);
    document.getElementById("phone_actions_acceptcall").addEventListener("click", phone.acceptCall, false);
    document.getElementById("phone_actions_endcall").addEventListener("click", phone.endCall, false);
    document.getElementById("phone_actions_holdcall").addEventListener("click", phone.holdCall, false);
	//Commented out the Reboot button, and listener because it does not seem necessary <Q5>
    //document.getElementById("phone_actions_reboot").addEventListener("click", phone.reboot, false);

    // Get phone status every x seconds
    phone.getStatus(phone.updateStatus);
    window.setInterval(function () {
        phone.getStatus(phone.updateStatus)
    }, phone.update_delay);
});

chrome.runtime.onMessage.addListener(function (message) {
    console.log("message: " + message);
	//Listen for options to be saved and if so, get them from storage
	if(message == "Q5reload") {
		phone.getIP(); 
	} else {
	if(/^[0-9]*$/g.test(message) || /^*[0-9]*$/g.test(message)) {
		phone.startCall(message, "0");
	}
	
	}
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    if (buttonIndex === 1) {
        chrome.notifications.clear(notificationId);
        phone.endCall();
    }
    else {
        chrome.notifications.clear(notificationId);
    }
});

