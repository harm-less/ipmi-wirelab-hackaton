Game.prototype.websocket = function(ip, port, id){
  id = id || "";

  return {
    connected: false,
    socket: false,

    connect: function(){
      //this.socket = new WebSocket('ws://' + ip + ':'+ port +'/' + id);

      this.socket = io('ws://' + ip + ':'+ port);

      console.log('connecting to game socket: ' + 'ws://' + ip + ':'+ port)

      this.socket.on('connect', function () {
        this.connected = true;
        console.log('connected to game socket: ' + 'ws://' + ip + ':'+ port)
      });

      this.socket.on('application.message', function(data){this.listen(data)}.bind(this));

    },

    listen:function(data){
      if(data) console.log("received:",data);
    },

    send:function(data) {
      data.gameId = id;
      this.socket.emit('application.message', data);
    },
  }
}