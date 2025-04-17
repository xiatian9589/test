import {
  WidgetApi,
  PostMessageTransport,
  MatrixCapabilities,
} from "matrix-widget-api";

const widgetApi = new WidgetApi({
  widgetId: "forward-widget",
  capabilities: [
    MatrixCapabilities.SendEvent,
    MatrixCapabilities.GetJoinedRooms,
  ],
  initialEvent: undefined,
  transport: new PostMessageTransport(),
});

await widgetApi.start();

const roomSelect = document.getElementById("roomSelect") as HTMLSelectElement;
const forwardBtn = document.getElementById("forwardBtn") as HTMLButtonElement;
const status = document.getElementById("status") as HTMLParagraphElement;

let selectedEvent: any = {
  type: "m.room.message",
  content: {
    msgtype: "m.text",
    body: "This is a forwarded message!",
  },
};

// Get list of rooms
const rooms = await widgetApi.getJoinedRooms();
rooms.forEach((roomId) => {
  const opt = document.createElement("option");
  opt.value = roomId;
  opt.textContent = roomId;
  roomSelect.appendChild(opt);
});

// Forward message
forwardBtn.onclick = async () => {
  try {
    const roomId = roomSelect.value;
    await widgetApi.sendRoomEvent(roomId, selectedEvent.type, selectedEvent.content);
    status.textContent = "Message forwarded!";
  } catch (e) {
    console.error(e);
    status.textContent = "Failed to forward message.";
  }
};
