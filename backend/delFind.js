

module.exports = app => {
  app.get("/admin/api/schedules", requireLogin, async (req, res) => {
    try {
      const pickups = await Order.find({ recieved: false });
      // const zones = await Zone.find({});
      // const trucks = await Truck.find({});
      const drivers = await Driver.find({ status: false });
      const des = [];
      const del = [];
      const stops = [];
      const schedules = [];

      //sort to stops by origin
      for (pickup of pickups) {
        stops.push({
          location: pickup.destination,
          description: pickup.description,
          _order: pickup.id,
          product: pickup.product,
          sort: "Pickup"
        });
        des.push([pickup.coordinates]);
      }

      const deviderSize = Math.floor(
        stops.length /drivers.length
      );
      while (drivers.length > 0) {
        i=0
        min = Math.sqrt(Math.pow((drivers[0].coordinates[0])-des[0][0],2)+Math.pow((drivers[0].coordinates[1])-des[0][1],2))
        minEle = 0
        dis =0
        while(stops.length>i){
            min = Math.sqrt(Math.pow((drivers[0].coordinates[0])-des[i][0],2)+Math.pow((drivers[0].coordinates[1])-des[i][1],2))
            if(dis<min){
              min = dis
              minEle = i
            }
            i++;
        }
        let driver = drivers.pop(0);
        let de = des.pop(i);
        let st = stops.pop(i);
        if (driver === undefined) {
          break;
        }
        schedules.push({
          driverName: driver,
          st:st,
          de:de
        });
      }
      res.send(schedules);
    } catch (err) {
      res.status(422).send(err);
    }
  });
//This Part to be updated for admin or maybe this will be fine
//   app.get("/driver/api/schedule", requireLogin, async (req, res) => {
//     try {
//       const pickups = await Order.find({ recieved: false });
//       const drops = await Order.find({ recieved: true, delivered: false });
//       const zones = await Zone.find({});
//       const trucks = await Truck.find({});
//       const drivers = await User.find({ role: "driver" });
//       const stops = [];
//       const schedules = [];

//       //sort to stops by origin
//       for (pickup of pickups) {
//         stops.push({
//           location: pickup.origin,
//           description: pickup.description,
//           _order: pickup.id,
//           volume: pickup.volume,
//           sort: "Pickup"
//         });
//       }

//       //sort to stops by destination
//       for (drop of drops) {
//         stops.push({
//           location: drop.destination,
//           description: drop.description,
//           _order: drop.id,
//           volume: drop.volume,
//           sort: "Drop"
//         });
//       }
//       const deviderSize = Math.floor(
//         stops.length / Math.min(drivers.length, trucks.length)
//       );

//       while (stops.length > 0) {
//         let driver = drivers.pop();
//         if (driver === undefined) {
//           break;
//         }
//         schedules.push({
//           _driver: driver.id,
//           driverName: driver.fullName,
//           stops: stops.splice(0, deviderSize)
//         });
//       }

//       for (schedule of schedules) {
//         if (schedule._driver === req.user.id) {
//           res.send(schedule);
//         }
//       }
//     } catch (err) {
//       res.status(422).send(err);
//     }
//   });
// };
