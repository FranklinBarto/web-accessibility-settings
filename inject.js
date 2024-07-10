// Create a new button element
var button = document.createElement('button');

// Set the button's id and style (optional)
button.id = 'customButton';
button.style.border = 'none';
button.style.background = 'transparent';
button.style.cursor = 'pointer';

// Create an image element
var img = document.createElement('img');
img.src = 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?q=80&w=1612&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'// Replace with the actual URL of your image
img.alt = 'Button Image';
img.style.width = '50px';  // Set desired width
img.style.height = '50px'; // Set desired height

// Append the image to the button
button.appendChild(img);

// Add an event listener to the button (optional)
button.addEventListener('click', function() {
    alert('Button clicked!');
});

// Append the button to the body (or any other desired element)
document.body.appendChild(button);

