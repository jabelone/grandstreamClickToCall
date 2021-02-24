chrome.storage.sync.get(['scrape','prefix'], function(result){
	//console.log("Result: " + result.scrape);
	var prefix = result.prefix;
	if (result.scrape == 'yes') {
		//Set regex patern for US phone numbers, will match (xxx)xxx-xxxx xxx-xxx-xxxx or xxx.xxx.xxxx
		var regex = /((\(\d{3}\) ?)(?!([^<]*>)|(((?!<a).)*<\/a>))|(\d{3}-))?\d{3}-\d{4}(?!([^<]*>)|(((?!<a).)*<\/a>))|(\d{3}\.)?\d{3}\.\d{4}(?!([^<]*>)|(((?!<a).)*<\/a>))/g; 
		//store web page
		var text = $("body").html();

		var textNodes = $("body").find('*').contents().filter(function(){
			if(regex.test(this.nodeValue)){
				//create seperate string of Node when phone numbers detected to allow clean manipulation
				strThisNode = this.nodeValue;
				//Get parent node also to avoid duplicate nested links being created
				strParent = this.parentNode;
				//Check if parent node if already a tel link, if not, modify node
				if(String(strParent).match(/tel/g) != "tel") {
					//start by clearing the node so that we can rewrite it
					this.nodeValue = "";
					//create array of all phone numbers found in string in case more than 1 occurence
					arrNumbers = strThisNode.match(regex);
					//process string based on number of phone numbers found
					for(var a = 0, aLen = arrNumbers.length; a < aLen; a++ ) {
						//Create Array of text not including the number detected in string
						arrNode = strThisNode.split(arrNumbers[a]);
						//Create link element for phone number found removing special characters and appending 1 for US dialing
						var anchor = document.createElement('a');
						tel = arrNumbers[a];
						tel = tel.replace(/[^0-9*]/g, '');
						tellength = tel.length;
						if(tellength == 10 ) {
							if(prefix != null) {
								tel = prefix + tel;
							}
						}
						anchor.setAttribute('href', 'tel:'+tel);
						//write the unmodifed phone number as link text
						anchor.appendChild(document.createTextNode(arrNumbers[a]));
						//get first text element as text node of text array in case there was text before number in original node
						var t = document.createTextNode((arrNode[0]));
						//Write text to end of existing node
						this.parentNode.appendChild(t);
						//write assembled achor to end of existing node
						this.parentNode.appendChild(anchor);
						//remove what was just written to existing node from string being used for processing to avoid duplication
						strThisNode = strThisNode.replace(arrNode[0], '');
						strThisNode = strThisNode.replace(arrNumbers[a], '');
												
					}
					// Write remaining string as text object to node.
					var t = document.createTextNode(strThisNode);
					this.parentNode.appendChild(t);
				}
			}	
		})
	
	}


	//Get and store all links on page to array
	var anchors = document.getElementsByTagName("a");

	for(var i = 0, len = anchors.length; i < len; i++) {
		//check each link to see if it is a tel: link
		if(anchors[i].getAttribute("href") != null) {
			if(anchors[i].getAttribute("href").startsWith("tel:")) {
				//if it is a tel: link, get destination and store as string
				var tel = anchors[i].getAttribute("href").split(":").pop();
				//overwrite link to self anchor     
				anchors[i].setAttribute("href", "#");		
				//remove everything except for numbers and * from tel: destination <Q5>
				tel = tel.replace(/[^0-9*]/g, '');
				//determine length of tel number string <Q5>
				tellength = tel.length;
				// this will work for US only - if 10 digit number add 1 prefix. Issue was occuring for numbers beginning with conflicting prefixes on platform. <Q5>
				if(tellength == 10 ) {
					if(prefix != null) {
						tel = prefix + tel;
					}
				}
				//Set class attribute of tel links to be the number in order to access when clicked <Q5>
				anchors[i].setAttribute("class", tel);  
			} 	
		}
	}

	//When any link is clicked send phonenumber stored as class to background <Q5>
	$('a').click(function(){
		//console.log("Mousedown");
		//Get the class attribute of the link and store as toDial number. <Q5>
		toDial = ($(this).attr('class'));
		//Check to make sure that the toDial value is a valid number, or number beginning with *. If so send to background to send to phone. <Q5>
		if (toDial.match(/^\*\d+$/) || toDial.match(/^-?\d+$/)) {
			//console.log("class is number, dialing "+toDial);
			chrome.runtime.sendMessage(toDial);
		}
	});

});
