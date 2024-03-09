import { z } from "zod";
import Users from "../../database/models/users";

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

    if (hasUserRegistered?.dataValues) {
      return { status: 200, response: { data: true } };
    }

    // const registerUser = await Users.create({

    // })

    return { status: 200, response: { data: true } };
  }
}

export default new CreateUser();
