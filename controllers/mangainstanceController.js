const MangaInstance = require("../models/mangainstance");
const Manga = require("../models/manga");
const async = require("async");

const { body, validationResult } = require("express-validator");

// Display list of all MangaInstances.
exports.mangainstance_list = function (req, res, next) {
  MangaInstance.find()
    .populate("manga")
    .exec(function (err, list_mangainstances) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("mangainstance_list", {
        title: "Manga Instance List",
        mangainstance_list: list_mangainstances,
      });
    });
};

// Display detail page for a specific MangaInstance.
exports.mangainstance_detail = function (req, res, next) {
  MangaInstance.findById(req.params.id)
    .populate("manga")
    .exec(function (err, mangainstance) {
      if (err) {
        return next(err);
      }
      if (mangainstance == null) {
        // No results.
        var err = new Error("Manga copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("mangainstance_detail", {
        title: "Manga:",
        mangainstance: mangainstance,
      });
    });
};

// Display MangaInstance create form on GET.
exports.mangainstance_create_get = function (req, res, next) {
  Manga.find({}, "title").exec(function (err, mangas) {
    if (err) {
      return next(err);
    }
    // Successful, so render.
    res.render("mangainstance_form", {
      title: "Create MangaInstance",
      manga_list: mangas,
    });
  });
};

// Handle MangaInstance create on POST.
exports.mangainstance_create_post = [
  // Validate and sanitize fields.
  body("manga", "Manga must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a MangaInstance object with escaped and trimmed data.
    var mangainstance = new MangaInstance({
      manga: req.body.manga,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      Manga.find({}, "title").exec(function (err, mangas) {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("mangainstance_form", {
          title: "Create MangaInstance",
          manga_list: mangas,
          selected_manga: mangainstance.manga._id,
          errors: errors.array(),
          mangainstance: mangainstance,
        });
      });
      return;
    } else {
      // Data from form is valid
      mangainstance.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new record.
        res.redirect(mangainstance.url);
      });
    }
  },
];

// Display MangaInstance delete form on GET.
exports.mangainstance_delete_get = function (req, res, next) {
  MangaInstance.findById(req.params.id)
    .populate("manga")
    .exec(function (err, mangainstance) {
      if (err) {
        return next(err);
      }
      if (mangainstance == null) {
        // No results.
        res.redirect("/catalog/mangainstances");
      }
      // Successful, so render.
      res.render("mangainstance_delete", {
        title: "Delete MangaInstance",
        mangainstance: mangainstance,
      });
    });
};

// Handle MangaInstance delete on POST.
exports.mangainstance_delete_post = function (req, res, next) {
  // Assume valid MangaInstance id in field.
  MangaInstance.findByIdAndRemove(req.body.id, function deleteMangaInstance(err) {
    if (err) {
      return next(err);
    }
    // Success, so redirect to list of MangaInstance items.
    res.redirect("/catalog/mangainstances");
  });
};

// Display MangaInstance update form on GET.
exports.mangainstance_update_get = function (req, res, next) {
  // Get manga, authors and genres for form.
  async.parallel(
    {
      mangainstance: function (callback) {
        MangaInstance.findById(req.params.id).populate("manga").exec(callback);
      },
      mangas: function (callback) {
        Manga.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.mangainstance == null) {
        // No results.
        var err = new Error("Manga copy not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("mangainstance_form", {
        title: "Update MangaInstance",
        manga_list: results.mangas,
        selected_manga: results.mangainstance.manga._id,
        mangainstance: results.mangainstance,
      });
    }
  );
};

// Handle MangaInstance update on POST.
exports.mangainstance_update_post = [
  // Validate and sanitize fields.
  body("manga", "Manga must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a MangaInstance object with escaped/trimmed data and current id.
    var mangainstance = new MangaInstance({
      manga: req.body.manga,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors so render the form again, passing sanitized values and errors.
      Manga.find({}, "title").exec(function (err, mangas) {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("mangainstance_form", {
          title: "Update MangaInstance",
          manga_list: mangas,
          selected_manga: mangainstance.manga._id,
          errors: errors.array(),
          mangainstance: mangainstance,
        });
      });
      return;
    } else {
      // Data from form is valid.
      MangaInstance.findByIdAndUpdate(
        req.params.id,
        mangainstance,
        {},
        function (err, themangainstance) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to detail page.
          res.redirect(themangainstance.url);
        }
      );
    }
  },
];