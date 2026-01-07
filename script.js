/* =================== NGO DATA =================== */
const ngos = [
    { name: "Hope Hostel", city: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Care Trust", city: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { name: "Food For All", city: "Hyderabad", lat: 17.3850, lon: 78.4867 }
];

/* =================== CITY COORDINATES =================== */
const cityCoords = {
    "Chennai": { lat:13.0827, lon:80.2707 }, "Bangalore": { lat:12.9716, lon:77.5946 },
    "Hyderabad": { lat:17.3850, lon:78.4867 }, "Mumbai": { lat:19.0760, lon:72.8777 },
    "Delhi": { lat:28.6139, lon:77.2090 }, "Kolkata": { lat:22.5726, lon:88.3639 },
    "Pune": { lat:18.5204, lon:73.8567 }, "Ahmedabad": { lat:23.0225, lon:72.5714 },
    "Jaipur": { lat:26.9124, lon:75.7873 }, "Lucknow": { lat:26.8467, lon:80.9462 },
    "Kanpur": { lat:26.4499, lon:80.3319 }, "Nagpur": { lat:21.1458, lon:79.0882 },
    "Indore": { lat:22.7196, lon:75.8577 }, "Bhopal": { lat:23.2599, lon:77.4126 },
    "Patna": { lat:25.5941, lon:85.1376 }, "Vadodara": { lat:22.3072, lon:73.1812 },
    "Ludhiana": { lat:30.9000, lon:75.8573 }, "Agra": { lat:27.1767, lon:78.0081 },
    "Nashik": { lat:19.9975, lon:73.7898 }, "Faridabad": { lat:28.4089, lon:77.3178 },
    "Meerut": { lat:28.9845, lon:77.7064 }, "Rajkot": { lat:22.3039, lon:70.8022 },
    "Kalyan": { lat:19.2403, lon:73.1300 }, "Vasai": { lat:19.3914, lon:72.8397 },
    "Varanasi": { lat:25.3176, lon:82.9739 }, "Srinagar": { lat:34.0837, lon:74.7973 },
    "Amritsar": { lat:31.6340, lon:74.8723 }, "Coimbatore": { lat:11.0168, lon:76.9558 },
    "Howrah": { lat:22.5958, lon:88.2636 }, "Gwalior": { lat:26.2183, lon:78.1828 },
    "Jabalpur": { lat:23.1815, lon:79.9864 }, "Jodhpur": { lat:26.2389, lon:73.0243 },
    "Madurai": { lat:9.9252, lon:78.1198 }, "Raipur": { lat:21.2514, lon:81.6296 },
    "Allahabad": { lat:25.4358, lon:81.8463 }, "Ranchi": { lat:23.3441, lon:85.3096 },
    "Gurgaon": { lat:28.4595, lon:77.0266 }, "Surat": { lat:21.1702, lon:72.8311 },
    "Thane": { lat:19.2183, lon:72.9781 }, "Vijayawada": { lat:16.5062, lon:80.6480 },
    "Jamshedpur": { lat:22.8046, lon:86.2029 }, "Dehradun": { lat:30.3165, lon:78.0322 },
    "Salem": { lat:11.6643, lon:78.1460 }, "Tiruchirappalli": { lat:10.7905, lon:78.7047 },
    "Hubli": { lat:15.3647, lon:75.1230 }, "Udaipur": { lat:24.5854, lon:73.7125 },
    "Belgaum": { lat:15.8497, lon:74.4977 }
};

/* =================== LOAD DONATIONS =================== */
let donations = JSON.parse(localStorage.getItem("donations")) || [];

/* =================== PAGE NAVIGATION =================== */
function goRole() {
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("rolePage").classList.remove("hidden");
}
function showDonor() {
  document.getElementById("rolePage").classList.add("hidden");
  document.getElementById("donorPage").classList.remove("hidden");
}
function showClaimer() {
  document.getElementById("rolePage").classList.add("hidden");
  document.getElementById("claimerPage").classList.remove("hidden");
  displayFood();
}
function backHome() {
  document.getElementById("homePage").classList.remove("hidden");
  document.getElementById("rolePage").classList.add("hidden");
  document.getElementById("donorPage").classList.add("hidden");
  document.getElementById("claimerPage").classList.add("hidden");
}

/* =================== DISTANCE FUNCTION =================== */
function calculateDistance(lat1, lon1, lat2, lon2){
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R*c;
}

/* =================== AI MATCHING =================== */
function findNearestNGO(city, qty, expiry){
    const donor = cityCoords[city];
    if(!donor) return null;
    let bestNGO = null;
    let bestScore = -1;
    ngos.forEach(ngo=>{
        let score = 0;
        const dist = calculateDistance(donor.lat, donor.lon, ngo.lat, ngo.lon);
        if(dist<10) score+=40;
        else if(dist<50) score+=20;
        if(ngo.need >= qty) score+=30;
        if(expiry <= 2) score+=30;
        if(score>bestScore){
            bestScore=score;
            bestNGO={...ngo, distance:dist.toFixed(2)};
        }
    });
    return bestNGO;
}

/* =================== DONATION FORM =================== */
const form = document.getElementById("donationForm");
if(form){
    form.addEventListener("submit", e=>{
        e.preventDefault();
        const inputs = form.querySelectorAll("input, select, textarea");
        const donation = {
            food: inputs[0].value,
            city: inputs[1].value,
            qty: Number(inputs[2].value),
            expiry: Number(inputs[3].value),
            notes: inputs[4].value
        };
        donations.push(donation);
        localStorage.setItem("donations", JSON.stringify(donations));
        alert("✅ Food Donated!");
        form.reset();

        // Automatically show Claimer page after donation
        document.getElementById("donorPage").classList.add("hidden");
        document.getElementById("claimerPage").classList.remove("hidden");

        // Display the latest donation
        displayFood();
    });
}

/* =================== DISPLAY DONATIONS =================== */
function displayFood(){
    const foodList = document.getElementById("foodList");
    foodList.innerHTML="";
    donations.forEach((d,i)=>{
        const nearest = findNearestNGO(d.city,d.qty,d.expiry);
        foodList.innerHTML+=`
        <div class="container">
            <p><b>${d.food}</b> for ${d.qty} people</p>
            <p>City: ${d.city}</p>
            <p>AI Match: ${nearest ? nearest.name + " (" + nearest.distance + " km)" : "No match"}</p>
            <button onclick="claim(${i})">Claim</button>
        </div>`;
    });
}

/* =================== CLAIM FUNCTION =================== */
function claim(i){
    donations.splice(i,1);
    localStorage.setItem("donations", JSON.stringify(donations));
    displayFood();
}
