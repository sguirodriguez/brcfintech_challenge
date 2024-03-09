import { z } from "zod";
import Users from "../../database/models/users";

const userSchema = z.object({
  id: z.number(),
});

type User = z.infer<typeof userSchema>;

class FindUser {
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

    return { status: 200, response: { data: hasUserRegistered } };
  }
}

export default new FindUser();
