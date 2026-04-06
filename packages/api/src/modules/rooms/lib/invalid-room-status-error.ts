export class InvalidRoomStatusError extends Error {
  constructor(message = "Invalid room status") {
    super(message);
    this.name = "InvalidRoomStatusError";
  }
}
