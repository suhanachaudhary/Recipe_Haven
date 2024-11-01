// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()


  // Function to handle search
  function searchDestination(event) {
    event.preventDefault(); 

    const searchTerm = document.getElementById('searchInput').value.toLowerCase(); // Get the search input and convert to lowercase
    const cards = document.querySelectorAll('.card'); 
    console.log(cards);
    console.log('Search term:', searchTerm);

    cards.forEach(card => {
        const titleElement = card.querySelector('.card-title');
        
        if (titleElement) {
          const title = titleElement.innerText.toLowerCase(); 
          console.log('Card Title:', title);  
            if (title.includes(searchTerm)) {
              console.log("yes")
                card.style.display = 'block'; 
            } else {
              console.log("no")
                card.style.display = 'none'; 
            }
          }
          else {
            console.log('Card title not found for this card:', card);
        }       
    });
}


// Function to handle search
function searchDestination(event) {
  event.preventDefault(); 

  const searchTerm = document.getElementById('searchInput').value.toLowerCase(); // Get the search input and convert to lowercase
  const cards = document.querySelectorAll('.card'); 
  console.log(cards);
  console.log('Search term:', searchTerm);

  cards.forEach(card => {
      const titleElement = card.querySelector('.card-title');
      
      if (titleElement) {
        const title = titleElement.innerText.toLowerCase(); 
        console.log('Card Title:', title);  
          if (title.includes(searchTerm)) {
            console.log("yes")
              card.style.display = 'block'; 
          } else {
            console.log("no")
              card.style.display = 'none'; 
          }
        }
        else {
          console.log('Card title not found for this card:', card);
      }       
  });
}

//search recipe

function searchDestination(event) {
  event.preventDefault();

  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  const noResultsMessage = document.getElementById('noResultsMessage');
  let hasVisibleCards = false;

  cards.forEach(card => {
    const titleElement = card.querySelector('.card-title');

    if (titleElement) {
      const title = titleElement.innerText.toLowerCase();

      if (title.includes(searchTerm)) {
        card.style.display = 'block';
        hasVisibleCards = true;
      } else {
        card.style.display = 'none';
      }
    }
  });

  // Display "Recipe not found" message if no cards are visible
  noResultsMessage.style.display = hasVisibleCards ? 'none' : 'block';
}

// home page slider 
let next=document.querySelector(".next");
let prev=document.querySelector(".prev");

next.addEventListener("click",()=>{
  let items=document.querySelectorAll(".item");
  document.querySelector('.slide').appendChild(items[0]);
})

prev.addEventListener("click",()=>{
  let items=document.querySelectorAll(".item");
  document.querySelector('.slide').prepend(items[items.length-1]);
})




