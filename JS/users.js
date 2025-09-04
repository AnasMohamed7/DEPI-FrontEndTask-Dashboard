$(document).ready(async function () {
  const users = await fetchData(API.users);
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const table = $("#usersTable").DataTable({
    data: users,
    columns: [
      { data: "name" },
      { data: "email" },
      { data: "company.name" },
      {
        data: null,
        render: function (data, type, row) {
          const isFav = favorites.includes(row.id) ? "fav" : "";
          return `
            <div class="actions">
              <button class="btn primary edit">Edit</button>
              <button class="btn danger delete">Delete</button>
              <span class="star ${isFav}" data-id="${row.id}">★</span>
            </div>`;
        }
      }
    ]
  });

  // Toggle favorite
  $("#usersTable tbody").on("click", ".star", function () {
    const id = $(this).data("id");
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favs.includes(id)) {
      favs = favs.filter((f) => f !== id);
      $(this).removeClass("fav");
      toastr.info("Removed from favorites");
    } else {
      favs.push(id);
      $(this).addClass("fav");
      toastr.success("Added to favorites");
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
  });

  //Edit user with prompts
  $("#usersTable tbody").on("click", ".edit", function () {
    const row = table.row($(this).parents("tr"));
    const rowData = row.data();

    if (!rowData) return;

    toastr.info(`Editing user: ${rowData.name}`);

    let newName = prompt("Edit name:", rowData.name);
    if (newName && newName.trim() !== "") {
      rowData.name = newName.trim();
    }

    let newEmail = prompt("Edit email:", rowData.email);
    if (newEmail && newEmail.trim() !== "") {
      rowData.email = newEmail.trim();
    }

    let newCompany = prompt("Edit company:", rowData.company.name);
    if (newCompany && newCompany.trim() !== "") {
      rowData.company.name = newCompany.trim();
    }

    row.data(rowData).draw(false);
    toastr.success("User updated successfully ");
  });

  // Delete user
  $("#usersTable tbody").on("click", ".delete", function () {
    const row = table.row($(this).parents("tr")).data();
    table.row($(this).parents("tr")).remove().draw();
    toastr.warning(`Deleted user: ${row.name}`);
  });
});
