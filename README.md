# Blog Web Application

This project is a full-stack web application built using Flask, a micro web framework for Python. The application serves as a blogging platform where users can register, log in, create, edit, and delete blog posts. It also includes features for users to leave comments on posts.

## Technologies Used

- **Backend:** Python, Flask, SQLAlchemy, Flask-Login, Flask-WTF, Flask-Bootstrap, Flask-CKEditor
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Database:** PostgreSQL (with fallback to SQLite)
- **Deployment:** Gunicorn, Procfile for deployment configuration

## Key Features

1. **User Authentication:**
   - User registration and login functionality using Flask-Login.
   - Password hashing for secure storage using Werkzeug.

2. **Blog Post Management:**
   - Create, edit, and delete blog posts.
   - Rich text editing for blog content using Flask-CKEditor.
   - Image URL support for blog post headers.

3. **Comment System:**
   - Users can leave comments on blog posts.
   - Gravatar integration for user avatars in comments.

4. **Admin Privileges:**
   - Admin users can create, edit, and delete any blog post.
   - Admin users can manage comments.

5. **Responsive Design:**
   - Frontend built with Bootstrap for a responsive and modern design.
   - Custom templates for different pages (home, about, contact, post details).

6. **Email Notifications:**
   - Contact form with email notifications using SMTP.

7. **Environment Configuration:**
   - Environment variables for sensitive information (e.g., database URI, email credentials).

8. **Deployment:**
   - Configured for deployment using Gunicorn and a Procfile.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/vvduth/advance-blog.git
   cd advance-blog
   ```

2. Create a virtual environment and activate it:
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On MacOS/Linux
   ```

3. Install the required packages:
   ```sh
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```dotenv
   FLASK_KEY=your_secret_key
   BACKUP=sqlite:///posts.db
   MY_EMAIL=your_email@example.com
   MY_PASSWORD=your_email_password
   DB_URI=your_database_uri
   ```

5. Initialize the database:
   ```sh
   flask db init
   flask db migrate
   flask db upgrade
   ```

## Running the Application

1. Run the Flask application:
   ```sh
   flask run
   ```

2. Open your web browser and go to `http://127.0.0.1:5000/`.

## Deployment

1. Install Gunicorn:
   ```sh
   pip install gunicorn
   ```

2. Create a `Procfile` in the root directory with the following content:
   ```sh
   web: gunicorn main:app
   ```

3. Deploy to your preferred platform (e.g., Heroku, AWS).

## Example Code Snippets

**User Registration:**
```python
@app.route('/register', methods=["POST", "GET"])
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
        return redirect(url_for("login"))
    return render_template("register.html", form=form)
```

**Creating a New Blog Post:**
```python
@app.route('/new-post', methods=['GET', 'POST'])
@is_admin
def add_new_post():
    form = PostForm()
    if form.validate_on_submit():
        new_post = BlogPost(
            title=form.title.data,
            subtitle=form.subtitle.data,
            img_url=form.img_url.data,
            date=date.today().strftime("%B %d, %Y"),
            body=form.body.data,
            author=current_user
        )
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for('get_all_posts'))
    return render_template("make-post.html", form=form)
```

**Comment System:**
```python
@app.route('/post/<int:post_id>', methods=['GET', 'POST'])
def show_post(post_id):
    requested_post = db.get_or_404(BlogPost, post_id)
    comments = requested_post.comments
    form = CommentForm()
    if form.validate_on_submit():
        new_comment = Comment(
            text=form.comment_text.data,
            author=current_user,
            post=requested_post
        )
        db.session.add(new_comment)
        db.session.commit()
        flash("Comment added")
        return redirect(url_for('show_post', post_id=post_id))
    return render_template("post.html", post=requested_post, form=form, comments=comments, gravatar_url=gravatar_url)
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.