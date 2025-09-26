from flask import request, jsonify
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from schemas import PostSchema

def create_posts_blueprint(mysql):
    posts_blp = Blueprint("posts", __name__, description="Operations on posts", url_prefix="/posts")

    @posts_blp.route("/")
    class PostList(MethodView):
        @posts_blp.response(200, PostSchema(many=True))
        def get(self):
            cursor = mysql.connection.cursor(dictionary=True)
            sql = """
                SELECT p.id, p.title, p.content, p.created_at, u.id as user_id, u.username 
                FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC
            """
            cursor.execute(sql)
            posts = cursor.fetchall()
            cursor.close()
           
            for post in posts:
                post['author'] = {'id': post['user_id'], 'username': post['username']}
            return posts
        
        @jwt_required()
        @posts_blp.arguments(PostSchema)
        @posts_blp.response(201, PostSchema)
        def post(self, new_post):
            user_id = get_jwt_identity()
            sql = "INSERT INTO posts (title, content, user_id) VALUES (%s, %s, %s)"
            cursor = mysql.connection.cursor()
            cursor.execute(sql, (new_post["title"], new_post["content"], user_id))
            mysql.connection.commit()
            
            new_post_id = cursor.lastrowid
            cursor.close()
            
           
            cursor = mysql.connection.cursor(dictionary=True)
            cursor.execute("SELECT username FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            cursor.close()

            created_post = {**new_post, "id": new_post_id, "author": {"id": user_id, "username": user['username']}}
            return created_post

    @posts_blp.route("/<int:post_id>")
    class Post(MethodView):
        
        pass

    return posts_blp