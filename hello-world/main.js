console.log('main process working');

const sharp = require('sharp');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const {ipcMain} = require('electron');
let win;

var selectedAudio;
var selectedImages;
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath('ffprobe.exe');
var ffprobe = require('ffprobe');
module.exports = ffmpeg;
var videoshow = require('videoshow');


var options = {
    fps: 25,
    loop: 8,
    transition: true,
    transitionDuration: 2,
    videoBitrate: 2048,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
}
var createVideo = function createVideo() {

if(!selectedAudio || !selectedImages)
{
  console.log("images or audio not selected");
  return;
}
//resizeImages();
//else if (selectedImages.length > 8)
videoshow(selectedImages, options)
.audio(selectedAudio)
.subtitles('blank.txt')
.save('video.mp4')
.on('start', function(command) {
    console.log('iniciado processo ffmpeg:', command) 
    win.webContents.send('videostatus', 'preparing');
})
.on('error', function(err, stdout, stderr){
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)

})
.on('end', function (output){
    console.error('Video generated:', output);
    win.webContents.send('videostatus', 'done');
})
}
module.exports.createVideo = createVideo;

var openFile = function openFile () {
const { dialog } = require('electron');
const fs = require('fs') ;
  dialog.showOpenDialog({ filters: [

    { name: 'images', extensions: ['jpg', 'png'] }
 
   ], properties: ['multiSelections']} ,function (fileNames) {
	if(fileNames === undefined) { 
         console.log("No file selected"); 
      
      }
      else 
      {
        selectedImages = fileNames;
        console.log(selectedImages);
      }
  }); 

}

module.exports.openFile = openFile;

function resizeImages() {
  var i = 0;
  for (var img of selectedImages)
  {
    sharp(img)
  .resize(200, 300, {
    kernel: sharp.kernel.nearest,
    fit: 'contain',
    position: 'right top',
    background: { r: 255, g: 255, b: 255, alpha: 0.5 }
  })
  .toFile(i + 'output.png')
  .then(() => {
    // output.png is a 200 pixels wide and 300 pixels high image
    // containing a nearest-neighbour scaled version
    // contained within the north-east corner of a semi-transparent white canvas
  });
     img = i + 'output.png'
      i++;
}
}

//module.exports.resizeImages = resizeImages;

var openAudioFile = function openAudioFile () {
    const { dialog } = require('electron');
    const fs = require('fs') ;
      dialog.showOpenDialog({ filters: [
    
        { name: 'audio', extensions: ['mp3'] }
     
       ]} , function (fileName) {
        if(fileName === undefined) { 

             console.log("No file selected"); 
          
          }
          else 
          {
            selectedAudio = fileName.toString();
            console.log(selectedAudio);
          }
      }); 
    
    }
    
    module.exports.openAudioFile = openAudioFile;

function createWindow() {
	win = new BrowserWindow();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
	slashes: true}));
	win.on('closed', () => {
		win = null;
	})
}

app.on('ready', createWindow);



app.on('active', () => {
	if (win === null){
		createWindow()
	}
});

exports.openWindow = () => {
	let newwin = new BrowserWindow({width: 400, height: 200})
	newwin.loadURL(url.format({
		pathname: path.join(__dirname, 'example.html'),
		protocol: 'file',
	slashes: true}));
	win.on('closed', () => {
		win = null;
	})
}






