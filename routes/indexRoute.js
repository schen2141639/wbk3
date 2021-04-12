const { json } = require("express");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { accountModel } = require("../models/accountModel");


router.get("/admin",ensureAuthenticated, isAdmin, (req, res) => {
  req.sessionStore.all((error, sessions)=> {
    sessions = Object.entries(JSON.parse(JSON.stringify(sessions))).map((e) => ( { user: {...e[1], id: e[0]}, } ));
    res.render("sessionList",{sessions});
  })
  
});

router.get("/revoke/:sessionId", ensureAuthenticated, isAdmin, (req, res) => {
  req.sessionStore.destroy(req.params.sessionId, (err, _) => {
    res.redirect('/admin');
  });
})

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const account = userController.getUserAccount(req.user.username, req);
  res.render("dashboard", {
    user: req.user,
    total: [{"chequing": req.user.chequing, "savings": req.user.savings}],
    account: {
      accountNumber: req.user.savings,
      ...account
    }
  });
});

router.get("/balance", ensureAuthenticated, (req, res) => {
  const account = userController.getAccountDetails(req.query.acc);
  res.render("balance", {
    loggedInUser: req.user,
    account: {
      accountNumber: req.query.acc,
      ...account
    }
  });
});

router.get("/deposit", ensureAuthenticated, (req, res) => {
  const account = userController.getAccountDetails(req.query.acc);
  res.render("deposit", {
    loggedInUser: req.user,
    account: {
      accountNumber: req.query.acc,
      ...account
    }
  });
});

router.post("/deposit", ensureAuthenticated, (req, res) => {
  accountModel.depositMoney(req.body.accountNumber, +req.body.depositAmount)
  const account = userController.getAccountDetails(req.body.accountNumber);
  res.render("deposit", {
    loggedInUser: req.user,
    account: {
      accountNumber: req.body.accountNumber,
      ...account
    }
  });
});

router.get("/openAccount", ensureAuthenticated, (req, res) => {
  res.render("openAccount", {
    user: req.user,
  });
});

router.post("/openAccount", ensureAuthenticated, (req, res) => {
  const newAccount = userController.createAccount(req.body);
  res.render("openAccount", {
    user: req.user,
    message: `${newAccount.accountType} Account ${newAccount.accountNumber} created successfully.`
  });
});

router.get("/withdraw", ensureAuthenticated, (req, res) => {
  const account = userController.getAccountDetails(req.query.acc);
  res.render("withdrawl", {
    loggedInUser: req.user,
    account: {
      accountNumber: req.query.acc,
      ...account
    }
  });
});

router.post("/withdraw", ensureAuthenticated, (req, res) => {
  accountModel.withdrawMoney(req.body.accountNumber, +req.body.withdrawlAmount)
  const account = userController.getAccountDetails(req.body.accountNumber);
  res.render("withdrawl", {
    loggedInUser: req.user,
    account: {
      accountNumber: req.body.accountNumber,
      ...account
    }
  });
});

module.exports = router;
