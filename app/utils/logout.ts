export const logout = () => {
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("nickname");
  sessionStorage.removeItem("bearer");
  console.log("You are signed out!");
}