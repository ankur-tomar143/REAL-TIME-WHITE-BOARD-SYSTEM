# REAL-TIME-WHITE-BOARD-SYSTEM

I built a Real-Time Whiteboard that allows multiple users to draw, erase, upload images, add sticky notes, and download their work collaboratively. The whiteboard supports freehand drawing, undo-redo actions, and real-time updates across users using WebSockets. This tool is highly useful for brainstorming, teaching sessions, and remote collaboration.

# Key Features:
Freeform Drawing: Enabled smooth, real-time drawing in all directions using mousedown, mousemove, and mouseup events. The drawing is rendered using the Canvas API with moveTo, lineTo, and stroke() methods.

Eraser Tool: Implemented the eraser by simulating a "white pencil" — setting strokeStyle to white and increasing lineWidth for effective erasing.

Sticky Notes: Users can create sticky notes dynamically with minimize and close options. These can be dragged freely using mouse events (mousedown, mousemove, and mouseup), updating the top and left styles of the note.

Image Upload: Added an element to allow users to upload images. The image is displayed by creating a URL via URL.createObjectURL() and embedding it inside a draggable sticky note.

Download Canvas: Implemented a download button that uses canvas.toDataURL() to convert the drawing into a downloadable image. The link is triggered using an tag with the download attribute.

Undo/Redo Functionality: Used two stacks (undoStack, redoStack) to track drawing actions. On undo, the last action is popped from undoStack and pushed to redoStack, and vice versa for redo. The canvas is redrawn after each action.
