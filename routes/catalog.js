const express = require("express");
const router = express.Router();

// Require controller modules.
const manga_controller = require("../controllers/mangaController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const manga_instance_controller = require("../controllers/mangainstanceController");

/// MANGA ROUTES ///

// GET catalog home page.
router.get("/", manga_controller.index);

// GET request for creating a manga. NOTE This must come before routes that display Manga (uses id).
router.get("/manga/create", manga_controller.manga_create_get);

// POST request for creating Manga.
router.post("/manga/create", manga_controller.manga_create_post);

// GET request to delete Manga.
router.get("/manga/:id/delete", manga_controller.manga_delete_get);

// POST request to delete Manga.
router.post("/manga/:id/delete", manga_controller.manga_delete_post);

// GET request to update Manga.
router.get("/manga/:id/update", manga_controller.manga_update_get);

// POST request to update Manga.
router.post("/manga/:id/update", manga_controller.manga_update_post);

// GET request for one Manga.
router.get("/manga/:id", manga_controller.manga_detail);

// GET request for list of all Manga items.
router.get("/mangas", manga_controller.manga_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", author_controller.author_create_get);

// POST request for creating Author.
router.post("/author/create", author_controller.author_create_post);

// GET request to delete Author.
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST request to delete Author.
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET request to update Author.
router.get("/author/:id/update", author_controller.author_update_get);

// POST request to update Author.
router.post("/author/:id/update", author_controller.author_update_post);

// GET request for one Author.
router.get("/author/:id", author_controller.author_detail);

// GET request for list of all Authors.
router.get("/authors", author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// MANGAINSTANCE ROUTES ///

// GET request for creating a MangaInstance. NOTE This must come before route that displays MangaInstance (uses id).
router.get(
  "/mangainstance/create",
  manga_instance_controller.mangainstance_create_get
);

// POST request for creating MangaInstance.
router.post(
  "/mangainstance/create",
  manga_instance_controller.mangainstance_create_post
);

// GET request to delete MangaInstance.
router.get(
  "/mangainstance/:id/delete",
  manga_instance_controller.mangainstance_delete_get
);

// POST request to delete MangaInstance.
router.post(
  "/mangainstance/:id/delete",
  manga_instance_controller.mangainstance_delete_post
);

// GET request to update MangaInstance.
router.get(
  "/mangainstance/:id/update",
  manga_instance_controller.mangainstance_update_get
);

// POST request to update MangaInstance.
router.post(
  "/mangainstance/:id/update",
  manga_instance_controller.mangainstance_update_post
);

// GET request for one MangaInstance.
router.get("/mangainstance/:id", manga_instance_controller.mangainstance_detail);

// GET request for list of all MangaInstance.
router.get("/mangainstances", manga_instance_controller.mangainstance_list);

module.exports = router;
