// Create and inject the component into the document
function createAccessibilityComponent() {
  // Create main container
  const container = document.createElement('div');
  container.className = 'accessibilityContainer';

  // Create menu
  const menu = document.createElement('div');
  menu.className = 'accessibilityMenu';
  menu.style.display = 'none';

  // Create buttons
  const buttons = [
    { text: 'Bigger Text', id: 'btn1' },
    { text: 'Light Contrast', id: 'btn2' },
    { text: 'Dark Contrast', id: 'btn3' },
    { text: 'Remove images/video', id: 'btn4' }
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.text;
    button.id = btn.id;
    menu.appendChild(button);
  });

  // Create toggle button
  const toggleButton = document.createElement('button');
  const img = document.createElement('img');
  img.src = './accessibility-icon.svg';
  img.alt = 'Accessibility';
  toggleButton.appendChild(img);

  // Append elements
  container.appendChild(menu);
  container.appendChild(toggleButton);

  // Inject into document
  document.body.appendChild(container);

  return {
    container,
    menu,
    buttons: {
      btn1: document.getElementById('btn1'),
      btn2: document.getElementById('btn2'),
      btn3: document.getElementById('btn3'),
      btn4: document.getElementById('btn4')
    },
    toggleButton
  };
}

// Main functionality
function Accessibility() {
  const elements = createAccessibilityComponent();
  let open = false;
  let active = { btn1: false, btn2: false, btn3: false, btn4: false };
  let textSize;
  let accessibilityStyles = [];

  function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function updateStyles() {
    document.body.className = accessibilityStyles.join(' ');
    setCookie("KSA_accessibility", accessibilityStyles.join(' '), 2);
  }

  function toggleMenu() {
    open = !open;
    elements.menu.style.display = open ? 'block' : 'none';
  }

  function removeAssets() {
    if (accessibilityStyles.includes("accessRemoveAssets")) {
      accessibilityStyles = accessibilityStyles.filter(style => style !== "accessRemoveAssets");
      active.btn4 = false;
    } else {
      accessibilityStyles.push("accessRemoveAssets");
      active.btn4 = true;
    }
    updateStyles();
  }

  function enlargeText() {
    const currentSize = accessibilityStyles.find(style => style.startsWith("accessTextSize"));
    if (currentSize) {
      let size = parseInt(currentSize.slice(-1));
      size++;
      if (size > 4) {
        accessibilityStyles = accessibilityStyles.filter(style => !style.startsWith("accessTextSize"));
        active.btn1 = false;
        textSize = undefined;
      } else {
        accessibilityStyles = accessibilityStyles.filter(style => !style.startsWith("accessTextSize"));
        accessibilityStyles.push(`accessTextSize${size}`);
        active.btn1 = true;
        textSize = size;
      }
    } else {
      accessibilityStyles.push("accessTextSize1");
      active.btn1 = true;
      textSize = 1;
    }
    elements.buttons.btn1.textContent = `Bigger Text ${textSize ? `${textSize}/4` : ''}`;
    updateStyles();
  }

  function toggleContrast(type) {
    accessibilityStyles = accessibilityStyles.filter(style => !style.includes("Contrast"));
    if (type === 'light' && !active.btn2) {
      accessibilityStyles.push("accessLightContrast");
      active.btn2 = true;
      active.btn3 = false;
    } else if (type === 'dark' && !active.btn3) {
      accessibilityStyles.push("accessDarkContrast");
      active.btn2 = false;
      active.btn3 = true;
    } else {
      active.btn2 = false;
      active.btn3 = false;
    }
    updateStyles();
  }

  // Event listeners
  elements.toggleButton.addEventListener('click', toggleMenu);
  elements.buttons.btn1.addEventListener('click', enlargeText);
  elements.buttons.btn2.addEventListener('click', () => toggleContrast('light'));
  elements.buttons.btn3.addEventListener('click', () => toggleContrast('dark'));
  elements.buttons.btn4.addEventListener('click', removeAssets);

  // Initial setup
  const cookieValue = getCookie("KSA_accessibility");
  if (cookieValue) {
    accessibilityStyles = cookieValue.split(' ');
    active = {
      btn1: accessibilityStyles.some(style => style.startsWith("accessTextSize")),
      btn2: accessibilityStyles.includes("accessLightContrast"),
      btn3: accessibilityStyles.includes("accessDarkContrast"),
      btn4: accessibilityStyles.includes("accessRemoveAssets")
    };
    const textSizeStyle = accessibilityStyles.find(style => style.startsWith("accessTextSize"));
    if (textSizeStyle) {
      textSize = parseInt(textSizeStyle.slice(-1));
      elements.buttons.btn1.textContent = `Bigger Text ${textSize}/4`;
    }
    updateStyles();
  }

  // Update button states
  Object.keys(active).forEach(key => {
    if (active[key]) {
      elements.buttons[key].classList.add('active');
    } else {
      elements.buttons[key].classList.remove('active');
    }
  });
}

// Initialize the component
Accessibility();
