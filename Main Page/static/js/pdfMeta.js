
$('#startSession').click(function(){
pageNum = 1,
pageRendering = false,
pageNumPending = null,
scale = 0.8,
canvas = document.getElementById('the-canvas'),
ctx = canvas.getContext('2d');

var url = 'example/Lec01.pdf';
PDFJS.workerSrc = " https://npmcdn.com/pdfjs-dist/build/pdf.worker.js";


PDFJS.getDocument(url).then(function(pdfDoc_) {
    console.log("Done");
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    // Initial/first page rendering
    renderPage(pageNum);
    });
document.getElementById('prev').addEventListener('click', onPrevPage);
document.getElementById('next').addEventListener('click', onNextPage);

    
function getMeta(){
    //returns a promise to return topic and pageNum
    return pdfDoc.getPage(pageNum).then(function(page) {
        return page.getTextContent().then(function(textContent) {
        //alert( "Topic: "+textContent.items[0].str+", Page: "+ String(pageNum))
        var metadata= {topic: textContent.items[0].str, page: String(pageNum)};
        return metadata;
      });
    });
};

function renderPage(num) {
pageRendering = true;
// Using promise to fetch the page
pdfDoc.getPage(num).then(function(page) {
var viewport = page.getViewport(scale);
canvas.height = viewport.height;
canvas.width = viewport.width;

// Render PDF page into canvas context
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
function onPrevPage() {
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
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
// document.getElementById('next').addEventListener('click', onNextPage);

})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ;

