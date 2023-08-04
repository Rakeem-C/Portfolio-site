// Data for the portfolio cards and corresponding modals
const portfolioInfo = [
  {
    id: "web-1",
    type: "web",
    img: "./assets/images/portfolio-1.jpg",
    category: "Web Development",
    title: "Feature Project 1",
    description: "My first awesome website",
    detail: "This website was developed to demonstrate mastery over HTML and CSS",
    link: "https://chapmans-web.netlify.app/"
  },
  {
    id: "web-2",
    type: "web",
    img: "./assets/images/portfolio-2.jpg",
    category: "Web Development",
    title: "Feature Project 2",
    description: "My Awesome Website",
    detail: "This website demonstrates additional skills that weren't showcased before.",
    link: "https://chapmanfront.vercel.app"
  },
  {
    id: "web-3",
    type: "web",
    img: "./assets/images/portfolio-3.jpg",
    category: "Web Development",
    title: "Feature Project 3",
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
    description: "My awesome website",
    detail: "This a UberEats inspired website that's used to enable customers to purchase their favorite snack and have it shipped directly to them",
    link: "https://path-to-legacy-ghfp-git-main-rakeem-c.vercel.app/?vercelToolbarCode=RhLAqHJArCVLgqN"
  },
  {
    id: "ui-2",
    type: "ui",
    img: "./assets/images/portfolio-5.jpg",
    category: "Web Development",
    title: "Feature Project 5",
    description: "My first awesome website",
    detail: "My next masterpiece is coming soon",
    link: "https://chapmans-web.netlify.app/"
  },
  {
    id: "app-1",
    type: "app",
    img: "./assets/images/portfolio-5.jpg",
    category: "Web Development",
    title: "Feature Project 6",
    description: "My first awesome website",
    detail: "My next masterpiece is coming soon",
    link: "https://chapmans-web.netlify.app/"
  },
  {
    id: "app-2",
    type: "app",
    img: "./assets/images/portfolio-5.jpg",
    category: "Web Development",
    title: "Feature Project 7",
    description: "My first awesome website",
    detail: "My next masterpiece is coming soon",
    link: "https://chapmans-web.netlify.app/"
  },
  {
    id: "web-1",
    type: "web",
    img: "./assets/images/portfolio-5.jpg",
    category: "Web Development",
    title: "Feature Project 8",
    description: "My first awesome website",
    detail: "My next masterpiece is coming soon",
    link: "https://chapmans-web.netlify.app/"
  },
  
  
  // Add more portfolio items here...
];

// Create portfolio cards
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
document.querySelector('.portfolio-grid').innerHTML = portfolioHtml;

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
                <p><strong>${itemData.title}</strong></p>
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
