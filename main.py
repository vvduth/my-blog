from functools import wraps

from flask import Flask, render_template, redirect, url_for, flash, abort
from flask_bootstrap import Bootstrap5
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash

from forms import PostForm, RegisterForm, LoginForm
from flask_ckeditor import CKEditor, CKEditorField
from datetime import date
from flask_login import LoginManager, UserMixin, login_user,logout_user,current_user

'''
Make sure the required packages are installed: 
Open the Terminal in PyCharm (bottom left). 

On Windows type:
python -m pip install -r requirements.txt

On MacOS type:
pip3 install -r requirements.txt

This will install the packages from the requirements.txt for this project.
'''

app = Flask(__name__)
app.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap5(app)

ckeditor = CKEditor()
ckeditor.init_app(app)

# CREATE DATABASE
class Base(DeclarativeBase):
    pass
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///posts.db'
db = SQLAlchemy(model_class=Base)
db.init_app(app)

# CONFIGURE TABLES
class User(UserMixin,db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(1000))
    posts = relationship("BlogPost",back_populates="author")


class BlogPost(db.Model):
    __tablename__ = "blog_posts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(250), unique=True, nullable=False)
    subtitle: Mapped[str] = mapped_column(String(250), nullable=False)
    date: Mapped[str] = mapped_column(String(250), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    img_url: Mapped[str] = mapped_column(String(250), nullable=False)
    # Create Foreign Key, "users.id" the users refers to the tablename of User.
    author_id: Mapped[int] = mapped_column(Integer, db.ForeignKey("users.id"))
    author: Mapped[User] = relationship("User", back_populates="posts")



with app.app_context():
    db.create_all()


login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id: str) -> User | None:
    return User.query.get(int(user_id))

# decorator
def is_admin(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        user_id = current_user.get_id()
        print("user_id: ", user_id)
        if user_id == 1:
            func(*args, **kwargs)
        else:
            return abort(403)
    return decorated_func

# TODO: Use Werkzeug to hash the user's password when creating a new user.
@app.route('/register',methods = ["POST", "GET"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        email = form.email.data
        username = form.username.data
        password = form.password.data
        result = db.session.execute(db.select(User).where(User.email == email))
        is_email_existing = result.scalar()

        if is_email_existing:
            flash("Email already exists, please try again.")
            return redirect(url_for("register"))
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        new_user = User(email=email, name=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        # login_user(new_user)
        return redirect(url_for("login"))
    return render_template("register.html", form=form)


# TODO: Retrieve a user from the database based on their email.
@app.route('/login', methods = ["POST", "GET"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        result = db.session.execute(db.select(User).where(User.email == email))
        # Note, email in db is unique so will only have one result.
        user = result.scalar()
        if user:
            if check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("get_all_posts"))
            else:
                flash("Password incorrect, please try again.")
        else:
            flash("Email does not exist, please try again.")
    return render_template("login.html", form= form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('get_all_posts'), 403)



@app.route('/')
def get_all_posts():
    # TODO: Query the database for all the posts. Convert the data to a python list.
    result = db.session.execute(db.select(BlogPost))
    posts = result.scalars().all() or []
    print("posts: ", posts)
    return render_template("index.html", all_posts=[])



# TODO: Add a route so that you can click on individual posts.
@app.route('/post/<int:post_id>')
def show_post(post_id):
    # TODO: Retrieve a BlogPost from the database based on the post_id
    requested_post = db.get_or_404(BlogPost, post_id)
    return render_template("post.html", post=requested_post)


# TODO: add_new_post() to create a new blog post

@app.route('/new-post', methods=['GET', 'POST'])
@is_admin
def add_new_post():
    form = PostForm()
    if form.validate_on_submit():
        new_post = BlogPost(
            title=form.title.data,
            subtitle=form.subtitle.data,
            author=form.author.data,
            img_url=form.img_url.data,
            date=date.today().strftime("%B %d, %Y"),
            body=form.body.data
        )
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for('get_all_posts'))
    return render_template("make-post.html", form = form)

# TODO: edit_post() to change an existing blog post
@app.route('/edit-post/<int:post_id>', methods=['GET', 'POST'])
@is_admin
def edit_post(post_id):
    post_to_update = db.get_or_404(BlogPost, post_id)
    form = PostForm(
        title=post_to_update.title,
        subtitle=post_to_update.subtitle,
        author=post_to_update.author,
        img_url=post_to_update.img_url,
        body=post_to_update.body
    )
    if form.validate_on_submit():
        post_to_update.title = form.title.data
        post_to_update.subtitle = form.subtitle.data
        post_to_update.author = form.author.data
        post_to_update.img_url = form.img_url.data
        post_to_update.body = form.body.data
        db.session.commit()
        return redirect(url_for('show_post', post_id=post_id))
    return render_template("make-post.html", post_id=post_id, form=form)

# TODO: delete_post() to remove a blog post from the database
@app.route('/delete/<int:post_id>')
def delete_post(post_id):
    post_to_delete = db.get_or_404(BlogPost, post_id)
    db.session.delete(post_to_delete)
    db.session.commit()
    return redirect(url_for('get_all_posts'))

# Below is the code from previous lessons. No changes needed.
@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(debug=True, port=5003)
