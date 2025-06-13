
    // mapboxgl.accessToken = mapToken;

    // const map = new mapboxgl.Map({
    // container: 'map', // container ID
    // center: [73.7125,24.5854], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    // zoom: 9 // starting zoom
    // });

    // console.log(coordinates);

    //  const marker = new mapboxgl.Marker()
    //     .setLngLat(coordinates) //listing.geeoetry.coordinates
    //     .addTo(map);

    mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: [73.8786, 18.5246],
    zoom: 9,
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat([73.8786, 18.5246])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        "<h6>Exact location provided after booking!</h6>"
      )
    )
    .addTo(map);