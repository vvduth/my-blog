from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, URL
from flask_ckeditor import CKEditorField

# POST FORM
# MAKE form
class PostForm(FlaskForm):
    title = StringField("Post Title", validators=[DataRequired()])
    subtitle = StringField("Post Subtitle", validators=[DataRequired()])
    author = StringField("Post Author", validators=[DataRequired()])
    img_url = StringField("Image URL", validators=[DataRequired(), URL()])
    body = CKEditorField("Post Content", validators=[DataRequired()])
    submit = SubmitField("Submit Post")

# TODO: Create a RegisterForm to register new users


# TODO: Create a LoginForm to login existing users


# TODO: Create a CommentForm so users can leave comments below posts
