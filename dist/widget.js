(function () {
  // Assume WidgetApi, PostMessageTransport, MatrixCapabilities are available in global scope

  const widgetApi = new matrixWidgetApi.WidgetApi({
    widgetId: "forward-widget",
    capabilities: [
      matrixWidgetApi.MatrixCapabilities.SendEvent,
      matrixWidgetApi.MatrixCapabilities.GetJoinedRooms,
    ],
    initialEvent: undefined,
    transport: new matrixWidgetApi.PostMessageTransport(),
  });

  widgetApi.start().then(function () {
    const roomSelect = document.getElementById("roomSelect");
    const forwardBtn = document.getElementById("forwardBtn");
    const status = document.getElementById("status");

    const selectedEvent = {
      type: "m.room.message",
      content: {
        msgtype: "m.text",
        body: "This is a forwarded message!",
      },
    };

    widgetApi.getJoinedRooms().then(function (rooms) {
      rooms.forEach(function (roomId) {
        const opt = document.createElement("option");
        opt.value = roomId;
        opt.textContent = roomId;
        roomSelect.appendChild(opt);
      });
    });

    forwardBtn.onclick = function () {
      const roomId = roomSelect.value;
      widgetApi.sendRoomEvent(roomId, selectedEvent.type, selectedEvent.content)
        .then(function () {
          status.textContent = "Message forwarded!";
        })
        .catch(function (e) {
          console.error(e);
          status.textContent = "Failed to forward message.";
        });
    };
  });
})();
