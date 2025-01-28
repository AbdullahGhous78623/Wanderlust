mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note: lat must be between -90 and 90
    zoom: 9 // starting zoom
});

console.log(listing.geometry.coordinates);  // Ensure correct coordinates are logged

// Create a custom marker element without 3D effects
const markerEl = document.createElement('div');
markerEl.style.cssText = `
    width: 40px; 
    height: 40px; 
    background-color: #ff5733; 
    border: 2px solid #fff; 
    border-radius: 50%; 
    position: relative; 
    transform: translate(-50%, -50%);
`;

// Add a "tail" to the marker to create a pin effect
markerEl.innerHTML = `
    <div style="
        width: 0; 
        height: 0; 
        border-left: 12px solid transparent; 
        border-right: 12px solid transparent; 
        border-top: 18px solid #ff5733; 
        position: absolute; 
        bottom: -12px; 
        left: 50%; 
        transform: translateX(-50%);
    "></div>
`;

// Create the content for the popup
const popupContent = `
    <div class="popup-card">
        <h4 class="popup-title">${listing.location}</h4>
        <p class="popup-description">Exact Location After booking</p>
    </div>
`;

// Add the custom marker to the map with a styled popup
const marker = new mapboxgl.Marker({ element: markerEl })
    .setLngLat(listing.geometry.coordinates)  // Correct position for the marker
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupContent)  // Set custom content for the popup
    )
    .addTo(map);

// Style the popup with 3D look and animation
const style = document.createElement('style');
style.innerHTML = `
    .mapboxgl-popup-content {
        background: linear-gradient(145deg, #f0f1f6, #d3d9e3); /* Gradient background */
        border-radius: 15px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2), 0 15px 30px rgba(0, 0, 0, 0.3);
        transform: perspective(500px) rotateX(10deg) rotateY(10deg) translateY(50px);
        opacity: 0;
        animation: popupSlideIn 0.5s ease-out forwards;
        padding: 20px;
        width: 250px;
        font-family: 'Roboto', sans-serif;
        color: #333;
        font-size: 16px;
    }

    .mapboxgl-popup-content h4 {
        font-size: 22px;
        margin: 0;
        font-weight: bold;
        color: #ff5733;
        letter-spacing: 1px;
    }

    .mapboxgl-popup-content p {
        font-size: 14px;
        margin: 5px 0;
        color: #555;
    }

    .mapboxgl-popup-tip {
        display: none; /* Hide the default popup tip */
    }

    .popup-card {
        padding: 15px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }

    .popup-title {
        font-size: 20px;
        font-weight: 600;
        color: #ff5733;
        margin-bottom: 10px;
    }

    .popup-description {
        font-size: 14px;
        color: #555;
    }

    @keyframes popupSlideIn {
        0% {
            transform: perspective(500px) rotateX(10deg) rotateY(10deg) translateY(50px);
            opacity: 0;
        }
        100% {
            transform: perspective(500px) rotateX(10deg) rotateY(10deg) translateY(0);
            opacity: 1;
        }
    }
`;

// Append the CSS to the document's head
document.head.appendChild(style);
