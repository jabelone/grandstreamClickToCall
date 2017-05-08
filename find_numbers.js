var anchors = document.getElementsByTagName("a");

for(var i = 0, len = anchors.length; i < len; i++) {
    if(anchors[i].getAttribute("href").startsWith("tel:")) {
        var tel = anchors[i].getAttribute("href").split(":").pop();
        console.log("Grandstream CTC: Replaced " + tel);
        anchors[i].setAttribute("href", "#");

        anchors[i].onclick = function () {
            console.log("Grandstream CTC: Calling " + tel);
            chrome.runtime.sendMessage(tel);
        }
    }
}