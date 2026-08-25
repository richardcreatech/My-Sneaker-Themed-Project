export default function Yep() {
  document.title = "Sneakers";

  console.log(`Welcome to the ${document.title} Project`);

  const my_brands_icon = document.getElementById("my-brands-icon");

  if (my_brands_icon) {
    my_brands_icon.href = "logo/my_logo.png";
  }
}