const AsyncHandler = require("../middlewares/asyncHandler");
const Book = require("../models/Book");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Chat = require("../models/Chat");
const { isFloatLocales } = require("validator");
const Message = require("../models/Message");

// @desc      Get Single Books
// @route     GET /api/v1/book/:bookId
// @access    Public
module.exports.createChat = AsyncHandler(async (req, res, next) => {
  const order = await Transaction.find({
    _id: req.body.order,
  });

  const c = await Chat.find({
    order: order[0]._id,
  });

  if (c[0]) {
    return res.status(200).json({
      success: true,
      data: c[0],
      message: "Chat already exits",
    });
  }

  //console.log(order[0])
  //console.log(req.user._id.toString(), order[0].user.toString(), req.user._id === order[0].user)
  if (order[0] && req.user._id.toString() === order[0].user.toString()) {
    console.log(order);
    const book = await Book.findById(order[0].book);
    console.log(book);
    const chat = await Chat.create({
      order: req.body.order,
      chatName: book.name,
      user: [book.user, order[0].user],
    });
    return res.status(200).json({
      success: true,
      data: chat,
    });
  } else if (order[0]) {
    const book = await Book.findById(order[0].book);
    if (req.user._id.toString() === book.user.toString()) {
      const chat = await Chat.create({
        order: req.body.order,
        chatName: book.name,
        user: [book.user, order[0].user],
      });
      return res.status(200).json({
        success: true,
        data: chat,
      });
    }
  }
  res.status(404).json({
    success: false,
    data: {},
    message: "Order not found",
  });
});

module.exports.getAllChat = AsyncHandler(async (req, res, next) => {
  let books = await Book.find({ user: req.user._id }).select("_id");
  let orders = await Transaction.find({
    book: {
      $in: books,
    },
  });

  const order = await Transaction.find({
    user: req.user._id,
  });

  let myOrders = await Transaction.find({ user: req.user._id }).select("_id");

  let data = [...orders, ...myOrders];
  let chats = await Chat.find({
    order: {
      $in: data,
    },
    isDisabled: false,
  });
  res.status(404).json({
    success: true,
    data: chats,
  });
});

module.exports.createMessage = AsyncHandler(async (req, res, next) => {
  let chats = await Chat.find({
    _id: req.params.id,
    isDisabled: false,
  });

  if (chats[0]) {
    let receiver =
      chats[0].user[0].toString() === req.user._id.toString()
        ? chats[0].user[1]
        : chats[0].user[0];
    let message = await Message.create({
      chatId: req.params.id,
      sender: req.user._id,
      receiver: receiver,
      message: req.body.message,
    });
    return res.status(404).json({
      success: true,
      data: message,
    });
  }
  res.status(404).json({
    success: false,
    data: {},
    message: "Chat not found",
  });
});

module.exports.getAllMessage = AsyncHandler(async (req, res, next) => {
  let chats = await Chat.find({
    _id: req.params.id,
    isDisabled: false,
  });

  if (chats[0]) {
    let receiver =
      chats[0].user[0].toString() === req.user._id.toString()
        ? user[1]
        : user[0];
    let message = await Message.find({
      chatId: req.params.id,
      sender: req.user._id,
      receiver: receiver,
      message: req.body.message,
    });
    return res.status(404).json({
      success: true,
      data: message,
    });
  }
  res.status(404).json({
    success: false,
    data: {},
    message: "Chat not found",
  });
});
