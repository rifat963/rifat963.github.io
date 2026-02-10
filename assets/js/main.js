(function () {
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  if (!btn) return;

  var saved = localStorage.getItem("theme");
  if (saved === "dark") {
    root.classList.add("dark");
  }

  btn.addEventListener("click", function () {
    root.classList.toggle("dark");
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
  });
})();