import psycopg2
import cloudinary.uploader
from config import DATABASE_URL


# =====================================================
# CONNECTION
# =====================================================
def get_connection():
    return psycopg2.connect(DATABASE_URL)


def rows_to_dicts(cursor, rows):
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]


# =====================================================
# READ
# =====================================================
def get_all_products():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM products ORDER BY id DESC")
    rows = cur.fetchall()

    products = rows_to_dicts(cur, rows)

    cur.close()
    conn.close()
    return products


def get_product_by_id(product_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
    row = cur.fetchone()

    product = rows_to_dicts(cur, [row])[0] if row else None

    cur.close()
    conn.close()
    return product


def get_featured_products(limit=9):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM products ORDER BY id DESC LIMIT %s",
        (limit,)
    )
    rows = cur.fetchall()

    products = rows_to_dicts(cur, rows)

    cur.close()
    conn.close()
    return products


def get_filtered_products(filters):
    conn = get_connection()
    cur = conn.cursor()

    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if filters:
        if filters.get("search"):
            query += " AND (name ILIKE %s OR brand ILIKE %s)"
            params.extend([
                f"%{filters['search']}%",
                f"%{filters['search']}%"
            ])

        if filters.get("brand"):
            query += " AND brand = %s"
            params.append(filters["brand"])

        if filters.get("price"):
            min_p, max_p = map(int, filters["price"].split("-"))
            query += " AND price BETWEEN %s AND %s"
            params.extend([min_p, max_p])

        if filters.get("condition"):
            query += " AND condition = %s"
            params.append(filters["condition"])

    query += " ORDER BY id DESC"

    cur.execute(query, tuple(params))
    rows = cur.fetchall()

    products = rows_to_dicts(cur, rows)

    cur.close()
    conn.close()
    return products


# =====================================================
# CREATE
# =====================================================
def create_product(form_data, files):
    image_url = None

    if "image" in files and files["image"].filename:
        upload = cloudinary.uploader.upload(
            files["image"],
            folder="irepair/products"
        )
        image_url = upload["secure_url"]

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO products (
            brand, name, display, storage, ram, camera,
            price, original_price, image,
            condition, used_months
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        form_data["brand"],
        form_data["name"],
        form_data.get("display"),
        form_data.get("storage"),
        form_data.get("ram"),
        form_data.get("camera"),
        form_data["price"],
        form_data.get("original_price") or None,
        image_url,
        form_data.get("condition", "new"),
        form_data.get("used_months") or None
    ))

    conn.commit()
    cur.close()
    conn.close()


# =====================================================
# UPDATE
# =====================================================
def update_product(product_id, form_data, files):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT image FROM products WHERE id = %s", (product_id,))
    row = cur.fetchone()
    image_url = row[0] if row else None

    if "image" in files and files["image"].filename:
        upload = cloudinary.uploader.upload(
            files["image"],
            folder="irepair/products"
        )
        image_url = upload["secure_url"]

    cur.execute("""
        UPDATE products SET
            brand=%s,
            name=%s,
            display=%s,
            storage=%s,
            ram=%s,
            camera=%s,
            price=%s,
            original_price=%s,
            image=%s,
            condition=%s,
            used_months=%s
        WHERE id=%s
    """, (
        form_data["brand"],
        form_data["name"],
        form_data.get("display"),
        form_data.get("storage"),
        form_data.get("ram"),
        form_data.get("camera"),
        form_data["price"],
        form_data.get("original_price") or None,
        image_url,
        form_data.get("condition", "new"),
        form_data.get("used_months") or None,
        product_id
    ))

    conn.commit()
    cur.close()
    conn.close()


# =====================================================
# DELETE
# =====================================================
def delete_product(product_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM products WHERE id = %s", (product_id,))

    conn.commit()
    cur.close()
    conn.close()
