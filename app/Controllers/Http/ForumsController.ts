import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import Cache from "@ioc:Kaperskyguru/Adonis-Cache";
import Forum from "App/Models/Forum";

export default class ForumsController {
  public async test({}: HttpContextContract) {
    Logger.info("Forums retrieved successfully");

    return {
      hello: "world",
    };
  }

  public async index({ logger }: HttpContextContract) {
    const forums = await Forum.query().preload("users").preload("posts");
    logger.info("Forums retrived successfully ");
    return forums;
  }

  public async indexWithoutCache({}: HttpContextContract) {
    await Cache.flush();
    return await Forum.query().preload("users").preload("posts");
  }

  public async show({ params }: HttpContextContract) {
    try {
      const forum = await Cache.remember(
        "forum_id" + params.id,
        60,
        async () => {
          return await Forum.find(params.id);
        }
      );

      if (forum) {
        await forum.preload("user");
        await forum.preload("posts");
        Logger.info({ ForumId: params.id }, `Forum retrive successfully`);
        return forum;
      }
    } catch (error) {
      Logger.error({ err: new Error(error) }, "Get Single Forum");
      console.log(error);
    }
  }

  public async store({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate();
    const forum = new Forum();

    forum.title = request.input("title");
    forum.description = request.input("description");

    await user.related("forums").save(forum);

    if (forum) {
      Logger.info({ ForumId: forum.id }, `Forum created successfully !!!`);
      await Cache.set("forum_id" + forum.id, forum, 60);
      return forum;
    }
    Logger.info({ Forum: forum }, `Forum fail to be created`);
    return;
  }

  // public async edit({}: HttpContextContract) {}

  public async update({ request, params }: HttpContextContract) {
    const forum = await Cache.remember("forum_id" + params.id, 60, async () => {
      return await Forum.find(params.id);
    });
    Logger.info(
      {
        ForumId: params.id,
      },
      `Forum retrived successfully`
    );

    if (forum) {
      forum.title = request.input("title");
      forum.description = request.input("description");
      if (await forum.save()) {
        await forum.preload("user");
        await forum.preload("posts");

        Logger.info({ ForumId: params.id }, `Forum updated successfully !!!`);
        await Cache.update("forum_id" + params.id, forum, 60);
        return forum;
      }
      Logger.error(
        {
          ForumId: params.id,
        },
        ` Forum failed to update`
      );
      return; // 422
    }
    Logger.error(
      {
        ForumId: params.id,
      },
      `Forum not found`
    );
    return; // 401
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const user = await auth.authenticate();
    Logger.info(
      {
        UserId: user.id,
      },
      `User auth successfully`
    );
    const forum = await Forum.query()
      .where("user_id", user.id)
      .where("id", params.id)
      .delete();

    Logger.info({ UserID: user.id }, `Forum deleted: ${forum}`);
    await Cache.delete("forum_id" + params.id);
    return 404;
  }
}
