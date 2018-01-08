$(document).ready(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    // var Xd = [1, 2, 3, 4, 5];
    // var Yd = [1000000, 1000001, 1000002, 1000003, 1000004];
    // var XLabel = "test";
    // plot(Xd, Yd,XLabel,['a','b','c','d','e']);

    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    var startMarker = new Date();
    var startTime=startMarker.getTime();
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var para=null;
    var startButton = null;


// Disable workers to avoid yet another cross-origin issue (workers need
// the URL of the script to be loaded, and dynamically loading a cross-origin
// script does not work).
// PDFJS.disableWorker = true;

// The workerSrc property shall be specified.
// PDFJS.workerSrc = "../lib/pdfjs-dist/build/pdf.worker.js";

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
    

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        // photo = document.getElementById('photo');
        startButton = document.getElementById('startButton');
        para=document.getElementById('timestamp');


        //alert("hi");
        navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia(
            {
                video: true,
                audio: false
            },
            function(stream) {
                console.log(stream);
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();
            },
            function(err) {
                console.log("An error occurred! " + err);
            }
        );

        video.addEventListener('canplay', function(){
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth/width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4/3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startButton.addEventListener('click', function(ev){
            startObservation();
            ev.preventDefault();
        }, false);

        clearPhoto();

        setTimeout(takePicture,1000 );

    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearPhoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        // photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an off screen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takePicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            // photo.setAttribute('src', data);

            var clickMarker=new Date();
            para.innerHTML= (clickMarker.getTime() - startTime) / 1000 ;
            para.append(" seconds");

            passFace(data);
        } else {
            clearPhoto();
        }
    }

    function startObservation() {
        setInterval(takePicture,3000 );
        var tempDate=new Date();
        startTime=tempDate.getTime();
    }

    function getTimeStamp(){
        var clickMarker=new Date();
        return (clickMarker.getTime() - startTime) / 1000 ;
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);

    // Functions from detectFaces.html
    
    function openFile(file) {
        var input = file.target;

        var reader = new FileReader();
        reader.onload = function(){
            var dataURL = reader.result;
            processImage(dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }
    

    function passFace(file) {
        //var image=makeblob(file);
        // var image = new Image();
        // image.id = "pic";
        // image.src = file;
        // console.log(image);
        getMeta().then(function(metaData){ 
            description="Slide "+metaData.page+" ("+metaData.topic+") ";
            console.log(description);
            processFaces(file, getTimeStamp(), description,function(obj) {
                console.log(obj);
                // plotting obj
                if (obj.data != null) {
                    var roll = (obj.data.roll.map(-20, 20, -5, 5));
                    var yaw = (obj.data.yaw.map(-30,30,-5,5));
                    var atten = (Math.abs(roll) + Math.abs(yaw)) / 2.0;

                    plot(obj.timestamp, atten, obj.description);
                }
            });
        });
        
    }

    function changeVideoSource(src) {
        video.src=src;
        video.play();
    }
});
