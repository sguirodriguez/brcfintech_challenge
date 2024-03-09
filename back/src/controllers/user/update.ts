import { z } from "zod";
import Users from "../../database/models/users";

const userSchema = z.object({
  id: z.number(),
  username: z.string().min(3, { message: "O nome precisa de  3 carateres." }),
});

type User = z.infer<typeof userSchema>;

class UpdateUser {
  async execute(user: User) {
    const validate = userSchema.safeParse(user);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasUserRegistered = await Users.findOne({
      where: {
        id: user.id,
      },
    });

    if (!hasUserRegistered) {
      return { status: 500, response: { error: "Usuário não existe" } };
    }

    const updatedUser = await hasUserRegistered.update({
      username: user.username,
    });

    return { status: 200, response: { data: updatedUser } };
  }
}

export default new UpdateUser();
