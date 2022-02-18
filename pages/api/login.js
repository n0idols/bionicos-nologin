import nc from "next-connect";
import { sessionMiddleware } from "../../middlewares/session";
import { createStrapiAxios } from "@/lib/strapi";

export default nc()
  .use(sessionMiddleware)
  .post(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await createStrapiAxios()
        .post(`/auth/local`, {
          identifier: email,
          password,
        })
        .then((res) => res.data)
        .then((data) => ({
          ...data.user,
          strapiToken: data.jwt,
        }));

      if (!user.confirmed) {
        res.status(401).json({
          statusCode: 401,
          message: "User not confirmed",
        });
      }

      req.session.set("user", user);
      await req.session.save();
      res.json(user);
    } catch (error) {
      const { response: fetchResponse } = error;
      if (fetchResponse) {
        res.status(fetchResponse?.status || 500).json(error.response?.data);
      } else res.status(500).json(error);
    }
  });
