# Blog Web Application

This project is a full-stack web application built using Flask, a micro web framework for Python. The application serves as a blogging platform where users can register, log in, create, edit, and delete blog posts. It also includes features for users to leave comments on posts.

## 🌐 Live Demo

**The application is live and deployed on AWS EC2!**  
**Visit: [https://dukemblog.xyz/](https://dukemblog.xyz/)**

Experience the full functionality including user registration, blog creation, commenting system, and admin features in a production environment running on Amazon Linux 2023 with Nginx and Gunicorn.

## Technologies Used

- **Backend:** Python, Flask, SQLAlchemy, Flask-Login, Flask-WTF, Flask-Bootstrap, Flask-CKEditor
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Database:** PostgreSQL (Neon Database) with SQLite fallback
- **Deployment:** 
  - **Cloud Platform:** AWS EC2 (Amazon Linux 2023, t2.micro free tier)
  - **Web Server:** Nginx (reverse proxy)
  - **WSGI Server:** Gunicorn
  - **Process Management:** systemd service
- **Version Control:** Git/GitHub

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

8. **Production Deployment:**
   - Configured for high-availability deployment with Nginx and Gunicorn.
   - Systemd service management for automatic restart and process monitoring.

## Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vvduth/advance-blog.git
   cd advance-blog
   ```

2. **Create a virtual environment and activate it:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # source .venv/bin/activate  # On MacOS/Linux
   ```

3. **Install the required packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```dotenv
   FLASK_KEY=your_secret_key
   BACKUP=sqlite:///posts.db
   MY_EMAIL=your_email@example.com
   MY_PASSWORD=your_email_password
   DB_URI=your_database_uri
   ```

5. **Run the Flask application:**
   ```bash
   python main.py
   ```

6. **Open your web browser and go to `http://127.0.0.1:5003/`**

## Production Deployment (AWS EC2)

### Infrastructure
- **Platform:** AWS EC2 t2.micro (Free Tier eligible)
- **Operating System:** Amazon Linux 2023
- **Database:** Neon PostgreSQL (cloud-hosted)
- **Reverse Proxy:** Nginx
- **Application Server:** Gunicorn with 2 workers
- **Process Management:** systemd

### Deployment Architecture
```
Internet → AWS Security Group → Nginx (Port 80) → Gunicorn (Port 8000) → Flask App
                                    ↓
                              Static Files (Direct Serve)
```

### Key Configuration Files
- **Nginx Config:** `/etc/nginx/conf.d/advance-blog.conf`
- **Systemd Service:** `/etc/systemd/system/advance-blog.service`
- **Gunicorn Config:** `gunicorn_config.py`

### Monitoring & Logs
```bash
# Application logs
sudo journalctl -u advance-blog -f

# Nginx logs  
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

**🚀 Ready to explore? Visit the live application at [http://13.60.94.174/](http://13.60.94.174/) and create your first blog post!**