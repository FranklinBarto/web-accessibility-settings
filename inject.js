// Create and inject the component into the document
function createAccessibilityComponent() {
  const container = document.createElement("div");
  container.className = "accessibilityContainer";

  const menu = document.createElement("div");
  menu.className = "accessibilityMenu";
  menu.style.display = "none";

  const buttons = [
    { text: "Bigger Text", id: "btn1" },
    { text: "Light Contrast", id: "btn2" },
    { text: "Dark Contrast", id: "btn3" },
    { text: "Remove images/video", id: "btn4" },
  ];

  buttons.forEach((btn) => {
    const button = document.createElement("button");
    button.textContent = btn.text;
    button.id = btn.id;
    menu.appendChild(button);
  });

  const toggleButton = document.createElement("button");
  const img = document.createElement("img");
  img.src =
    "https://franklinbarto.github.io/web-disability-settings/accessibility-icon.svg";
  img.alt = "Accessibility";
  toggleButton.appendChild(img);

  container.appendChild(menu);
  container.appendChild(toggleButton);
  document.body.appendChild(container);

  return {
    container,
    menu,
    buttons: {
      btn1: document.getElementById("btn1"),
      btn2: document.getElementById("btn2"),
      btn3: document.getElementById("btn3"),
      btn4: document.getElementById("btn4"),
    },
    toggleButton,
  };
}

function getCookie(key) {
  const match = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return match ? match.pop() : "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function updateStyles(accessibilityStyles, active, elements, textSize) {
  document.body.className = accessibilityStyles.join(" ");
  setCookie("KSA_accessibility", accessibilityStyles.join(" "), 2);

  Object.keys(active).forEach((key) => {
    if (active[key]) {
      elements.buttons[key].classList.add("active");
    } else {
      elements.buttons[key].classList.remove("active");
    }
  });

  if (textSize !== undefined) {
    elements.buttons.btn1.textContent = `Bigger Text ${textSize}/4`;
  }
}

function Accessibility() {
  const elements = createAccessibilityComponent();
  let open = false;
  let active = { btn1: false, btn2: false, btn3: false, btn4: false };
  let textSize;
  let accessibilityStyles = [];

  function toggleMenu() {
    open = !open;
    elements.menu.style.display = open ? "block" : "none";
  }

  function removeAssets() {
    if (accessibilityStyles.includes("accessRemoveAssets")) {
      accessibilityStyles = accessibilityStyles.filter(
        (style) => style !== "accessRemoveAssets"
      );
      active.btn4 = false;
    } else {
      accessibilityStyles.push("accessRemoveAssets");
      active.btn4 = true;
    }
    updateStyles(accessibilityStyles, active, elements, textSize);
  }

  function enlargeText() {
    const currentSize = accessibilityStyles.find((style) =>
      style.startsWith("accessTextSize")
    );
    if (currentSize) {
      let size = parseInt(currentSize.slice(-1));
      size++;
      if (size > 4) {
        accessibilityStyles = accessibilityStyles.filter(
          (style) => !style.startsWith("accessTextSize")
        );
        active.btn1 = false;
        textSize = undefined;
      } else {
        accessibilityStyles = accessibilityStyles.filter(
          (style) => !style.startsWith("accessTextSize")
        );
        accessibilityStyles.push(`accessTextSize${size}`);
        active.btn1 = true;
        textSize = size;
      }
    } else {
      accessibilityStyles.push("accessTextSize1");
      active.btn1 = true;
      textSize = 1;
    }
    updateStyles(accessibilityStyles, active, elements, textSize);
  }

  function toggleContrast(type) {
    accessibilityStyles = accessibilityStyles.filter(
      (style) => !style.includes("Contrast")
    );
    if (type === "light" && !active.btn2) {
      accessibilityStyles.push("accessLightContrast");
      active.btn2 = true;
      active.btn3 = false;
    } else if (type === "dark" && !active.btn3) {
      accessibilityStyles.push("accessDarkContrast");
      active.btn2 = false;
      active.btn3 = true;
    } else {
      active.btn2 = false;
      active.btn3 = false;
    }
    updateStyles(accessibilityStyles, active, elements, textSize);
  }

  // Event listeners
  elements.toggleButton.addEventListener("click", toggleMenu);
  elements.buttons.btn1.addEventListener("click", enlargeText);
  elements.buttons.btn2.addEventListener("click", () =>
    toggleContrast("light")
  );
  elements.buttons.btn3.addEventListener("click", () => toggleContrast("dark"));
  elements.buttons.btn4.addEventListener("click", removeAssets);

  // Initial setup
  const cookieValue = getCookie("KSA_accessibility");
  if (cookieValue) {
    accessibilityStyles = cookieValue.split(" ");
    active = {
      btn1: accessibilityStyles.some((style) =>
        style.startsWith("accessTextSize")
      ),
      btn2: accessibilityStyles.includes("accessLightContrast"),
      btn3: accessibilityStyles.includes("accessDarkContrast"),
      btn4: accessibilityStyles.includes("accessRemoveAssets"),
    };
    const textSizeStyle = accessibilityStyles.find((style) =>
      style.startsWith("accessTextSize")
    );
    if (textSizeStyle) {
      textSize = parseInt(textSizeStyle.slice(-1));
    }
    updateStyles(accessibilityStyles, active, elements, textSize);
  }
}

// Initialize the component
Accessibility();

// Inject CSS
function injectCSS(cssContent) {
  const style = document.createElement("style");
  style.textContent = cssContent;
  document.head.appendChild(style);
}

// CSS content as a string
const cssContent = `
    /* Remove Assets */
        .accessRemoveAssets img{
            display: none !important;
        }

        .accessRemoveAssets video{
            display: none !important;
        }

        .accessRemoveAssets ::after{
            display: none !important;
        }

        .accessRemoveAssets ::before{
            display: none !important;
        }

        .accessRemoveAssets .img{
            display: none !important;
        }

        .accessRemoveAssets .img-fluid{
            display: none !important;
        }

        /* Dark contrast */
        .accessDarkContrast div{
            background-color: black !important;
        }
        .accessDarkContrast section{
            background-color: black !important;
        }
        .accessDarkContrast nav{
            background-color: black !important;
        }
        .accessDarkContrast main{
            background-color: black !important;
        }
        .accessDarkContrast header{
            background-color: black !important;
        }
        .accessDarkContrast footer{
            background-color: black !important;
        }
        .accessDarkContrast time{
            background-color: black !important;
        }
        .accessDarkContrast h1{
            color: white !important;
        }
        .accessDarkContrast h2{
            color: white !important;
        }
        .accessDarkContrast h3{
            color: white !important;
        }
        .accessDarkContrast h4{
            color: white !important;
        }
        .accessDarkContrast h5{
            color: white !important;
        }
        .accessDarkContrast h6{
            color: white !important;
        }
        .accessDarkContrast span{
            color: white !important;
        }
        .accessDarkContrast p{
            color: white !important;
        }
        .accessDarkContrast ul{
            color: white !important;
        }
        .accessDarkContrast ol{
            color: white !important;
        }
        .accessDarkContrast button{
            color: white !important;
        }
        .accessDarkContrast .nav-link{
            color: white !important;
        }
        .accessDarkContrast a{
            color: white !important;
        }

        /* Light contrast */
        .accessLightContrast div{
            background-color: white !important;
        }
        .accessLightContrast section{
            background-color: white !important;
        }
        .accessLightContrast nav{
            background-color: white !important;
        }
        .accessLightContrast main{
            background-color: white !important;
        }
        .accessLightContrast header{
            background-color: white !important;
        }
        .accessLightContrast footer{
            background-color: white !important;
        }
        .accessLightContrast time{
            background-color: white !important;
        }
        .accessLightContrast h1{
            color: black !important;
        }
        .accessLightContrast h2{
            color: black !important;
        }
        .accessLightContrast h3{
            color: black !important;
        }
        .accessLightContrast h4{
            color: black !important;
        }
        .accessLightContrast h5{
            color: black !important;
        }
        .accessLightContrast h6{
            color: black !important;
        }
        .accessLightContrast span{
            color: black !important;
        }
        .accessLightContrast p{
            color: black !important;
        }
        .accessLightContrast ul{
            color: black !important;
        }
        .accessLightContrast ol{
            color: black !important;
        }
        .accessLightContrast button{
            color: black !important;
        }
        .accessLightContrast .nav-link{
            color: black !important;
        }
        .accessLightContrast a{
            color: black !important;
        }

        /* Font size */
        /* first size */
        .accessTextSize1 h1
        .accessTextSize1 h2,
        .accessTextSize1 h3,
        .accessTextSize1 p,
        .accessTextSize1 span,
        .accessTextSize1 a
        {
            font-size: medium !important;
        }

        .accessTextSize2 h1
        .accessTextSize2 h2,
        .accessTextSize2 h3,
        .accessTextSize2 p,
        .accessTextSize2 span,
        .accessTextSize2 a
        {
            font-size: large !important;

        }
        .accessTextSize3 h1
        .accessTextSize3 h2,
        .accessTextSize3 h3,
        .accessTextSize3 p,
        .accessTextSize3 span,
        .accessTextSize3 a{
            font-size: x-large !important;
        }

        .accessTextSize4 h1
        .accessTextSize4 h2,
        .accessTextSize4 h3,
        .accessTextSize4 p,
        .accessTextSize4 span,
        .accessTextSize4 a{
            font-size: xx-large !important;
        }

        /* Access panel */
        .accessibilityContainer{
            position: fixed;
            display: flex;
            flex-direction: column;
            bottom: 10%;
            right: 35px;
            width: auto;
            height: auto;
            z-index: 1000;
            background: none !important;
            background-color: none !important;
            background-image: none !important;
        }

        .accessibilityContainer >button{
            border: none;
            background: none !important;
            outline: none;
            transition: 200ms;
            transform: scale(1);
            width: 65px;
            margin: 10px 0 10px auto
        }

        .accessibilityContainer >button:hover{
            transform: scale(1.1);
        }

        .accessibilityContainer >button:focus{
            outline: none;
        }

        .accessibilityContainer >button img{
            width: 100%;
            display: flex !important;
            outline: none;
        }

        .accessibilityContainer .accessibilityMenu{
            display: flex;
            flex-direction: column;
            padding: 10px;
            background: rgba(211, 212, 224, 0.9);
            width: 100%;
            border-radius: 20px;
            border: 2px solid rgb(141, 173, 201);
        }

        .accessibilityContainer .accessibilityMenu button{
            width: 85%;
            background: #f2f2f9;
            border: 2px solid #0C164F;
            border-radius: 5px;
            padding: 10px;
            margin: 10px auto;
            color: #0C164F;
            font-weight: bolder;
        }

        .accessibilityContainer .accessibilityMenu button.active{
            background: #0C164F;
            color: white !important;    
        } 
  `;

// Inject the CSS
injectCSS(cssContent);
