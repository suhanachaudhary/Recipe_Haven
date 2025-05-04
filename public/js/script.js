
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


//search recipe

let recognition;

  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('searchInput').value = transcript;
      
      // Call searchDestination manually after voice input
      searchDestination(new Event('submit'));
    };

    recognition.onerror = function(event) {
      alert('Voice recognition error: ' + event.error);
    };
  } else {
    alert('Your browser does not support voice recognition. Please use Chrome.');
  }

  function startListening() {
    if (recognition) {
      recognition.start();
    }
  }

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

// function searchDestination(event) {
//   event.preventDefault();

//   const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//   const cards = document.querySelectorAll('.card');
//   const noResultsMessage = document.getElementById('noResultsMessage');
//   let hasVisibleCards = false;

//   cards.forEach(card => {
//     const titleElement = card.querySelector('.card-title');

//     if (titleElement) {
//       const title = titleElement.innerText.toLowerCase();

//       if (title.includes(searchTerm)) {
//         card.style.display = 'block';
//         hasVisibleCards = true;
//       } else {
//         card.style.display = 'none';
//       }
//     }
//   });

//   // Display "Recipe not found" message if no cards are visible
//   noResultsMessage.style.display = hasVisibleCards ? 'none' : 'block';
// }

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




