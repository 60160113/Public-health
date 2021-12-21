export function alfHeader() {
  // return authorization header
  let user = JSON.parse(localStorage.getItem("AuthUser"));
  if (user && user.ticket) {
    return { Authorization: "Basic " + window.btoa(user.ticket) };
  } else {
    return {};
  }
}
