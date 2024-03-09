import { z } from "zod";
import Users from "../../database/models/users";
import Wallets from "../../database/models/wallets";

const userSchema = z.object({
  id: z.number(),
});

type User = z.infer<typeof userSchema>;

class DeleteUser {
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

    const findWalletsUser = await Wallets.findAll({
      where: {
        userId: hasUserRegistered.id,
      },
    });

    if (findWalletsUser.length === 0) {
      hasUserRegistered.destroy();

      return { status: 200, response: { data: true } };
    }

    const mappingIds = findWalletsUser.map((item) => item.id);

    await Wallets.destroy({ where: { id: mappingIds } });

    hasUserRegistered.destroy();

    return { status: 200, response: { data: true } };
  }
}

export default new DeleteUser();
