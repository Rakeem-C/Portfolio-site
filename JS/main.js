const portfolioInfo = [
  {
    id: "web-1",
    type: "web",
    img: "./assets/images/portfolio-1.jpg",
    category: "Web Development",
    title: "Code Rad",
    description: "My first awesome website",
    detail: "This website was developed to demonstrate mastery over HTML and CSS",
    link: "https://chapmans-web.netlify.app/"
  },
  {
    id: "web-2",
    type: "web",
    img: "./assets/images/portfolio-2.jpg",
    category: "Web Development",
    title: "Front",
    description: "My Awesome Website",
    detail: "This website demonstrates additional skills that weren't showcased before.",
    link: "https://chapmanfront.vercel.app"
  },
  {
    id: "web-3",
    type: "web",
    img: "./assets/images/portfolio-3.jpg",
    category: "Web Development",
    title: "Portfolio Project",
    description: "My Awesome Website",
    detail: "This website demonstrates Javascript proficiency as well as more advanced CSS",
    link: "https://chapman-world-wide.vercel.app"
  },
  {
    id: "web-4",
    type: "web",
    img: "./assets/images/portfolio-4.jpg",
    category: "Web Development",
    title: "Path To Legacy",
    description: "This a InstaCart styled website (V1) that's used to enable customers to purchase their favorite snack and have it shipped directly to them",
    detail: "Demonstrates mastery over HTML,CSS JS, Jquery, bootstrap",
    link: "https://path-to-legacy-ghfp-git-main-rakeem-c.vercel.app/?vercelToolbarCode=RhLAqHJArCVLgqN"
  },
  {
    id: "web-5",
    type: "web",
    img: "./assets/images/legendary monsters.webp",
    category: "Web Development",
    title: "Pokemon Cosmic Alpha",
    description: "This website allows you to save your favorite pokemon and provides a playable preview for my fan-made game.",
    detail: "Demonstrates mastery over HTML,CSS JS, GSAP, Tile Editor, Howl ",
    link: "https://pokemon-cosmic.netlify.app/"
  },
  {
    id: "web-6",
    type: "web",
    img: "./assets/images/portfolio-6.jpg",
    category: "Web Development",
    title: "Krypto NFTs ",
    description: "This landing page was built with webflow and is meant to showcase an upcoming NFT platform.",
    detail: "Demonstrates mastery of the Webflow ecosystem.",
    link: "https://kryptonfts.webflow.io/"
  },
  {
    id: "web-7",
    type: "web",
    img: "./assets/images/portfolio-7.jpg",
    category: "Web Development",
    title: "OneDayBathroom",
    description: "This website supports ShowCaseRemodels initiative to expand their bathroom offerings.",
    detail: "Demonstrates mastery of the Wordpress CMS including Elementor and Astra to create multi-page aesthetic pages.",
    link: "https://myonedaybathroom.com/"
  },
  {
    id: "web-8",
    type: "web",
    img: "./assets/images/portfolio-8.jpg",
    category: "Web Development",
    title: "Non-profit Website Overhaul",
    description: "My awesome webapp",
    detail: "This  website helped a non-profit establish an authoritative presence in the Georgia Ballet scene. ",
    link: "https://chapman-world-wide.vercel.app/"
  },
  
  // Add more portfolio items here...
];
const theme = 'theme';
const dataTheme = 'data-theme';
const themeTab = '.theme-tab';
const switcherBtn = '.switcher-btn';
const dark = 'dark';
const light = 'light';
const open = 'open';
const active = 'active';

const  modalOpen = '[data-open]';
const  modalClose = '[data-close]';
const isVisible = 'is-visible';

const dataFilter = '[data-filter]';
const portfolioData = '[data-item]';
const root = document.documentElement;

// Theme 
const toggleTheme = document.querySelector(themeTab);
const switcher = document.querySelectorAll(switcherBtn);
const currentTheme = localStorage.getItem(theme);

// Portfolio
const filterLink = document.querySelectorAll(dataFilter);
const portfolioItems = document.querySelectorAll(portfolioData);
const searchBox = document.querySelector('#search');

/* Modal */
const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);

const setActive = (elm, selector) => {
if (document.querySelector(`${selector}.${active}`) !== null) {
  document.querySelector(`${selector}.${active}`).classList.remove(active);
 }
    elm.classList.add(active);
  
}

const setTheme = (val) => {
  if (val == dark) {
    root.setAttribute(dataTheme, dark);
    localStorage.setItem(theme, dark);
  } else {
    root.setAttribute(dataTheme, light);
    localStorage.setItem(theme, light);
  }
};

const portfolioGrid = document.querySelector('.portfolio-grid');

// Fill the portfolioHtml and append it to the portfolioGrid
let portfolioHtml = '';
for (let itemData of portfolioInfo) {
  portfolioHtml += `
    <div class="portfolio-card" data-item="${itemData.type}" data-open="${itemData.id}">
      <div class="card-body">
        <img src="${itemData.img}" alt="portfolio icon">
        <div class="card-popup-box">
          <div>${itemData.category}</div>
          <h3>${itemData.title}</h3>
        </div>
      </div>
    </div>
  `;
}
// Append the new portfolio cards to the portfolio grid
portfolioGrid.innerHTML = portfolioHtml;
// Event listener for when a portfolio card is clicked
document.querySelector('.portfolio-grid').addEventListener('click', function(e) {
  let target = e.target;

  // Traverse up in case of inner elements clicked within the portfolio card
  while(target != this && !target.classList.contains('portfolio-card')) {
    target = target.parentElement;
  }

  // Check if a portfolio card was clicked
  if(target.classList.contains('portfolio-card')) {
    const itemId = target.dataset.open;
    const itemData = portfolioInfo.find(item => item.id === itemId);

    // Check if matching data for the clicked card was found
    if (itemData) {
      const modalHtml = `
        <div id="${itemData.id}" class="modal is-visible" data-animation="slideInOutTop">
          <div class="modal-dialog">
            <header class="modal-header">
              <h3>${itemData.title}</h3>
              <i class="fas fa-times" data-close></i>
            </header>
            <div class="modal-body">
              <div class="img-wrapper">
                <img src="${itemData.img}" alt="portfolio image">
              </div>
              <div class="text-wrapper">
                <p><strong>${itemData.description}</strong></p>
                <p>${itemData.detail}</p>
                <a href="${itemData.link}">Check it out!</a>
              </div>
            </div>
          </div>
        </div>
      `;

      // Append the new modal to the site wrapper
      document.querySelector('.site-wrapper').insertAdjacentHTML('beforeend', modalHtml);
    }
  }
});

// Event listener for when a modal close button is clicked
document.querySelector('.site-wrapper').addEventListener('click', function(e) {
  if (e.target.classList.contains('fa-times')) {
    e.target.closest('.modal').remove();
  }
});


if (currentTheme) {
  root.setAttribute(dataTheme, currentTheme);
  switcher.forEach((btn) => {
    btn.classList.remove(active);
  });

  if(currentTheme == dark) {
    switcher[1].classList.add(active);
  } else {
    switcher[0].classList.add(active);
  }
}

toggleTheme.addEventListener('click', function() {
  const tab = this.parentElement.parentElement;
  if (!tab.className.includes(open)) {
    tab.classList.add(open);
  } else {
    tab.classList.remove(open);
  }
});


for (const elm of switcher) {
  elm.addEventListener('click', function() {
    const toggle = this.dataset.toggle;
    setActive(elm, switcherBtn);
    setTheme(toggle);
  })
}

searchBox.addEventListener('keyup', (e) => {
  const searchInput = e.target.value.toLowerCase().trim();
  const portfolioCards = portfolioGrid.querySelectorAll('.portfolio-card');

  portfolioCards.forEach((card) => {
    if (card.dataset.item.includes(searchInput)) {
      card.style.display ='block';
    } else {
      card.style.display = 'none';
    }
  })
});


for (const link of filterLink) {
  link.addEventListener('click', function() {
    setActive(link, '.filter-link');
    const filter = this.dataset.filter;
    portfolioItems.forEach((card) => {
      if (filter === 'all') {
        card.style.display = 'block';
      } else if (card.dataset.item === filter) {
        card.style.display = 'block'
      } else {
        card.style.display ='none';
      }
    })
  })
}



//Modal/Full Site Modal "open buttons"
for (const elm of openModal) {
  elm.addEventListener('click', function() {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  })
}

for (const elm of closeModal) {
  elm.addEventListener('click', function(){
    this.parentElement.parentElement.parentElement.classList.remove(isVisible);
  })
}

// Modal 
document.addEventListener('click', (e) => {
   if (e.target === document.querySelector('.modal.is-visible')) {
    document.querySelector('.modal.is-visible').classList.remove(isVisible);
   } 
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
   document.querySelector('.modal.is-visible').classList.remove(isVisible);
  } 
});

const elmsDisplayed = getComputedStyle(root).getPropertyValue('--marquee-elms-displayed');
const marqueeContent = document.querySelector('ul.marquee-content');

root.style.setProperty('--marquee-elms', marqueeContent.children.length);
for (let i = 0; i < elmsDisplayed; i += 1) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}
// get elements displayed
//nodelist.length
// assign --marquee-elms nodelist.length


// Play Button 


// Function to toggle play/pause for a given audio element and button
function toggleAudio(audioElement, buttonElement, isPlaying) {
  if (isPlaying) {
    audioElement.pause();
    buttonElement.src = './assets/images/ava-1.jpg'; // Change to play image
  } else {
    // Pause all other audio elements before playing the new one
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        // Reset all play buttons to the play image
        document.querySelectorAll('.play-button').forEach(button => {
          button.src = './assets/images/ava-1.jpg';
        });
      }
    });

    audioElement.play();
    buttonElement.src = './assets/images/ava-1.jpg'; // Change to pause image
  }
}

// Attaching event listeners to all play buttons
document.querySelectorAll('.play-button').forEach(button => {
  button.addEventListener('click', function(event) {
    const audioId = button.getAttribute('data-audio-target');
    const audioElement = document.getElementById(audioId);
    toggleAudio(audioElement, button, !audioElement.paused);
    event.stopPropagation(); // Prevents click event from bubbling up
  });
});

// Global click listener to pause all audios if clicked outside of a play button
document.addEventListener('click', function() {
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      document.querySelectorAll('.play-button').forEach(button => {
        button.src = './assets/images/ava-1.jpg';
      });
    }
  });
});

// Global keydown listener to pause all audios
document.addEventListener('keydown', function() {
  document.querySelectorAll('audio').forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      document.querySelectorAll('.play-button').forEach(button => {
        button.src = './assets/images/ava-1.jpg';
      });
    }
  });
});
