const form = document.getElementById("donationForm");
const foodCards = document.querySelector(".food-cards");

// Demo charity database (AI input)
const charities = [
    { name: "Hope Hostel", location: "Chennai", need: 40 },
    { name: "Care Trust", location: "Bangalore", need: 100 },
    { name: "Food For All", location: "Hyderabad", need: 60 }
];

let donations = JSON.parse(localStorage.getItem("donations")) || [];

// AI Matching Function
function findBestCharity(donation) {
    let bestScore = -1;
    let bestMatch = null;

    charities.forEach(charity => {
        let score = 0;

        if (charity.location === donation.location) score += 40;
        if (charity.need >= donation.quantity) score += 30;
        if (donation.expiry <= 2) score += 30;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = charity;
        }
    });

    return bestMatch;
}

// Display Donations
function displayDonations() {
    foodCards.innerHTML = "";

    donations.forEach((d, index) => {
        const bestCharity = findBestCharity(d);

        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <h3>${d.name}</h3>
            <p><i class="fa-solid fa-location-dot"></i> ${d.location}</p>
            <p><i class="fa-solid fa-users"></i> ${d.quantity} people</p>
            <p><i class="fa-solid fa-clock"></i> Expires in ${d.expiry} hrs</p>
            <p class="ai">🤖 AI Suggests: ${bestCharity ? bestCharity.name : "No match"}</p>
            <button class="btn" onclick="claimFood(${index})">Claim Food</button>
        `;

        foodCards.appendChild(card);
    });
}

// Submit Donation
form.addEventListener("submit", e => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select, textarea");

    const donation = {
        name: inputs[0].value,
        location: inputs[1].value,
        quantity: Number(inputs[2].value),
        type: inputs[3].value,
        expiry: Number(inputs[4].value),
        notes: inputs[5].value
    };

    donations.push(donation);
    localStorage.setItem("donations", JSON.stringify(donations));

    form.reset();
    displayDonations();
    alert("✅ Food donated successfully!");
});

// Claim Food
function claimFood(index) {
    donations.splice(index, 1);
    localStorage.setItem("donations", JSON.stringify(donations));
    displayDonations();
    alert("🍽️ Food claimed!");
}

// Load on start
displayDonations();
