const Manga = require("../models/manga");
const Author = require("../models/author");
const Genre = require("../models/genre");
const MangaInstance = require("../models/mangainstance");

const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      manga_count(callback) {
        Manga.countDocuments({}, callback);
      },
      manga_instance_count(callback) {
        MangaInstance.countDocuments({}, callback);
      },
      manga_instance_available_count(callback) {
        MangaInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all mangas.
exports.manga_list = function (req, res, next) {
  Manga.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec(function (err, list_mangas) {
      if (err) {
        return next(err);
      } else {
        // Successful, so render
        res.render("manga_list", { title: "Manga List", manga_list: list_mangas });
      }
    });
};

// Display detail page for a specific manga.
exports.manga_detail = function (req, res, next) {
  async.parallel(
    {
      manga: function (callback) {
        Manga.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      manga_instance: function (callback) {
        MangaInstance.find({ manga: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manga == null) {
        // No results.
        var err = new Error("Manga not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("manga_detail", {
        title: results.manga.title,
        manga: results.manga,
        manga_instances: results.manga_instance,
      });
    }
  );
};

// Display manga create form on GET.
exports.manga_create_get = function (req, res, next) {
  // Get all authors and genres, which we can use for adding to our manga.
  async.parallel(
    {
      authors: function (callback) {
        Author.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("manga_form", {
        title: "Create Manga",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

// Handle manga create on POST.
exports.manga_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Manga object with escaped and trimmed data.
    var manga = new Manga({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (manga.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("manga_form", {
            title: "Create Manga",
            authors: results.authors,
            genres: results.genres,
            manga: manga,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save manga.
      manga.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new manga record.
        res.redirect(manga.url);
      });
    }
  },
];

// Display manga delete form on GET.
exports.manga_delete_get = function (req, res, next) {
  async.parallel(
    {
      manga: function (callback) {
        Manga.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      manga_mangainstances: function (callback) {
        MangaInstance.find({ manga: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manga == null) {
        // No results.
        res.redirect("/catalog/mangas");
      }
      // Successful, so render.
      res.render("manga_delete", {
        title: "Delete Manga",
        manga: results.manga,
        manga_instances: results.manga_mangainstances,
      });
    }
  );
};

// Handle manga delete on POST.
exports.manga_delete_post = function (req, res, next) {
  // Assume the post has valid id (ie no validation/sanitization).

  async.parallel(
    {
      manga: function (callback) {
        Manga.findById(req.body.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      manga_mangainstances: function (callback) {
        MangaInstance.find({ manga: req.body.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.manga_mangainstances.length > 0) {
        // Manga has manga_instances. Render in same way as for GET route.
        res.render("manga_delete", {
          title: "Delete Manga",
          manga: results.manga,
          manga_instances: results.manga_mangainstances,
        });
        return;
      } else {
        // Manga has no MangaInstance objects. Delete object and redirect to the list of mangas.
        Manga.findByIdAndRemove(req.body.id, function deleteManga(err) {
          if (err) {
            return next(err);
          }
          // Success - got to mangas list.
          res.redirect("/catalog/mangas");
        });
      }
    }
  );
};

// Display manga update form on GET.
exports.manga_update_get = function (req, res, next) {
  // Get manga, authors and genres for form.
  async.parallel(
    {
      manga: function (callback) {
        Manga.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      authors: function (callback) {
        Author.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manga == null) {
        // No results.
        var err = new Error("Manga not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (
        var all_g_iter = 0;
        all_g_iter < results.genres.length;
        all_g_iter++
      ) {
        for (
          var manga_g_iter = 0;
          manga_g_iter < results.manga.genre.length;
          manga_g_iter++
        ) {
          if (
            results.genres[all_g_iter]._id.toString() ===
            results.manga.genre[manga_g_iter]._id.toString()
          ) {
            results.genres[all_g_iter].checked = "true";
          }
        }
      }
      res.render("manga_form", {
        title: "Update Manga",
        authors: results.authors,
        genres: results.genres,
        manga: results.manga,
      });
    }
  );
};

// Handle manga update on POST.
exports.manga_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Manga object with escaped/trimmed data and old id.
    var manga = new Manga({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (manga.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("manga_form", {
            title: "Update Manga",
            authors: results.authors,
            genres: results.genres,
            manga: manga,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      Manga.findByIdAndUpdate(req.params.id, manga, {}, function (err, themanga) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to manga detail page.
        res.redirect(themanga.url);
      });
    }
  },
];