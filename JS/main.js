$(document).ready(() => {
  // Loader
  $("#loader").fadeOut();

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    $("body").addClass("dark");
  }

  // Theme toggle
  $("#themeToggle").on("click", () => {
    $("body").toggleClass("dark");

    if ($("body").hasClass("dark")) {
      localStorage.setItem("theme", "dark");
      toastr.info("Dark mode enabled");
    } else {
      localStorage.setItem("theme", "light");
      toastr.info("Light mode enabled");
    }
  });

  // Dashboard stats (only for index.html)
  (async function loadStats() {
    if ($("#statUsers").length) {
      const users = await fetchData(API.users);
      const posts = await fetchData(API.posts);
      const comments = await fetchData("https://jsonplaceholder.typicode.com/comments");

      $("#statUsers").text(users?.length || 0);
      $("#statPosts").text(posts?.length || 0);
      $("#statComments").text(comments?.length || 0);
    }
  })();
});

toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "timeOut": "3000",
  "positionClass": "toast-bottom-left" 
};


$(".dash-card").on("click", function () {
  const target = $(this).data("target");
  const tabBtn = $(`nav.tabs button[data-tab="${target}"]`);
  if (tabBtn.length) tabBtn.click(); // trigger tab switch
});
