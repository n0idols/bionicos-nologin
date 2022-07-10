export default function getStatus(orderstatus) {
  if (orderstatus === "in progress") {
    return "badge badge-ghost mx-2 uppercase font-bold";
  }
  if (orderstatus === "ready for pickup") {
    return "badge badge-primary mx-2 uppercase font-bold";
  }
  if (orderstatus === "completed") {
    return "badge badge-primary mx-2 uppercase font-bold";
  }
}
