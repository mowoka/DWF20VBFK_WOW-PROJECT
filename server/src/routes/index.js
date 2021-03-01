const express = require("express");
const router = express.Router();
const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/upload");
const { uploadFileImage } = require("../middlewares/uploadImage");
const { uploadFileImageProfile } = require("../middlewares/uploadImageProfile");
const { isAdmin } = require("../middlewares/cekRole");
const { isUser } = require("../middlewares/cekRoleUser");

const { register, login, cekAuth } = require("../controllers/registerLogin");
const { getUser, delUser } = require("../controllers/getDelUser");
const {
  getBook,
  getDetailBook,
  addBook,
  editBook,
  deleteBook,
} = require("../controllers/booksController");

const {
  addTransaction,
  editTransaction,
  getTransaction,
  getTransactions,
} = require("../controllers/TransactionController");

const {
  getProfiles,
  addProfile,
  getProfile,
  editProfile,
  addInstanceProfile,
} = require("../controllers/ProfileControlle");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", authenticated, cekAuth);

router.get("/users", getUser);
router.delete("/user/:id", delUser);

router.get("/books", getBook);
router.get("/book/:id", getDetailBook);
router.post("/book", authenticated, isAdmin, uploadFile("epubFile"), addBook);
router.patch(
  "/book/:id",
  authenticated,
  isAdmin,
  uploadFile("epubFile"),
  editBook
);
router.delete("/book/:id", authenticated, isAdmin, deleteBook);

router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransaction);
router.post(
  "/transaction",
  authenticated,
  isUser,
  uploadFileImage("imageFile"),
  addTransaction
);
router.patch("/transaction/:id", authenticated, isAdmin, editTransaction);

router.get("/profiles", getProfiles);
router.post(
  "/add-profile",
  authenticated,
  isUser,
  uploadFileImageProfile("profileImage"),
  addProfile
);
router.post(
  "/add-profile-admin",
  authenticated,
  isAdmin,
  uploadFileImageProfile("profileImage"),
  addProfile
);
router.post("/add-instance-profile", authenticated, isUser, addInstanceProfile);
router.get("/profile", authenticated, isUser, getProfile);
router.patch(
  "/edit-profile",
  authenticated,
  isUser,
  uploadFileImageProfile("profileImage"),
  editProfile
);

module.exports = router;
