const sampleListings = [
    {
        title: "Classic Margherita Pizza",
        description: "A classic Margherita pizza with a homemade dough, fresh tomato sauce, mozzarella cheese, and basil leaves.",
        price: 12,
        ingredients: [
            "Pizza dough",
            "Tomato sauce",
            "Mozzarella cheese",
            "Fresh basil",
            "Olive oil",
            "Salt"
        ],
        image: {
            url: "https://media.istockphoto.com/id/1427212489/photo/pizza-hawaiian-cheese-on-wood-table-homemade-food-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=wWTKu4NxVnT9cOBv9_GCseN0zTw2bPiEZRz_6wCdrUg=",
            filename: "listingImage"
        },
        country_of_recipe: "Italy",
        category: "Pizza",
        cooking_time: "15 minutes",
        instructions: [
            "1. Preheat your oven to 475°F (245°C).",
            "2. Roll out the pizza dough on a floured surface to your desired thickness.",
            "3. Spread the tomato sauce evenly over the dough.",
            "4. Add slices of mozzarella cheese on top.",
            "5. Drizzle with olive oil and sprinkle with salt.",
            "6. Bake for 10-15 minutes until the crust is golden and the cheese is bubbly.",
            "7. Remove from oven and garnish with fresh basil leaves before serving."
        ]
    },
    {
        title: "Tandoori Chicken",
        description: "Tandoori chicken is a popular Indian dish marinated in yogurt and spices, then cooked in a tandoor (a cylindrical clay oven).",
        price: 150,
        ingredients: [
            "Chicken",
            "Yogurt",
            "Tandoori masala",
            "Lemon juice",
            "Garlic",
            "Ginger",
            "Salt",
            "Cumin"
        ],
        image: {
            url: "https://media.istockphoto.com/id/1396604313/photo/roasted-whole-chicken-legs-with-condiment-directly-above-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=1D5tmeb0HGE2bT2yPtMwJlxVOrwpnWDcF0BNG27z_Qg=",
            filename: "listingImage"
        },
        country_of_recipe: "India",
        category: "Grilled",
        cooking_time: "30 minutes",
        instructions: [
            "1. In a bowl, mix yogurt, tandoori masala, lemon juice, garlic, ginger, salt, and cumin.",
            "2. Marinate the chicken in the mixture for at least 4 hours or overnight for best results.",
            "3. Preheat your grill or oven to 400°F (200°C).",
            "4. Cook the chicken for 20-30 minutes, turning occasionally until fully cooked and charred on the edges.",
            "5. Serve with naan bread or rice and a side of mint chutney."
        ]
    },
    {
        title: "Sushi Platter",
        description: "A delightful sushi platter featuring nigiri, sashimi, and sushi rolls, served with soy sauce and wasabi.",
        price: 250,
        ingredients: [
            "Sushi rice",
            "Nori (seaweed)",
            "Fresh fish (tuna, salmon)",
            "Cucumber",
            "Avocado",
            "Soy sauce",
            "Wasabi",
            "Pickled ginger"
        ],
        image: {
            url: "https://media.istockphoto.com/id/1289871907/photo/close-up-of-sushi-rolls-in-nori-lined-up-on-rectangle-sushi-plate.webp?a=1&b=1&s=612x612&w=0&k=20&c=zisQf5K0NJmCrmkcZddpw800Ygn9qSoc6_6KJ3o60OM=",
            filename: "listingImage"
        },
        country_of_recipe: "Japan",
        category: "Seafood",
        cooking_time: "45 minutes",
        instructions: [
            "1. Cook the sushi rice and let it cool slightly.",
            "2. Place a sheet of nori on a bamboo mat and spread a thin layer of sushi rice on top.",
            "3. Add slices of fresh fish, cucumber, and avocado.",
            "4. Roll the sushi tightly and slice into pieces.",
            "5. Arrange nigiri and sashimi on the platter alongside the sushi rolls.",
            "6. Serve with soy sauce, wasabi, and pickled ginger."
        ]
    },
    {
        title: "French Croissants",
        description: "Flaky, buttery croissants made with layers of puff pastry, perfect for a light breakfast or snack.",
        price: 300,
        ingredients: [
            "Flour",
            "Butter",
            "Milk",
            "Yeast",
            "Sugar",
            "Salt"
        ],
        image: {
            url: "https://media.istockphoto.com/id/153173705/photo/two-french-croissants.webp?a=1&b=1&s=612x612&w=0&k=20&c=-k2jAn-nnd7hVJnCNe0gFAADOOUWDf8OoPD0Hbc14-Y=",
            filename: "listingImage"
        },
        country_of_recipe: "France",
        category: "Bakery",
        cooking_time: "30 minutes",
        instructions: [
            "1. Combine flour, yeast, sugar, and salt in a bowl.",
            "2. Gradually add milk and knead into a dough.",
            "3. Roll the dough and add cold butter in layers, folding it multiple times to create layers.",
            "4. Roll the dough out and cut into triangles, then roll them into croissant shapes.",
            "5. Let them proof for 1 hour.",
            "6. Bake at 375°F (190°C) for 20-25 minutes until golden brown.",
            "7. Cool slightly before serving."
        ]
    },
    {
        title: "Mexican Tacos",
        description: "Authentic Mexican tacos filled with grilled meat, fresh veggies, and topped with a tangy salsa.",
        price: 100,
        ingredients: [
            "Taco shells",
            "Grilled meat (beef or chicken)",
            "Lettuce",
            "Tomato",
            "Cheese",
            "Sour cream",
            "Salsa"
        ],
        image: {
            url: "https://media.istockphoto.com/id/542331706/photo/homemade-spicy-shrimp-tacos.webp?a=1&b=1&s=612x612&w=0&k=20&c=cBeCvYVLdaUxpDyFMOtttvU7EFQTO0wSHh2ZYdsnGW0=",
            filename: "listingImage"
        },
        country_of_recipe: "Mexico",
        category: "Street Food",
        cooking_time: "20 minutes",
        instructions: [
            "1. Grill the meat until fully cooked, then slice into thin strips.",
            "2. Warm the taco shells in a pan or oven.",
            "3. Fill the taco shells with the grilled meat, lettuce, tomato, and cheese.",
            "4. Top with sour cream and salsa.",
            "5. Serve with lime wedges and enjoy."
        ]
    }
];

module.exports = { data: sampleListings };
