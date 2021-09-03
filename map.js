let { pool } = require("./dbconfig");
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 31.963158, lng: 35.930359 },
  });
  console.log("hello");
  const locations = [];
  console.log(locations);
  pool.query(`Select lat, lng from locations`, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(results.rows);
    for (i = 0; i < results.rows.length; i++) {
      locations.push(results.rows[i]);

      // console.log(locations);
      // res.redirect("/login");
    }
  });
  maxZoomService = new google.maps.MaxZoomService();
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const markers = locations.map((location, i) => {
    return new google.maps.Marker({
      position: location,
      draggable: true,
      // icon: "./Af_4_15.png",
      animation: google.maps.Animation.DROP,
      //label: labels[i % labels.length],
    });
  });
  new MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
}
let errors = [];
// pool.query(
//   `SELECT email FROM users
// where email= $1`,
//   ["suhaibyassin8@gmail.com"],
//   (err, results) => {
//     if (err) {
//       console.log(err);
//     }
//     const em = results.rows[0];
//     console.log(em["email"]);
//     if (results.rows.length > 0) {
//       // errors.push(results.rows[0]);
//       // console.log(errors);
//       // res.render("register", { errors });
//     } else {
//       pool.query(
//         `INSERT INTO users (name, email, password)
//                     VALUES ($1, $2, $3)
//                     RETURNING id, password`,
//         [User, Email, hashedpassword],
//         (err, results) => {
//           if (err) {
//             console.log(err);
//             res.sendStatus(500);
//             return;
//           }
//           // console.log(results.rows);
//           // res.redirect("/login");
//         }
//       );
//     }
//   }
// );
