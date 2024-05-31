import sql from "../database.mjs";

export const userPost = async (req, res) => {
  try {
    //check table  exist or not
    await sql`create table if not exists post(id serial primary key,pictureLink text default 'picture',post text not null,userid numeric not null )`;
    const columns = ["post", "userid", "picturelink"];

    const newPost = await sql`insert into post ${sql(
      {
        userid: Number(req.body.userid),
        post: req.body.post,
        picturelink: req.file.path,
      },
      columns
    )} `;

    return res.status(201).json({
      success: true,
      message: "post created",
      newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error,
    });
  }
};

export const postComment = async (req, res) => {
  try {
    //check table  exist or not
    await sql`create table if not exists comments(id serial primary key,postid numeric not null,commentatorid numeric not null,comment text default "ok",likes numeric default 0 )`;

    const columns = ["postid", "commentatorid", "comment"];

    const newComment = await sql`insert into comments ${sql(
      { ...req.body, commentatorid: req.body.id },
      columns
    )}`;

    return res.status(201).json({
      success: true,
      message: "commented",
      newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error,
    });
  }
};

//for like function

export const postlike = async (req, res) => {
  try {
    //check table  exist or not
    await sql`create table if not exists comments(id serial primary key,postid numeric not null,commentatorid numeric not null,comment text default "ok",likes numeric default 0 )`;

    const columns = ["likes"];

    const likes = await sql`insert into comments ${sql(
      { likes: 1 },
      columns
    )} where postid=${req.body.postid} and commentatorid=${req.body.id}`;

    return res.status(201).json({
      success: true,
      message: "liked",
      likes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error,
    });
  }
};
