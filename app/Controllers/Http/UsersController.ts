import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  // public async index({}: HttpContextContract) {}

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  // public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  // public async update({}: HttpContextContract) {}

  // public async destroy({}: HttpContextContract) {}'

  public async postsByUser({ auth }: HttpContextContract) {
    const user = await auth.authenticate();
    await user.preload("posts");
    const post = user.posts;
    return post;
  }

  public async forumsByUser({ auth }: HttpContextContract) {
    const user = await auth.authenticate();
    await user.preload("forums");
    const forums = user.forums;

    return forums;
  }
}
