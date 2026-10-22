window.onload = function () {
  /*
    Login/Logout
  */
  updateAuthUI();
  /*
    Daily Check-in
  */
  dailyCheckIn();
  /*
    Title Responsive (create/remove elements)
  */
  responsiveTitle();
  /*
    Update countdown
  */
  initCountdown();
  /*
    Validare form
  */
  validateName();
  validateConst();
  /*
    Butonul Random
  */
  randomizer();
  /*
    login pt create character
  */
  formSubmission();
  /*
    Save character / afisarea characterului/ delete character
  */
  cardCharacters();
  /*
    INSPIRE
  */
  inspireMe();

  window.onresize = responsiveTitle;
};
/*
    Login/Logout
*/
function updateAuthUI() {
  const authSection = document.getElementById("authSection");
  if (!authSection) return;

  const user = sessionStorage.getItem("travelerName");

  if (user) {
    authSection.innerHTML = `
            <span>Welcome, Traveler ${user}!</span>
            <button id="logout-btn">Logout</button>
        `; // ce apare daca deja e logat

    document.getElementById("logout-btn").onclick = function () {
      sessionStorage.removeItem("travelerName");
      location.reload();
    }; // logout
  } else {
    authSection.innerHTML = `
            <input type="text" id="login-input" placeholder="Enter Name...">
            <button id="login-btn">Login</button>
        `;

    document.getElementById("login-btn").onclick = function () {
      const name = document.getElementById("login-input").value;

      if (name.trim().length > 2) {
        sessionStorage.setItem("travelerName", name);
        location.reload();
      } else {
        alert("Name too short!");
      }
    };
  }
}
/*
    Daily Check-in
*/
function dailyCheckIn () {
  const checkinBtn = document.getElementById("checkin-btn");

  if (checkinBtn) {
    checkResetStatus(checkinBtn); // verific starea

    setInterval(() => {
      checkResetStatus(checkinBtn);
    }, 60000); // verifica starea

    checkinBtn.onclick = function () {
      const currentUser = sessionStorage.getItem("travelerName");

      if (currentUser) {
        const now = new Date(); // timpul apesari
        const userCheckinKey = "checkin_" + currentUser;

        localStorage.setItem(userCheckinKey, now.getTime()); // salvez timoul

        alert(`Traveler ${currentUser}, you claimed 60 Primogems!`); // mesaj

        applyClaimedStyle(checkinBtn);
      }
    };
  }
}

function checkResetStatus(btn) {
  const currentUser = sessionStorage.getItem("travelerName");

  if (!currentUser) {
    btn.innerText = "Please Login First";
    btn.style.backgroundColor = "#ffffff70";
    btn.disabled = true;
    return;
  }

  const userCheckinKey = "checkin_" + currentUser;
  const lastClaim = localStorage.getItem(userCheckinKey);

  if (lastClaim) {
    const now = new Date().getTime(); // timpul
    const oneDayInMs = 24 * 60 * 60 * 1000; // secunde intr-o zi * 1000

    // verific daca a trecut o zi
    if (now - lastClaim >= oneDayInMs) {
      localStorage.removeItem(userCheckinKey);
      resetButtonStyle(btn);
    } else {
      applyClaimedStyle(btn);
    }
  } else {
    resetButtonStyle(btn); // utilizator logat pt prima data
  }
}

function applyClaimedStyle(element) {
  element.innerText = "Reward Collected";
  element.disabled = true;
  element.style.backgroundColor = "#0000005a";
  element.style.cursor = "not-allowed";
}

function resetButtonStyle(element) {
  element.innerText = "Claim Daily Reward";
  element.disabled = false;
  element.style.backgroundColor = "#ffffff70";
  element.style.cursor = "pointer";
}
/*
    Title Responsive (create/remove elements)
*/
function responsiveTitle() {
  const header = document.querySelector("header");
  const mainContent = document.getElementById("main-content");

  const desktopTitle = document.getElementById("title");
  const mobileTitle = document.getElementById("mobile-title"); // daca exista

  if (window.innerWidth < 751) {
    // MOBILE
    if (desktopTitle) {
      desktopTitle.remove();
    }

    if (!mobileTitle) {
      const newMobileTitle = document.createElement("h1");
      newMobileTitle.id = "mobile-title";
      newMobileTitle.innerText = "Genshin Impact";

      newMobileTitle.style.textAlign = "center";
      newMobileTitle.style.color = "white";
      newMobileTitle.style.marginTop = "5px";
      newMobileTitle.style.marginBottom = "20px";
      newMobileTitle.style.fontFamily = '"GenshinS", sans-serif';

      mainContent.prepend(newMobileTitle);
    }
  } else {
    // DESKTOP
    if (mobileTitle) {
      mobileTitle.remove();
    }

    if (!desktopTitle) {
      const newDesktopTitle = document.createElement("h1");
      newDesktopTitle.id = "title";
      newDesktopTitle.innerText = "Genshin Impact";

      header.prepend(newDesktopTitle);
    }
  }
}
/*
    Update countdown
*/
function initCountdown() {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const targetDate = new Date("January 14, 2026 05:00:00").getTime();

  let intervalId;
  let isPaused = false;

  function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = new Date().getTime();
    const diff = targetDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    //                             cate ms are o zi/ora/min   se ignora min/s/ms intregi
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    if (diff > 0) {
      ctx.font = "bold 70pt Genshin";
      const timeText = `${days}    ${hours}    ${minutes}   ${seconds}`;
      ctx.fillText(timeText, canvas.width / 2, canvas.height / 2);

      ctx.font = "17pt GenshinS";
      ctx.fillText("DAYS                    HOURS                   MINUTES               SECONDS", canvas.width / 2, canvas.height / 2 + 70);
      
      if (isPaused) {
        ctx.font = "12pt Genshin";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText("PAUSED - Click to Resume", canvas.width / 2, 14);
      }
    } else {
      ctx.font = "bold 55pt Genshin";
      ctx.fillText("VERSION RELEASED!", canvas.width / 2, canvas.height / 2);
    }
  }

  function start() {
    intervalId = setInterval(drawCountdown, 1000);
  }


  canvas.addEventListener('click', function(event) {
    event.stopPropagation(); 
    
    if (isPaused) {
      start();
      isPaused = false;
    } else {
      clearInterval(intervalId); 
      isPaused = true;
      drawCountdown();
    }
  });

  start();
  drawCountdown();
}

/*
Validare form
*/
function validateName() {
  const nameInput = document.getElementById("char-name");
  if (!nameInput) return;
  const regex = /^[A-Z][a-zA-Z\s]{2,}$/; // min 3 litere, incepe cu majuscula

  nameInput.addEventListener("input", (event) => {  
    const element = event.currentTarget;
    if (regex.test(element.value)) {
      element.style.border = "4px solid rgba(27, 203, 0, 0.72)";
    } else {
      element.style.border = "4px solid rgba(207, 21, 0, 0.85)";
    }
  });
}
function validateConst() {
  const constInput = document.getElementById("char-constellation");
  if (!constInput) return;
  const regex = /^[A-Z][a-zA-Z\s]{2,}$/; // min 3 litere, incepe cu majuscula

  constInput.addEventListener("input", (event) => {
    const element = event.currentTarget;
    if (regex.test(element.value)) {
      element.style.border = "4px solid rgba(27, 203, 0, 0.72)";
    } else {
      element.style.border = "4px solid rgba(207, 21, 0, 0.85)";
    }
  });
}
/*
    Butonul Random
*/
function randomizer() {
  const randomBtn = document.getElementById("randomize-btn");
  const form = document.getElementById("form");

  if (randomBtn && form) {
    randomBtn.onclick = function () {
      const names = [
        "Hazel",
        "Kai",
        "Kieran",
        "Grace",
        "Aurora",
        "Nael",
        "Wren",
        "Maren",
        "Raif",
        "Vesper"
      ];
      const constellations = [
        "Sol",
        "Calamus",
        "Fatum",
        "Emendatio",
        "Strategia",
        "Interpretatio",
        "Vallis",
        "Eleemosynae"
      ];

      // nume
      document.getElementById("char-name").value = names[Math.floor(Math.random() * names.length)];
      // constelatie
      document.getElementById("char-constellation").value = constellations[Math.floor(Math.random() * constellations.length)];

      // birthday
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const year = Math.floor(Math.random() * 41) + 1980; // 1980-2020
      document.getElementById("char-birthday").value = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      const pickRandomSelect = (id) => {
        const select = document.getElementById(id);
        const index = Math.floor(Math.random() * (select.options.length - 1)) + 1;
        select.selectedIndex = index;
      };

      pickRandomSelect("char-height");
      pickRandomSelect("char-hair-length");
      pickRandomSelect("char-element");
      pickRandomSelect("char-weapon");
      pickRandomSelect("char-nation");

      // culori
      const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
      document.getElementById("char-hair-color").value = randomColor();
      document.getElementById("char-eye-color").value = randomColor();

      // gender
      const genders = document.getElementsByName("gender");
      genders[Math.floor(Math.random() * genders.length)].checked = true;

      // rarity
      const rarities = document.getElementsByName("rarity");
      rarities[Math.floor(Math.random() * rarities.length)].checked = true;
    };
  }
}
/*
    login pt create character
*/
function formSubmission() {
  const charForm = document.getElementById("form");

  if (charForm) {
    charForm.onsubmit = function (event) {
      const currentUser = sessionStorage.getItem("travelerName");

      if (!currentUser) {
        alert("You must be logged in as a Traveler to create a character!");
        event.preventDefault();
        return;
      }

      saveCharacter();
      alert(`Character created successfully by ${currentUser}!`);
    };
  }
}
/*
    Save character / afisarea characterului/ delete character
*/
function saveCharacter() {
  const currentUser = sessionStorage.getItem("travelerName");
  if (!currentUser) return;

  const character = {
    id: Date.now(),
    name: document.getElementById("char-name").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    constellation: document.getElementById("char-constellation").value,
    birthday: document.getElementById("char-birthday").value,
    height: document.getElementById("char-height").value,
    hairColor: document.getElementById("char-hair-color").value,
    hairLength: document.getElementById("char-hair-length").value,
    eyeColor: document.getElementById("char-eye-color").value,
    element: document.getElementById("char-element").value,
    weapon: document.getElementById("char-weapon").value,
    nation: document.getElementById("char-nation").value,
    rarity: document.querySelector('input[name="rarity"]:checked').value,
    bio: document.getElementById("char-bio").value,
  };

  const userStorageKey = "characters_" + currentUser; // creez cheia pt utilizator
  // iau characterele salvate in localStorage din trecut, sau lista goala daca nu exista
  let userCharacters = JSON.parse(localStorage.getItem(userStorageKey)) || [];

  userCharacters.push(character); // pun characterul nou
  localStorage.setItem(userStorageKey, JSON.stringify(userCharacters)); // il transforma in string

  cardCharacters();
  document.getElementById("form").reset();
}

function cardCharacters() {
  const container = document.getElementById("created-characters");
  if (!container) return;

  const currentUser = sessionStorage.getItem("travelerName");
  if (!currentUser) {
    container.innerHTML = "<p>Please login to see your characters.</p>";
    return;
  }

  const userStorageKey = "characters_" + currentUser;
  const characters = JSON.parse(localStorage.getItem(userStorageKey)) || [];

  container.innerHTML = `<h3 class="colection">${currentUser}'s Character Collection</h3>`;

  if (characters.length === 0) {
    container.innerHTML += "<p>No characters created yet.</p>";
    return;
  }

  characters.forEach((char) => {
    const elementValue = char.element ? char.element.toLowerCase() : "default";
    const cssVarName = `--${elementValue}-color`;

    const rootStyles = getComputedStyle(document.documentElement); // ia tag ul html si se duce la root in css
    let visionColor = rootStyles.getPropertyValue(cssVarName).trim();

    if (!visionColor) 
      visionColor = rootStyles.getPropertyValue('--default-card-color');

    const card = document.createElement("div");
    card.classList.add("char-card");

    card.innerHTML = `
            <div class="char-card-header">
                <strong class="char-card-name" style="color: ${visionColor}">${char.name}</strong>
                <span>${char.rarity} ★</span>
            </div>
            <p class="char-const">"${char.constellation || "N/A"}"</p>

            <hr class="char-hr">

            <div class="char-grid"> 
            <div>
                <strong>Identity :</strong> ${char.gender}, Born: ${char.birthday || "N/A"}<br>
                <strong>Region :</strong> ${char.nation || "N/A"}<br>
                <strong>Appearance :</strong> ${char.height || "N/A"} height, ${char.hairLength || "N/A"} hair
            </div>
            <div>
                <strong style="color: ${visionColor}">Vision :</strong> <span>${char.element || "N/A"} </span><br>
                <strong>Weapon :</strong> ${char.weapon || "N/A"}<br>
                <strong>Colors :</strong>
                Hair <span class="color-dot" style="background:${char.hairColor};"></span>,
                Eyes <span class="color-dot" style="background:${char.eyeColor};"></span>
            </div>
            </div>

            <div class="char-bio-box">
                <strong>Backstory :</strong> ${char.bio || "The traveler has not shared a story yet..."} <br>
                <button class="char-delete-btn" onclick="deleteCharacter(${char.id})">Delete</button>
            </div>
        `;
    container.appendChild(card);
  });
}

function deleteCharacter(id) {
  const currentUser = sessionStorage.getItem("travelerName");
  if (!currentUser) return;

  const userStorageKey = "characters_" + currentUser;
  let characters = JSON.parse(localStorage.getItem(userStorageKey)) || [];

  characters = characters.filter((char) => char.id !== id); // scot characterul cu id ul ala

  localStorage.setItem(userStorageKey, JSON.stringify(characters));

  cardCharacters();
}
/*
    INSPIRE
*/
function inspireMe() {
  const inspireBtn = document.getElementById("inspire-btn");
  const container = document.getElementById("inspire-ideas");
  if (!inspireBtn || !container) return;

  inspireBtn.onclick = function () {
    fetch("characters.json")
      .then((response) => response.json())
      .then((data) => {
        const ideas = data.characters_ideas;
        container.innerHTML = "<h3>Random Inspirations:</h3>";

        let selected = [];
        while (selected.length < 2 && selected.length < ideas.length) {
          let r = Math.floor(Math.random() * ideas.length);
          if (!selected.includes(r)) 
            selected.push(r);
        }

        selected.forEach((index) => {
          const char = ideas[index];
          const ideaCard = document.createElement("div");
          ideaCard.classList.add('char-card');


          const elementValue = char.element ? char.element.toLowerCase() : "default";
          const cssVarName = `--${elementValue}-color`;

          const rootStyles = getComputedStyle(document.documentElement); // ia tag ul html si se duce la root in css
          let visionColor = rootStyles.getPropertyValue(cssVarName).trim();

          if (!visionColor) 
            visionColor = rootStyles.getPropertyValue('--default-card-color');

          ideaCard.style.borderColor = visionColor;


          ideaCard.innerHTML = `
            <div class="char-card-header">
              <strong class="char-card-name" style="color: ${visionColor}">${char.name}</strong>
              <span>${char.rarity} ★</span>
            </div>
            <p class="char-const">"${char.constellation || "N/A"}"</p>
            <hr class="char-hr">
            <div class="char-grid"> 
              <div>
                <strong>Identity :</strong> ${char.gender}, Born: ${char.birthday || "N/A"}<br>
                <strong>Region :</strong> ${char.nation || "N/A"}<br>
                <strong>Appearance :</strong> ${char.height || "N/A"} height, ${char.hairLength || "N/A"} hair
              </div>
              <div>
                <strong style="color: ${visionColor}">Vision :</strong> <span>${char.element || "N/A"}</span><br>
                <strong>Weapon :</strong> ${char.weapon || "N/A"}<br>
                <strong>Colors :</strong>
                Hair <span class="color-dot" style="background:${char.hairColor};"></span>,
                Eyes <span class="color-dot" style="background:${char.eyeColor};"></span>
              </div>
            </div>
            <div class="char-bio-box">
              <strong>Backstory :</strong> ${char.bio || "The traveler has not shared a story yet..."}<br>
            </div>
          `;
          container.appendChild(ideaCard);
        });
      })
      .catch((error) => console.error("Fetch error:", error));
  };
}
