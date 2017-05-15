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
        //console.log("status: " + status);
        if (document.getElementById("phone_details_title")) document.getElementById("phone_details_title").remove();
        document.getElementById("phone_details_ip").innerHTML = "<strong>IP Address: </strong>" + self.ip;
        if (status === "available") self.status = "Ready to Dial";
        if (status === "busy") self.status = "Busy";
        document.getElementById("phone_details_status").innerHTML = "<strong>Status: </strong>" + self.status;
        if(callback) callback();  //check before calling it.
    };

    this.getStatus = function (callback) {
        //Call the handset"s api
        var callUrl = this.protocol + this.ip + this.api_status + "?passcode=" + this.password;
        //console.log(callUrl);
        var x = new XMLHttpRequest(); //Make a new http request
        x.open("GET", callUrl); // Make it a get request
        x.responseType = "json"; // The handset API responds with JSON - var"s parse it

        x.onload = function () {
            // Parse and process the response from the handset
            var response = x.response;
            //console.log("response:\n" + JSON.stringify(response, null, 4)); // Output the response - for debugging
            if (!response || !response.response) {
                console.log("No response from Handset! Make sure the IP is correct...");
                return;
            }
            if (typeof(response.response) !== "string") {
                console.log("Unexpected response from the Handset\"s API!");
                return;
            }
            //console.log(result); // Output the response - for debugging
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
                console.log("No response from Handset! Make sure the IP is correct...");
                return;
            }

            if (typeof(response.response) !== "string") {
                console.log("Unexpected response from the Handset\"s API!")
                return;
            }
            if (callback) callback(response);  //check before calling it.
        };
        x.send(); // Send API call
    };

    this.startCallTyped = function () {
        var number_to_dial = document.getElementById("type_to_dial_number").value;
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
            console.log("No response from Handset! Make sure the IP is correct...");
            return;
        }

        if (typeof(response.response) !== "string") {
            console.log("Unexpected response from the Handset\'s API!")
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
        self.notify("Ended Call", "");
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
            ip: '192.168.0.10'
        }, function(items) {
            self.ip = items.ip;
            console.log("Updated IP to: " + items.ip);
            return items.ip;
        });
    }
}

var phone = new Handset("10.0.2.30", "http://", "admin");
phone.getIP();

console.log("IP: " + phone.protocol + phone.ip + " password: " + phone.password);

document.addEventListener("DOMContentLoaded", function () {
    // Attach listeners to all the buttons
    document.getElementById("type_to_dial_submit").addEventListener("click", phone.startCallTyped, false);
    document.getElementById("phone_actions_acceptcall").addEventListener("click", phone.acceptCall, false);
    document.getElementById("phone_actions_endcall").addEventListener("click", phone.endCall, false);
    document.getElementById("phone_actions_holdcall").addEventListener("click", phone.holdCall, false);
    document.getElementById("phone_actions_reboot").addEventListener("click", phone.reboot, false);

    // Get initial status then do it again every x seconds
    phone.getStatus(phone.updateStatus);
    window.setInterval(function () {
        phone.getStatus(phone.updateStatus)
    }, phone.update_delay);
});

chrome.runtime.onMessage.addListener(function (message) {
    console.log("number received: " + message);
    phone.startCall(message, "0");
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