//select the canvas: help to draw on page
let canvas = document.querySelector("#board");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//draw on the canvas
//canvas.getContext("2d") holds all the methods to draw on the canvas usig 2d rendiring
let tool = canvas.getContext("2d");

// optimal to get element and add event listner on it :-use
// toolArr to get all the element using same class name
let toolArr = document.querySelectorAll(".tool");
let currentTool = "pencil";

for (let i = 0; i < toolArr.length; i++) {
  toolArr[i].addEventListener("click", function () {
    let toolName = toolArr[i].getAttribute("id");
    if (toolName == "pencil") {
      currentTool = "pencil";
      tool.strokeStyle = "black";
    } else if (toolName == "eraser") {
      //implement erase functionality
      currentTool = "eraser";
      tool.strokeStyle = "white";
      tool.lineWidth = 10;
    } else if (toolName == "sticky") {
      currentTool = "sticky";
      createSticky();
    } else if (toolName == "upload") {
      currentTool = "upload";
      uploadFile();
    } else if (toolName == "download") {
      currentTool = "download";
      dowloadFile();
    } else if (toolName == "undo") {
      currentTool = "undo";
      undoFN();
    } else if (toolName == "redo") {
      currentTool = "redo";
      redoFN();
    }
  });
}

//------How to draw line one point to another point
// mouse:canvas -> where we press the mouse
// mousemove:canvas -> where we lift the mouse
// in between these two points we want to  draw
//mousedown, mousemove, mouseup
// isDrawing is a flag to check whether we are drawing or not

//------------------------Pencil Implementation--------------------------------
let undoStack = [];
let redoStack = [];
let isDrawing = false;
canvas.addEventListener("mousedown", function (e) {
  //mousedown gives the x and y coordinate where we press the mouse
  let sidx = e.clientX;
  let sidy = e.clientY;
  let toolBarHeight = getYDelta();
  tool.beginPath();
  tool.moveTo(sidx, sidy - toolBarHeight);
  isDrawing = true;

  let pointDesc = {
    x: sidx,
    y: sidy - toolBarHeight,
    desc: "md",
  };
  undoStack.push(pointDesc);
});

canvas.addEventListener("mousemove", function (e) {
  if (!isDrawing) {
    return;
  }
  let eidx = e.clientX;
  let eidy = e.clientY;
  let toolBarHeight = getYDelta();
  tool.lineTo(eidx, eidy - toolBarHeight);
  tool.stroke();

  let pointDesc = {
    x: eidx,
    y: eidy - toolBarHeight,
    desc: "mm",
  };
  undoStack.push(pointDesc);
});

canvas.addEventListener("mouseup", function (e) {
  //mouseup gives the x and y coordinate where we lift the mouse
  isDrawing = false;
});

let toolBar = document.querySelector(".tool-bar");
function getYDelta() {
  // it gives height of any html element in pixel viewport height
  let toolBarHeight = toolBar.getBoundingClientRect().height;
  // return toolBarHeight;
  return toolBarHeight;
}

//------------------------Sticky Note Implementation--------------------------------
function createOuterShell(textArea) {
  let stickyDiv = document.createElement("div");
  stickyDiv.setAttribute("class", "sticky");
  let navDiv = document.createElement("div");
  navDiv.setAttribute("class", "nav");
  let closeDiv = document.createElement("div");
  closeDiv.setAttribute("class", "close");
  closeDiv.innerHTML = "X";
  let minimizeDiv = document.createElement("div");
  minimizeDiv.setAttribute("class", "minimize");
  minimizeDiv.innerHTML = "min";
  // let textArea = document.createElement("textarea");

  stickyDiv.appendChild(navDiv);
  navDiv.appendChild(closeDiv);
  navDiv.appendChild(minimizeDiv);

  //add it to the body
  document.body.appendChild(stickyDiv);

  // close the sticky note

  closeDiv.addEventListener("click", function () {
    stickyDiv.remove();
  });

  // minimize the sticky note
  let isMinimized = false;
  minimizeDiv.addEventListener("click", function () {
    if (isMinimized) {
      // display
      textArea.style.display = "block";
    } else {
      // disappear
      textArea.style.display = "none";
    }
    isMinimized = !isMinimized;
  });

  //move the sticky note
  let isStickyDown = false;
  // let initialX;
  // let initialY;

  navDiv.addEventListener("mousedown", function (e) {
    initialX = e.clientX;
    initialY = e.clientY;
    // console.log("mousedown"+initialX+" "+initialY);
    isStickyDown = true;
  });

  navDiv.addEventListener("mousemove", function (e) {
    if (isStickyDown == true) {
      // console.log("mousemove" +e.clientX+" "+e.clientY);
      let finalX = e.clientX;
      let finalY = e.clientY;

      let dx = finalX - initialX;
      let dy = finalY - initialY;
      let { top, left } = stickyDiv.getBoundingClientRect();
      stickyDiv.style.top = top + dy + "px";
      stickyDiv.style.left = left + dx + "px";
      initialX = e.clientX;
      initialY = e.clientY;
    }
  });

  navDiv.addEventListener("mouseup", function () {
    isStickyDown = false;
  });

  return stickyDiv;
}

function createSticky() {
  let textArea = document.createElement("textarea");
  let stickyDiv = createOuterShell(textArea);

  textArea.setAttribute("class", "text-area");
  stickyDiv.appendChild(textArea);
}

// ----- Upload File Implementation--------------------------------

// console.log("upload file");
// create input element
// click on input element inside image
//input tag take file and we use it
// add UI
let inputTag = document.querySelector(".input-tag");
function uploadFile() {
  inputTag.click();

  //readd file
  inputTag.addEventListener("change", function (e) {
    let data = inputTag.files[0];
    //create URL of image
    let url = URL.createObjectURL(data);
    //create image tag
    let img = document.createElement("img");
    img.setAttribute("class", "upload-img");
    img.src = url;
    img.height = 100;

    let stickyDiv = createOuterShell(img);
    stickyDiv.appendChild(img);
  });
}

// ------------------------Download File Implementation--------------------------------

function dowloadFile() {
  //let take anchor tag
  let a = document.createElement("a");
  //give name to file which will be dowlaod
  a.download = "file.png";
  // convert canvas page into url
  a.href = canvas.toDataURL();
  a.click();
}

// -- ------------------------Undo and Redo Implementation--------------------------------
// store point
// remove last point
//clean
//reDraw
function undoFN() {
  if (undoStack.length > 0) {
    // Remove the last point
    // undoStack.pop();
    redoStack.push(undoStack.pop());
    // Clear the canvas
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw the canvas
    for (let i = 0; i < undoStack.length; i++) {
      let { x, y, desc } = undoStack[i];
      if (desc === "md") {
        tool.beginPath();
        tool.moveTo(x, y);
      } else if (desc === "mm") {
        tool.lineTo(x, y);
        tool.stroke();
      }
    }
  }
}

function redoFN() {
  // Implement redo functionality
  if(redoStack.length>0){
    let {x,y,desc} = redoStack.pop();
    undoStack.push({x,y,desc});
    if(desc === "md"){
      tool.beginPath();
      tool.moveTo(x,y);
    }else if(desc === "mm"){
      tool.lineTo(x,y);
      tool.stroke();
    }
  }
}

// Undo = [1,2,3,4,5,6,7,8,9,10];
// when we click on undo it remove last one ele from 
// undo Array. and push it to redo array to use redo function


// -----------------------------------Real Time-------------------------
let crossBtn = document.querySelector(".crossBtn");
let toolBarOption = document.querySelector(".writingTool");

if (crossBtn && toolBarOption) {
  toolBarOption.style.transition = "opacity 2s";
  toolBarOption.style.opacity = "1";

  crossBtn.addEventListener("click", () => {
    if (toolBarOption.style.opacity === "1") {
      toolBarOption.style.opacity = "0";
      setTimeout(() => toolBarOption.style.display = "none", 500);
    } else {
      toolBarOption.style.display = "flex";
      setTimeout(() => toolBarOption.style.opacity = "1", 10);
    }
  });
}
