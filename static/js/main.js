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
    var mode=null;


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
    
var data;
    function startup() {
        data=true;
    $('#wholeContainer').show();
    video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        // photo = document.getElementById('photo');
        // startButton = document.getElementById('startButton');
        para=document.getElementById('timestamp');


        //alert("hi");
        navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia ||
            navigator.MediaDevices.getUserMedia );

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
                if (err == 'NotAllowedError: The request is not allowed by the user agent or the platform in the current context.') {
                    alert("You need to permit webcam to take video in order to generate the statistics.\n You are advised to refresh if you want to see the statistics.");
                } else {
                    alert("Some error occured while taking video from your webcam.");
                }
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

        // startButton.addEventListener('click', function(ev){
            startObservation();
            // ev.preventDefault();
        // }, false);

        clearPhoto();

        setTimeout(takePicture,1000 );
        if (mode=='video'){
            // console.log( $('#videosrc').val());
            changeVideoSource($('#videosrc').val());
            // return;
        }
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
    function getCleanTimeStamp(){
        var x=getTimeStamp();
        var ans;
        x=parseInt(x);
        if(x<60) ans=String(x% 60)+"s";
        else ans=String(parseInt(x/60))+"m " + String(x%60) +"s";
        console.log(ans);
        return ans;
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    document.getElementById("startSession").addEventListener('click', startup, false);
    document.getElementById("stopSession").addEventListener('click',showResults,false)
    document.getElementById("dismissButton").addEventListener('click',dismissFunction,false)
    // Functions from detectFaces.html

    function dismissFunction() {
        data=true;
    }

    function openFile(file) {
        var input = file.target;

        var reader = new FileReader();
        reader.onload = function(){
            var dataURL = reader.result;
            processImage(dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }

    function getMeta(){
        //returns a promise to return topic and pageNum
        if(mode=='video') {
            return new Promise((resolve,reject)=> {
                resolve( {} );
            }) ;
        }
        return pdfDoc.getPage(pageNum).then(function(page) {
            return page.getTextContent().then(function(textContent) {
                //alert( "Topic: "+textContent.items[0].str+", Page: "+ String(pageNum))
                return {topic: textContent.items[0].str, page: String(pageNum)};
            });
        });
    }

    function passFace(file) {
        //var image=makeblob(file);
        // var image = new Image();
        // image.id = "pic";
        // image.src = file;
        // console.log(image);
        getMeta().then(function(metaData){
            if(metaData==undefined){
                metaData.page='Undefined';
                metaData.topic='Undefined';
                console.log("Not OK");
            }
            else{
                console.log("OK");
                metaData.page='';
                metaData.topic=''
            }
            if (mode=='pdf') description="Slide "+metaData.page+" ("+metaData.topic+") ";
            else description=getCleanTimeStamp();
            console.log(description);
            processFaces(file, getTimeStamp(), description,function(obj) {
                console.log(obj);

                var data = obj.data,
                    totalRoll = 0,
                    totalYaw = 0,
                    details = null;
                
                if (data == null || data.length == 0); // do nothing;
                else {
                    // calculate totalYaw and totalRoll in absolute values
                    for (let i = 0; i < data.length; i++) {
                        var faceAtt = data[i].faceAttributes;

                        // Error handling
                        if (faceAtt == null || !('headPose' in faceAtt)) {
                            // we did not receive the required data
                            // do nothing
                        } else {
                            details = faceAtt.headPose;
                            totalRoll += Math.abs(details.roll.map(-20, 20, -5, 5));
                            totalYaw += Math.abs(details.yaw.map(-20, 20, -5, 5));
                        }
                    }                    
                }

                // plotting obj
                if (details != null) {
                    var atten = (totalRoll + totalYaw) / data.length;

                    plot(obj.timestamp, atten, obj.description);
                }
            });
        });
        
    }

    function changeVideoSource(src) {
        pdfDiv=document.getElementById('pdfDiv');
        // pdfDiv.innerHTML='<div class="camera">' +
        //     '<video id="video2" class="videoFeed" src="'+src+'" autoplay="autoplay" controls="controls">Video stream not available.</video>' +
        //     '</div>';

        // pdfDiv.innerHTML='<div class="camera">' +
        //     '<iframe id="video2" class="videoFeed" src="'+src+'" autoplay="autoplay" controls="controls">Video stream not available.</iframe>' +
        //     '</div>';
        pdfDiv.innerHTML=src;
        $('iframe').height('100%');
        $('iframe').width("100%");
        // video.src=src;
        // video.play();
        // vid=document.getElementById('video2');
        // vid.play();
    }
