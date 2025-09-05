$(document).ready(async function () {
  let posts = await fetchData(API.posts);

  function renderPosts(list) {
    const container = $("#postsList");
    container.empty();

    list.forEach((p) => {
      container.append(`
        <div class="post animate__animated animate__fadeInUp" data-id="${p.id}">
          <h4>${p.title}</h4>
          <p>${p.body}</p>
          <div class="actions">
            <button class="btn primary edit" data-id="${p.id}">Edit</button>
            <button class="btn danger delete" data-id="${p.id}">Delete</button>
            <button class="btn warn comments" data-id="${p.id}">Comments</button>
          </div>
          <div class="comments" id="comments-${p.id}" style="display:none;"></div>
        </div>
      `);
    });
  }

  renderPosts(posts);

  // Live search
  $("#searchPost").on("input", function () {
    const q = $(this).val().toLowerCase();
    const filtered = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
    renderPosts(filtered);
  });

  //  Create new post
  $("#createPost").on("click", function () {
    let title = prompt("Enter post title:");
    if (!title || title.trim() === "") return toastr.error("Title is required!");

    let body = prompt("Enter post body:");
    if (!body || body.trim() === "") return toastr.error("Body is required!");

    const newPost = {
      id: Date.now(), // fake ID
      title: title.trim(),
      body: body.trim(),
    };

    posts.unshift(newPost); // add on top
    renderPosts(posts);
    toastr.success("Post created successfully ");
  });

  //  Edit post
  $(document).on("click", ".edit", function () {
    const id = $(this).data("id");
    let post = posts.find((p) => p.id === id);

    if (!post) return;

    toastr.info(`Editing post: ${post.title}`);

    let newTitle = prompt("Edit title:", post.title);
    if (newTitle && newTitle.trim() !== "") post.title = newTitle.trim();

    let newBody = prompt("Edit body:", post.body);
    if (newBody && newBody.trim() !== "") post.body = newBody.trim();

    renderPosts(posts);
    toastr.success("Post updated successfully ");
  });

  //  Delete post
  $(document).on("click", ".delete", function () {
    const id = $(this).data("id");
    posts = posts.filter((p) => p.id !== id);
    renderPosts(posts);
    toastr.warning(`Deleted post ID: ${id}`);
  });

  //  Show comments
  $(document).on("click", ".comments", async function () {
    const id = $(this).data("id");
    const box = $(`#comments-${id}`);

    if (box.is(":visible")) {
      box.slideUp();
      return;
    }

    box.empty().append("<p>Loading comments...</p>").slideDown();
    const comments = await fetchData(API.comments(id));

    box.empty();
    comments.forEach((c) => {
      box.append(`<p class="muted"><strong>${c.email}</strong>: ${c.body}</p>`);
    });
  });
});
