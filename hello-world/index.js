const fs = require('fs');

const remote = require('electron').remote
const main = remote.require('./main.js')
const { ipcRenderer } = require('electron');

var lyrics;
function parseInputSub()
{
	var mysubtitles = document.getElementById('subtitles').value;
	var index = 1;
	var i = 0;
	var start = 0;
	var finish = 7;
	var arrayofsub = mysubtitles.split("$");
	for(var val of arrayofsub) {
		val = index.toString() + "\r\n00:00:" + start.toString() + ",000 --> 00:00:" + finish.toString() + ",000\r\n" +  val.toString() + "\r\n";
		arrayofsub[i] = val;
		index += 1;
		start += 8;
		finish += 8;
		i += 1;
	}

	lyrics = arrayofsub.join("");
	console.log(lyrics);
}

ipcRenderer.on('videostatus', (event, message) => {
	if(message == 'done')
	{
	button1.disabled = false;
	button.disabled = false;
	button2.disabled = false;
	document.body.style.cursor='initial';
	document.getElementById("message").innerHTML="Your video is ready.";
	}
	else if(message == 'preparing')
	{
	document.getElementById("message").innerHTML="Your video is being prepared...";
	}
})




var button = document.getElementById('createvideo');
button.addEventListener('click', () => {
	button1.disabled = true;
	button.disabled = true;
	button2.disabled = true;
	document.body.style.cursor='wait';

	parseInputSub();
	fs.writeFile('blank.txt', lyrics, (err) => {  
		// throws an error, you could also catch it here
		if (err) throw err;
	  
		// success case, the file was saved
		console.log('Subtitles saved!');
	  });

	if(main.createVideo() == null)
	{
	document.body.style.cursor='initial';
	button1.disabled = false;
	button.disabled = false;
	button2.disabled = false;
	}


	
}, false)


var button1 = document.createElement('button')
button1.classList.add("myButton");
button1.textContent = 'select images'
button1.addEventListener('click', () => {
	main.openFile();
}, false)
document.body.appendChild(button1)

var button2 = document.createElement('button')
button2.classList.add("myButton");
button2.textContent = 'select an audio'
button2.addEventListener('click', () => {
	main.openAudioFile();
}, false)
document.body.appendChild(button2)

