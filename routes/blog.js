const router = require("koa-router")();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const loginCheck = require("../middleware/loginCheck");

router.prefix("/api/blog");

// list
router.get("/list", loginCheck, async (ctx, next) => {
  const author = ctx.query.author || "";
  const keyword = ctx.query.keyword || "";
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData);
});

// detail
router.get("/detail", loginCheck, async (ctx, next) => {
  const data = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(data);
});

// new
router.post("/new", loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username;
  const data = await newBlog(body);
  ctx.body = new SuccessModel(data);
});

// update
router.post("/update", loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  const data =  await getDetail(ctx.query.id,body);
    if (data) {
      ctx.body = new SuccessModel(data)
      return;
    }
    ctx.body = new ErrorModel("新增博客失败")
});
// del
router.post("/del", loginCheck, async (ctx, next) => {
  const author = ctx.session.username;
  const id =ctx.request.body.id;
  const data = await delBlog(id, author);
  if (data) {
    ctx.body = new SuccessModel(data)
    return;
  }
  ctx.body = new ErrorModel("删除博客失败")
});

// router.get("/bar", async (ctx, next) => {
//   ctx.body = "this is a users/bar response";
// });

module.exports = router;
