import nc from "next-connect";
import { sessionMiddleware } from "../../middlewares/session";
import { createStrapiAxios } from "@/lib/strapi";

export default nc()
  .use(sessionMiddleware)
  .post(async (req, res) => {
    req.session.destroy();
    res.send();
  });
