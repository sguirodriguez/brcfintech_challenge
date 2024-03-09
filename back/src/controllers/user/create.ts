import { z } from "zod";
import Users from "../../database/models/users";
import jwt from "../../services/partners/jwt";

const userSchema = z.object({
  username: z.string().min(3, { message: "O nome precisa de  3 carateres." }),
});

type User = z.infer<typeof userSchema>;

class CreateUser {
  async execute(user: User) {
    const validate = userSchema.safeParse(user);

    if (!validate.success) {
      return {
        status: 500,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasUserRegistered = await Users.findOne({
      where: {
        username: user.username,
      },
    });

    const token = jwt.generateToken(user);

    if (hasUserRegistered?.dataValues) {
      await hasUserRegistered.update({
        token,
      });
      return { status: 200, response: { data: true } };
    }

    const registerUser = await Users.create({
      ...user,
      token,
    });

    if (registerUser) {
      return {
        status: 500,
        response: { error: "Não foi possível criar usuário" },
      };
    }

    return { status: 200, response: { data: registerUser } };
  }
}

export default new CreateUser();
