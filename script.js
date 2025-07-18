// index.html için galeri yükleme
if (document.getElementById("albums")) {
  fetch("albums.json")
    .then((res) => res.json())
    .then((data) => {
      const gallery = document.getElementById("albums");
      data.forEach((album) => {
        const div = document.createElement("div");
        div.className = "album";
        div.innerHTML = `
          <img src="${album.image}" alt="${album.title}" />
          <div class="album-title">${album.title}</div>
        `;
        gallery.appendChild(div);
      });
    });
}

// admin login
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const errorEl = document.getElementById("login-error");

  if (u === "admin" && p === "123") {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("upload-section").classList.remove("hidden");
    loadAlbumList();
  } else {
    errorEl.textContent = "Kullanıcı adı veya şifre hatalı.";
  }
}

// admin panel albüm yükleme
function uploadAlbum() {
  const title = document.getElementById("album-title").value;
  const fileInput = document.getElementById("album-image");
  const msg = document.getElementById("upload-msg");

  if (!title || fileInput.files.length === 0) {
    msg.textContent = "Lütfen başlık ve fotoğraf seçiniz.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const imageDataUrl = reader.result;

    fetch("albums.json")
      .then((res) => res.json())
      .then((albums) => {
        albums.push({ title: title, image: imageDataUrl });
        return saveAlbums(albums);
      })
      .then(() => {
        msg.textContent = "Albüm başarıyla yüklendi.";
        loadAlbumList();
      });
  };

  reader.readAsDataURL(fileInput.files[0]);
}

function loadAlbumList() {
  const list = document.getElementById("album-list");
  list.innerHTML = "";

  fetch("albums.json")
    .then((res) => res.json())
    .then((albums) => {
      albums.forEach((album, index) => {
        const li = document.createElement("li");
        li.style.marginBottom = "10px";
        li.innerHTML = `
          ${album.title}
          <button onclick="deleteAlbum(${index})">Sil</button>
        `;
        list.appendChild(li);
      });
    });
}

function deleteAlbum(index) {
  fetch("albums.json")
    .then((res) => res.json())
    .then((albums) => {
      albums.splice(index, 1);
      return saveAlbums(albums);
    })
    .then(() => {
      loadAlbumList();
    });
}

// "saveAlbums" yalnızca demo için local çalışır, gerçek sunucu gerekebilir
function saveAlbums(albums) {
  return new Promise((resolve) => {
    localStorage.setItem("albums", JSON.stringify(albums));
    resolve();
  });
}
