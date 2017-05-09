# About Grandstream Click To Call (GS CTC)
GS CTC is a chrome extension that allows you to click on a phone number and send it directly to a grandstream handset to initiate a call.  It's also got many other features.

# Features
- Accept/End an incoming/current call
- Put the current call on hold
- Reboot the handset
- See current status of phone
- Type a number and send the call to the handset
- Recognise ```tel:0412345678``` links and start a call on the handset when clicked

# Installation
Download and extract the zip of this repo.
Just got to ```chrome://extensions``` in your browser. 
Enable developer options by clicking the checkmark at the top.
Click on "load unpacked extension" then select the folder where the GS CTC files are located in.
Inside the folder open "popup.js" and change the IP on line 129 to your handset (default is ```192.168.0.23```).

# Usage
Click the greeny/teal phone icon that appears in your browsers extension area.  (usually the top right)
Here you can see the IP you've set and the current status (will take a moment to update on first open)
Every 2 seconds the extension updates the status of the phone by sending it a request.
From the extensnion you can click the buttons to Accept/End/Hold a call and reboot the handset.
Please note the hold button only works during a call and the reboot button will immediately reboot the handset.

### Click To Call
Currently, the click to call feature only has limited support.  There are too many different phone formats on the web so at the moment GS CTC only suppors phone numbers inside a link ```<a href=>``` and those that start with ```tel:```.  Support for different numbers will eventually come.
To activate click to call, simply click on the link and the handset will immediately start a call.

### Starting a Call
Whenever a call is started, you'll get a chrome notification.  This confirms what number you're calling and lets you quickly cancel the call if it was started by mistake.  The notification should hang around for about 10 seconds, but you can dismiss it earlier with the "dismiss" button.

# Planned Features
- More support for different phone number formats
- User configurable options (ip, refresh rate etc) from the GUI
- Option to call selected text when right clicking on a text selection

# License
This entire project is open source.  It's available under the GNU GPL v3 or later license.  Basically, this means you can use it for whatever you want as long as you release any modifications under the same license.  (and so forth)  See the LICENSE.md file for more info.

# Contributions
If you want a new feature make an issue and I'll try to get aroud to adding it if it's possible.  If you really want to change/add something yourself go for it!  Make a pull request and I'll have a look at and approve/decline any changes.  Make sure it has been thoroughly tested and your code follows the same style/structure as the project.
