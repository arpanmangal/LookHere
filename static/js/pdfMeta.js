var pdfDoc;
var scale;
$('#startSession').click(function(){
pageNum = 1;
pageRendering = false;
pageNumPending = null;
// scale = 0.8,
scale = 1;
canvas2 = document.getElementById('the-canvas');
ctx = canvas2.getContext('2d');

var url = 'example/Lec01.pdf';
PDFJS.workerSrc = " https://npmcdn.com/pdfjs-dist/build/pdf.worker.js";
var files=document.getElementById('inputFile').files;
var pdfFile=files[0];
console.log(files);
console.log(pdfFile);

function readFileAsArrayBuffer(file, success, error) {
    var fr = new FileReader();
    fr.addEventListener('error', error, false);
    if (fr.readAsBinaryString) {
        fr.addEventListener('load', function () {
            var string = this.resultString != null ? this.resultString : this.result;
            var result = new Uint8Array(string.length);
            for (var i = 0; i < string.length; i++) {
                result[i] = string.charCodeAt(i);
            }
            success(result.buffer);
        }, false);
        return fr.readAsBinaryString(file);
    } else {
        fr.addEventListener('load', function () {
            success(this.result);
        }, false);
        return fr.readAsArrayBuffer(file);
    }
}

readFileAsArrayBuffer(pdfFile, function(data) {
    var pdfData = new Uint8Array(data);
    var docInitParams = {data: pdfData};
    //output.value = JSON.stringify(array, null, '  ');
    // window.setTimeout(ReadFile, 1000);
    
    PDFJS.getDocument(docInitParams).then(function(pdfDoc_) {
    console.log("Done");
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    // Initial/first page rendering
    renderPage(pageNum);
    });

}, function (e) {
    console.error(e);
});


document.getElementById('prev').addEventListener('click', onPrevPage);
document.getElementById('next').addEventListener('click', onNextPage);
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);

    

    function renderPage(num) {
pageRendering = true;
// Using promise to fetch the page
pdfDoc.getPage(num).then(function(page) {
var viewport = page.getViewport(scale);
    canvas2.height = viewport.height;
    canvas2.width = viewport.width;
    console.log(canvas2.height);
    console.log(canvas2.width);

// Render PDF page into canvas2 context
var renderContext = {
    canvasContext: ctx,
    viewport: viewport
};
var renderTask = page.render(renderContext);

// Wait for rendering to finish
renderTask.promise.then(function() {
    pageRendering = false;
    if (pageNumPending !== null) {
    // New page rendering is pending
    renderPage(pageNumPending);
    pageNumPending = null;
    }
});
});

// Update page counters
document.getElementById('page_num').textContent = num;
}
/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage(e) {
    e.preventDefault();
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
// document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage(e) {
    e.preventDefault();
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

function zoomIn(e) {
    e.preventDefault();
    // var original=$('#pdfDiv').css("width");
    var original=$('#pdfDiv').width();
    $( "#pdfDiv" ).animate({
        width: 1.05*original
    }, 700 );
    // $('#pdfDiv').width(1.1*original);
    // console.log(original);
    // console.log(original.type);
    // scale+=0.1
}

function zoomOut(e) {
    e.preventDefault();
    var original=$('#pdfDiv').width();
    $( "#pdfDiv" ).animate({
        width: 0.95*original
    }, 700 );
    // scale-=0.1
}
// document.getElementById('next').addEventListener('click', onNextPage);

})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ;

