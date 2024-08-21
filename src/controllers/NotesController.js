const knex = require("../database/knex");
const AppError = require("../utils/AppError")

class NotesController {
  async create(request, response){
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    if(rating < 1 || rating > 5){
      throw new AppError("Avalie o rating com um número de 1 á 5");
    };

    const [ note_id ] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });

    await knex("tags").insert(tagsInsert);

    response.json();
  };

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    return response.json({
      ...note,
      tags
    });
  };

  async delete(request, response){
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  };

  async index(request, response) {
    const { user_id } = request.query;
    
    const notes = await knex("notes").where( { user_id } ).orderBy("title");

    return response.json(notes);
  }
};

module.exports = NotesController;