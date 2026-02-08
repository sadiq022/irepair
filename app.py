from flask import (
    Flask, render_template, request,
    redirect, url_for, session
)
from werkzeug.security import check_password_hash
import os

from config import DATABASE_URL
from dotenv import load_dotenv

load_dotenv()

# ---------------- MODELS ----------------
from models.product import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product,
    get_filtered_products,
    get_featured_products
)

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

# ---------------- APP SETUP ----------------
app = Flask(__name__)

app.secret_key = os.environ.get(
    "SECRET_KEY",
    "dev-secret-key-change-this"
)

# ---------------- HELPERS ----------------
def admin_logged_in():
    return session.get("admin_logged_in") is True


# ---------------- PUBLIC ROUTES ----------------
@app.route("/")
def home():
    return render_template(
        "pages/home.html",
        featured_products=get_featured_products(limit=9)
    )


@app.route("/about")
def about():
    return render_template("pages/about.html")


@app.route("/contact")
def contact():
    return render_template("pages/contact.html")


@app.route("/shop")
def shop():
    filters = {
        "search": request.args.get("search"),
        "brand": request.args.get("brand"),
        "price": request.args.get("price")
    }

    products = get_filtered_products(filters)
    return render_template(
        "pages/shop.html",
        products=products
    )


# ---------------- ADMIN AUTH ----------------
@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if (
            username == ADMIN_USERNAME and
            check_password_hash(ADMIN_PASSWORD_HASH, password)
        ):
            session["admin_logged_in"] = True
            return redirect(url_for("admin_products"))

        return render_template(
            "admin/admin_login.html",
            error="Invalid credentials"
        )

    return render_template("admin/admin_login.html")


@app.route("/admin/logout")
def admin_logout():
    session.pop("admin_logged_in", None)
    return redirect(url_for("admin_login"))


# ---------------- ADMIN: PRODUCTS ----------------
@app.route("/admin/products")
def admin_products():
    if not admin_logged_in():
        return redirect(url_for("admin_login"))

    products = get_all_products()
    return render_template(
        "admin/admin_products.html",
        products=products
    )


@app.route("/admin/products/add", methods=["GET", "POST"])
def admin_add_product():
    if not admin_logged_in():
        return redirect(url_for("admin_login"))

    if request.method == "POST":
        create_product(request.form, request.files)
        return redirect(url_for("admin_products"))

    return render_template(
        "admin/admin_product_form.html",
        product=None
    )


@app.route("/admin/products/edit/<int:product_id>", methods=["GET", "POST"])
def admin_edit_product(product_id):
    if not admin_logged_in():
        return redirect(url_for("admin_login"))

    if request.method == "POST":
        update_product(product_id, request.form, request.files)
        return redirect(url_for("admin_products"))

    product = get_product_by_id(product_id)
    return render_template(
        "admin/admin_product_form.html",
        product=product
    )



@app.route("/admin/products/delete/<int:product_id>")
def admin_delete_product(product_id):
    if not admin_logged_in():
        return redirect(url_for("admin_login"))

    delete_product(product_id)
    return redirect(url_for("admin_products"))


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
