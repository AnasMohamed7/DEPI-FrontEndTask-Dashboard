// Base API URLs
const API = {
  users: "https://jsonplaceholder.typicode.com/users",
  posts: "https://jsonplaceholder.typicode.com/posts",
  comments: (id) => `https://jsonplaceholder.typicode.com/comments?postId=${id}`
};

// Fetch wrapper with loader
async function fetchData(url) {
  $("#loader").show();
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    toastr.error("Error fetching data");
    console.error(err);
  } finally {
    $("#loader").fadeOut();
  }
}
