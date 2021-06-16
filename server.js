const io = require('socket.io')(3005)


const deliveryQueue = []
// Everything is loaded in the connection event.
io.on('connection', socket => {

  console.log(socket.id)
  io.send("Hello lets get to business!")

  function deliverySystem(obj) {

    if (deliveryQueue.length >= 1) {

      let package = deliveryQueue.shift()
      let delivery = [obj, package]
      socket.emit('delivery', delivery)
    } else {
      socket.send('No Deliveries')
    }
  }

  socket.on("message", data => {
    console.log(data);
  });

  socket.on('ready', payload => {
    console.log(`${payload.name} is ${payload.open = true ? 'Open and ready for business' : 'Closed and not accepting deliveries'}`)
  });

  socket.on('order', payload => {
    console.log(`Received Order ${payload._id} of (${payload.quantity}) ${payload.item} for ${payload.customer.name} servicing to Delivery Queue`)

    deliveryQueue.push(payload)
  })

  socket.on('available', payload => {
    if (payload.name) {
      console.log(`${payload.name} is ready for pickup!`)
      deliverySystem(payload)
    }
  })

  socket.on('delivered', payload => {
    socket.broadcast.emit('thanks', payload)
    console.log('DELIVERY SUCCESS')
    console.log(payload)
    
  })

  socket.on('appreciation', payload => socket.broadcast.emit('appreciation', payload))
});

// if (deliveryQueue) {
//   let stringQueue = JSON.stringify(deliveryQueue)
//   localStorage.setItem('deliveryQueue', stringQueue)
// }
