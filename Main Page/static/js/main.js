(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var Xd = [1, 2, 3, 4, 5];
    var Yd = [10, 9, 8, 7, 6];
    var XLabel = "test";
    plot(Xd, Yd, XLabel);

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

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
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
        photo.setAttribute('src', data);
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
            photo.setAttribute('src', data);

            var clickMarker=new Date();
            para.innerHTML= (clickMarker.getTime() - startTime) / 1000 ;
            para.append(" seconds");

            passFace(data);
        } else {
            clearPhoto();
        }
    }

    function startObservation() {
        setInterval(takePicture,1000 );
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
    function makeblob (dataURL) {
        var BASE64_MARKER = ';base64,';

        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
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
    function processImage(dataURL) {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        var subscriptionKey = "4a8cf0860f0340cba3ec2b2aa7b4cab5";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect";

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "headPose"
        };

        // Display the image.
        document.querySelector("#sourceImage").src = document.getElementById("inputImage").value;

        // file=fopen("./test.jpg",0);
        // str = fread(file,flength(file));


        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            type: 'POST',
            processData: false,
            contentType: 'application/octet-stream',


            // Request headers.
            beforeSend: function(xhrObj){
                // xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            // Request body.
            // data: '{"url": ' + '"' + sourceImageUrl + '"}'
            data: makeblob(dataURL)

        })

            .done(function(data) {
                // Show formatted JSON on webpage.
                $("#responseTextArea").val(JSON.stringify(data, null, 2));
            })

            .fail(function(jqXHR, textStatus, errorThrown) {
                // Display error message.
                var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });
    }

    function passFace(file) {
        var image=makeblob(file);
        // var image = new Image();
        // image.id = "pic";
        // image.src = file;
        // console.log(image);
        processFaces(image, getTimeStamp(), function(obj) {
            console.log(obj);
        });
    }
})();
