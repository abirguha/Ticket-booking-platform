import os

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "ticket_booking"),
        ssl_ca=os.path.join(os.path.dirname(__file__), "ca.pem")
    )


@app.route("/")
def home():
    return "Ticket Booking Backend is running!"


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