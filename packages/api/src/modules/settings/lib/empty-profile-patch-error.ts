export class EmptyProfilePatchError extends Error {
  constructor(message = "At least one field is required to update profile settings") {
    super(message);
    this.name = "EmptyProfilePatchError";
  }
}
