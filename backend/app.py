import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from functools import wraps
import mysql.connector


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)

# Session security
app.config["SECRET_KEY"] = os.getenv(
    "FLASK_SECRET_KEY",
    "local-development-secret"
)

CORS(
    app,
    supports_credentials=True
)


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "ticket_booking"),
        ssl_ca="/etc/secrets/ca.pem"
    )


@app.route("/")
def home():
    return send_from_directory("..", "index.html")

# ==================== SIGNUP ====================

@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO users
            (name, email, password)
            VALUES (%s, %s, %s)
            """,
            (name, email, password)
        )

        db.commit()

        return jsonify({
            "message": "Account created successfully"
        }), 201

    except mysql.connector.IntegrityError:

        return jsonify({
            "message": "Email already registered"
        }), 409

    finally:

        cursor.close()
        db.close()


# ==================== LOGIN ====================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT id, name, email, password
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user is None:

        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if user[3] != password:

        return jsonify({
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user[0],
        "name": user[1]
    }), 200


# ==================== ADMIN LOGIN ====================

@app.route("/admin-login", methods=["POST"])
def admin_login():

    data = request.get_json() or {}

    username = data.get("username")
    password = data.get("password")

    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_username or not admin_password:
        return jsonify({
            "message": "Admin login is not configured"
        }), 500

    if username != admin_username or password != admin_password:
        return jsonify({
            "message": "Invalid admin credentials"
        }), 401

    session["admin_logged_in"] = True

    return jsonify({
        "message": "Admin login successful",
        "admin": True
    }), 200


# ==================== ADMIN CHECK ====================

@app.route("/admin-check", methods=["GET"])
def admin_check():

    if not session.get("admin_logged_in"):
        return jsonify({
            "authenticated": False
        }), 401

    return jsonify({
        "authenticated": True
    }), 200


# ==================== ADMIN LOGOUT ====================

@app.route("/admin-logout", methods=["POST"])
def admin_logout():

    session.pop("admin_logged_in", None)

    return jsonify({
        "message": "Admin logout successful"
    }), 200


# ==================== ADMIN AUTH HELPER ====================

def admin_required(function):

    @wraps(function)
    def decorated_function(*args, **kwargs):

        if not session.get("admin_logged_in"):
            return jsonify({
                "message": "Admin authentication required"
            }), 401

        return function(*args, **kwargs)

    return decorated_function


# ==================== ADMIN STATISTICS ====================

@app.route("/admin/stats", methods=["GET"])
@admin_required
def admin_stats():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        # Basic platform statistics.
        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) AS total_bookings FROM bookings")
        total_bookings = cursor.fetchone()["total_bookings"]

        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM bookings")
        total_revenue = cursor.fetchone()["total_revenue"]

        cursor.execute("SELECT COUNT(*) AS total_venues FROM venues")
        total_venues = cursor.fetchone()["total_venues"]

        return jsonify({
            "total_users": total_users,
            "total_bookings": total_bookings,
            "total_revenue": float(total_revenue or 0),
            "total_venues": total_venues
        }), 200

    except mysql.connector.Error as error:

        print("Admin statistics error:", error)

        return jsonify({
            "message": "Could not load admin statistics"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== ADMIN RECENT BOOKINGS ====================

@app.route("/admin/bookings", methods=["GET"])
@admin_required
def admin_bookings():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        # Deliberately do not return user email, password,
        # or user ID to the demo admin dashboard.
        cursor.execute(
            """
            SELECT
                id,
                movie_name,
                booking_date,
                show_time,
                venue,
                seats,
                total_amount,
                booking_time
            FROM bookings
            ORDER BY booking_time DESC
            LIMIT 20
            """
        )

        bookings = cursor.fetchall()

        for booking in bookings:

            booking["booking_date"] = str(
                booking["booking_date"]
            )

            booking["booking_time"] = str(
                booking["booking_time"]
            )

            seat_string = booking.get("seats") or ""
            booking["seat_count"] = len([
                seat.strip()
                for seat in seat_string.split(",")
                if seat.strip()
            ])

            # The actual seat list is not needed by the dashboard.
            booking.pop("seats", None)

            if booking.get("total_amount") is not None:
                booking["total_amount"] = float(
                    booking["total_amount"]
                )

        return jsonify({
            "bookings": bookings
        }), 200

    except mysql.connector.Error as error:

        print("Admin bookings error:", error)

        return jsonify({
            "message": "Could not load admin bookings"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== GET VENUES ====================

@app.route("/venues", methods=["GET"])
def get_venues():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                id,
                venue_name,
                location,
                total_seats
            FROM venues
            ORDER BY venue_name
            """
        )

        venues = cursor.fetchall()

        return jsonify({
            "venues": venues
        }), 200

    except mysql.connector.Error as error:

        print("Error getting venues:", error)

        return jsonify({
            "message": "Could not get venues"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== HOMEPAGE MOVIE TIME AVAILABILITY ====================

@app.route("/movie-time-availability", methods=["GET"])
def movie_time_availability():

    booking_date = request.args.get("booking_date")
    period = request.args.get("period")
    movie_names_text = request.args.get("movie_names", "")

    if not booking_date or period not in {
        "morning",
        "noon",
        "night"
    }:
        return jsonify({
            "message": "Booking date and valid time period are required"
        }), 400

    movie_names = [
        name.strip()
        for name in movie_names_text.split("|")
        if name.strip()
    ]

    if not movie_names:
        return jsonify({
            "availability": {}
        }), 200

    showtimes_by_period = {
        "morning": [
            "2D 09:00",
            "3D 10:00"
        ],
        "noon": [
            "2D 12:00",
            "3D 13:00",
            "2D 15:00",
            "3D 16:00"
        ],
        "night": [
            "2D 18:00",
            "3D 19:00",
            "2D 21:00",
            "3D 22:00"
        ]
    }

    period_showtimes = showtimes_by_period[period]

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        # Get venue capacities once.
        cursor.execute(
            """
            SELECT
                venue_name,
                total_seats
            FROM venues
            """
        )

        venues = cursor.fetchall()

        # Get every relevant booking for every candidate movie
        # in one database query.
        movie_placeholders = ", ".join(
            ["%s"] * len(movie_names)
        )
        show_placeholders = ", ".join(
            ["%s"] * len(period_showtimes)
        )

        cursor.execute(
            f"""
            SELECT
                movie_name,
                show_time,
                venue,
                seats
            FROM bookings
            WHERE booking_date = %s
            AND movie_name IN ({movie_placeholders})
            AND show_time IN ({show_placeholders})
            """,
            (
                [booking_date]
                + movie_names
                + period_showtimes
            )
        )

        bookings = cursor.fetchall()

        # Start every candidate as available. If there are no bookings,
        # every venue/showtime has seats available.
        availability = {
            movie_name: False
            for movie_name in movie_names
        }

        # Track booked seats for each movie/showtime/venue.
        booked_counts = {}

        for booking in bookings:

            key = (
                booking["movie_name"],
                booking["show_time"],
                booking["venue"]
            )

            seat_string = booking.get("seats") or ""

            booked_counts[key] = len([
                seat.strip()
                for seat in seat_string.split(",")
                if seat.strip()
            ]) + booked_counts.get(key, 0)

        # A movie is available for the selected period when at least
        # one venue has at least one free seat for at least one show.
        for movie_name in movie_names:

            for show_time in period_showtimes:

                for venue in venues:

                    key = (
                        movie_name,
                        show_time,
                        venue["venue_name"]
                    )

                    booked_count = booked_counts.get(key, 0)

                    if (
                        int(venue["total_seats"])
                        - booked_count
                    ) > 0:

                        availability[movie_name] = True
                        break

                if availability[movie_name]:
                    break

        return jsonify({
            "booking_date": booking_date,
            "period": period,
            "availability": availability
        }), 200

    except mysql.connector.Error as error:

        print(
            "Homepage movie availability error:",
            error
        )

        return jsonify({
            "message": "Could not get movie availability"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== VENUE AVAILABILITY ====================

@app.route("/venue-availability", methods=["GET"])
def venue_availability():

    movie_name = request.args.get("movie_name")
    booking_date = request.args.get("booking_date")
    show_time = request.args.get("show_time")

    if not movie_name or not booking_date or not show_time:

        return jsonify({
            "message":
                "Movie, date and show time are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        # Get all venues

        cursor.execute(
            """
            SELECT
                id,
                venue_name,
                location,
                total_seats
            FROM venues
            ORDER BY venue_name
            """
        )

        venues = cursor.fetchall()


        # Get bookings for this movie,
        # date and show

        cursor.execute(
            """
            SELECT
                venue,
                seats
            FROM bookings
            WHERE movie_name = %s
            AND booking_date = %s
            AND show_time = %s
            """,
            (
                movie_name,
                booking_date,
                show_time
            )
        )

        bookings = cursor.fetchall()


        # Calculate availability
        # separately for every venue

        for venue in venues:

            booked_count = 0

            for booking in bookings:

                if booking["venue"] == venue["venue_name"]:

                    if booking["seats"]:

                        booked_count += len(
                            booking["seats"].split(",")
                        )


            venue["booked_seats"] = booked_count

            venue["available_seats"] = (
                venue["total_seats"]
                - booked_count
            )


        return jsonify({

            "movie_name": movie_name,

            "booking_date": booking_date,

            "show_time": show_time,

            "venues": venues

        }), 200


    except mysql.connector.Error as error:

        print(
            "Error getting venue availability:",
            error
        )

        return jsonify({
            "message":
                "Could not get venue availability"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== CREATE BOOKING ====================

@app.route("/book", methods=["POST"])
def create_booking():

    data = request.get_json()

    user_id = data.get("user_id")
    movie_name = data.get("movie_name")
    booking_date = data.get("booking_date")
    show_time = data.get("show_time")
    venue = data.get("venue")
    seats = data.get("seats")
    total_amount = data.get("total_amount")


    if (
        not user_id
        or not movie_name
        or not booking_date
        or not show_time
        or not venue
        or not seats
        or not total_amount
    ):

        return jsonify({
            "message":
                "All booking details are required"
        }), 400


    db = get_db_connection()
    cursor = db.cursor()


    try:

        # Check seats already booked for
        # this exact movie/date/show/venue

        cursor.execute(
            """
            SELECT seats
            FROM bookings
            WHERE movie_name = %s
            AND booking_date = %s
            AND show_time = %s
            AND venue = %s
            """,
            (
                movie_name,
                booking_date,
                show_time,
                venue
            )
        )

        existing_bookings = cursor.fetchall()


        # Convert requested seats
        # into a list

        requested_seats = [
            seat.strip()
            for seat in seats.split(",")
        ]


        # Collect booked seats

        booked_seats = []


        for booking in existing_bookings:

            old_seats = booking[0].split(",")

            for seat in old_seats:

                booked_seats.append(
                    seat.strip()
                )


        # Find duplicate seats

        already_booked = [

            seat
            for seat in requested_seats
            if seat in booked_seats

        ]


        # Reject duplicate seats

        if already_booked:

            return jsonify({

                "message":
                    "These seats are already booked: "
                    + ", ".join(already_booked)

            }), 409


        # Save booking

        cursor.execute(
            """
            INSERT INTO bookings
            (
                user_id,
                movie_name,
                booking_date,
                show_time,
                venue,
                seats,
                total_amount
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                user_id,
                movie_name,
                booking_date,
                show_time,
                venue,
                seats,
                total_amount
            )
        )


        db.commit()


        return jsonify({

            "message":
                "Booking confirmed successfully",

            "booking_id":
                cursor.lastrowid

        }), 201


    except mysql.connector.Error as error:

        db.rollback()

        print(
            "Booking error:",
            error
        )

        return jsonify({
            "message":
                "Could not create booking"
        }), 500


    finally:

        cursor.close()
        db.close()


# ==================== GET BOOKED SEATS ====================

@app.route("/booked-seats", methods=["GET"])
def get_booked_seats():

    movie_name = request.args.get("movie_name")
    booking_date = request.args.get("booking_date")
    show_time = request.args.get("show_time")
    venue = request.args.get("venue")


    if (
        not movie_name
        or not booking_date
        or not show_time
        or not venue
    ):

        return jsonify({
            "message":
                "Movie, date, show time and venue are required"
        }), 400


    db = get_db_connection()
    cursor = db.cursor()


    try:

        cursor.execute(
            """
            SELECT seats
            FROM bookings
            WHERE movie_name = %s
            AND booking_date = %s
            AND show_time = %s
            AND venue = %s
            """,
            (
                movie_name,
                booking_date,
                show_time,
                venue
            )
        )


        bookings = cursor.fetchall()

        booked_seats = []


        for booking in bookings:

            seats = booking[0].split(",")

            for seat in seats:

                booked_seats.append(
                    seat.strip()
                )


        return jsonify({
            "booked_seats": booked_seats
        }), 200


    except mysql.connector.Error as error:

        print(
            "Error getting booked seats:",
            error
        )

        return jsonify({
            "message":
                "Could not get booked seats"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== GET USER BOOKINGS ====================

@app.route("/my-bookings", methods=["GET"])
def get_user_bookings():

    user_id = request.args.get("user_id")


    if not user_id:

        return jsonify({
            "message":
                "User ID is required"
        }), 400


    db = get_db_connection()
    cursor = db.cursor(dictionary=True)


    try:

        cursor.execute(
            """
            SELECT
                id,
                movie_name,
                booking_date,
                show_time,
                venue,
                seats,
                total_amount,
                booking_time
            FROM bookings
            WHERE user_id = %s
            ORDER BY booking_time DESC
            """,
            (user_id,)
        )


        bookings = cursor.fetchall()


        for booking in bookings:

            booking["booking_date"] = str(
                booking["booking_date"]
            )

            booking["booking_time"] = str(
                booking["booking_time"]
            )


        return jsonify({
            "bookings": bookings
        }), 200


    except mysql.connector.Error as error:

        print(
            "Error getting bookings:",
            error
        )

        return jsonify({
            "message":
                "Could not get bookings"
        }), 500

    finally:

        cursor.close()
        db.close()


# ==================== RUN FLASK ====================

if __name__ == "__main__":
    app.run(debug=True)