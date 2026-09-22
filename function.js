// ============================================================
// LOGIN / REGISTER UI
// ============================================================

var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login() {

    if (x) {
        x.style.left = "4px";
    }

    if (y) {
        y.style.right = "-520px";
    }

    if (a) {
        a.className = "white-btn";
        a.style.background = "#ff5c5c";
        a.style.color = "#fff";
    }

    if (b) {
        b.className = "btn";
    }
}


function register() {

    if (x) {
        x.style.left = "-510px";
    }

    if (y) {
        y.style.right = "5px";
    }

    if (a) {
        a.className = "btn";
    }

    if (b) {
        b.className = "white-btn";
        b.style.background = "#ff5c5c";
        b.style.color = "#fff";
    }
}


function myMenuFunction() {

    const menu =
        document.getElementById("navMenu");

    if (!menu) {
        return;
    }

    if (menu.className === "nav-menu") {
        menu.className += " responsive";
    } else {
        menu.className = "nav-menu";
    }
}


// ============================================================
// LOGIN
// ============================================================

async function Login() {

    const form =
        document.forms["myForm"];

    if (!form) {
        return;
    }

    const email =
        form["Uname"].value.trim();

    const password =
        form["Pass"].value;

    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            return;
        }

        localStorage.setItem(
            "user_id",
            data.user_id
        );

        localStorage.setItem(
            "user_name",
            data.name
        );

        alert(
            "Login successful!"
        );

        window.location.href =
            "home.html";

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to the server.\n" +
            "Please make sure Flask is running."
        );
    }
}


// ============================================================
// SIGN UP
// ============================================================

async function signup() {

    const firstName =
        document.getElementById(
            "firstName"
        );

    const lastName =
        document.getElementById(
            "lastName"
        );

    const emailInput =
        document.getElementById(
            "email"
        );

    const passwordInput =
        document.getElementById(
            "signupPassword"
        );

    if (
        !firstName ||
        !lastName ||
        !emailInput ||
        !passwordInput
    ) {
        return;
    }

    const first =
        firstName.value.trim();

    const last =
        lastName.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (
        !first ||
        !last ||
        !email ||
        !password
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }

    const name =
        first + " " + last;

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Signup failed."
            );

            return;
        }

        alert(
            "Signup successful! Please login."
        );

        login();

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        alert(
            "Unable to connect to the server.\n" +
            "Please make sure Flask is running."
        );
    }
}


// ============================================================
// BOOKING PAGE
// ============================================================

const bookingPage =
    document.querySelector(".booking");


if (bookingPage) {

    // ========================================================
    // VARIABLES
    // ========================================================

    const selectedSeats = [];

    let selectedDate = null;
    let selectedTime = null;
    let selectedShowType = null;
    let selectedVenue = null;
    let selectedVenueId = null;

    const movieName =
        "Venom: The Last Dance";

    const pricePerSeat =
        560;


    // ========================================================
    // CREATE VENUE SELECTION SCREEN
    // ========================================================

    function createVenueSelectionContainer() {

        let existing =
            document.getElementById(
                "venue_selection"
            );

        if (existing) {
            return existing;
        }


        const venueSelection =
            document.createElement(
                "div"
            );

        venueSelection.id =
            "venue_selection";


        venueSelection.innerHTML = `

            <div class="venue-selection-inner">

                <h1>
                    Select Cinema & Showtime
                </h1>

                <p>
                    Choose your preferred cinema
                    and showtime to continue
                    to seat selection.
                </p>


                <div
                    id="selected_date_summary"
                    class="booking-info-pill">
                </div>


                <div
                    id="venue_list"
                    class="venue-list">
                </div>


                <button
                    id="venue_continue_button"
                    type="button">

                    CONTINUE TO SEAT SELECTION

                </button>

            </div>
        `;


        bookingPage.prepend(
            venueSelection
        );


        // ====================================================
        // DYNAMIC VENUE PAGE STYLING
        // ====================================================

        if (
            !document.getElementById(
                "dynamic-booking-styles"
            )
        ) {

            const style =
                document.createElement(
                    "style"
                );

            style.id =
                "dynamic-booking-styles";


            style.textContent = `

                #venue_selection {

                    width: 100%;
                    min-height: 100vh;

                    padding: 55px 20px;

                    box-sizing: border-box;

                    background: #1f2025;

                    color: white;

                }


                .venue-selection-inner {

                    max-width: 1050px;

                    margin: auto;

                    padding: 35px;

                    border:
                        1px solid
                        rgba(255,255,255,0.12);

                    border-radius: 20px;

                    background:
                        linear-gradient(
                            145deg,
                            #24252b,
                            #1d1e23
                        );

                    box-sizing: border-box;

                }


                .venue-selection-inner h1 {

                    text-align: center;

                    margin: 0;

                    font-size: 30px;

                    color: white;

                }


                .venue-selection-inner > p {

                    text-align: center;

                    color: #aaa;

                    margin:
                        12px 0 25px;

                }


                .booking-info-pill {

                    width: fit-content;

                    margin:
                        0 auto 25px;

                    padding:
                        9px 17px;

                    border-radius: 20px;

                    border:
                        1px solid
                        rgba(255,255,255,0.12);

                    background:
                        rgba(255,255,255,0.05);

                    color: white;

                    font-size: 13px;

                }


                .venue-list {

                    display: flex;

                    flex-direction: column;

                    gap: 20px;

                    max-height: 560px;

                    overflow-y: auto;

                    padding-right: 8px;

                }


                .cinema-card {

                    padding: 25px;

                    border-radius: 16px;

                    border:
                        1px solid
                        rgba(255,255,255,0.14);

                    background:
                        rgba(255,255,255,0.035);

                }


                .cinema-header {

                    margin-bottom: 20px;

                }


                .cinema-info h3 {

                    margin: 0;

                    font-size: 22px;

                    color: white;

                }


                .cinema-info p {

                    margin:
                        6px 0 0;

                    color: #999;

                }


                .showtime-title {

                    margin-bottom: 10px;

                    color: #bbb;

                    font-size: 14px;

                }


                .showtime-container {

                    display: flex;

                    flex-wrap: wrap;

                    gap: 10px;

                }


                .venue-showtime {

                    padding:
                        10px 18px;

                    border-radius: 8px;

                    background: transparent;

                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;

                }


                .venue-showtime.available {

                    color: #4ade80;

                    border:
                        1px solid
                        #347b51;

                    background:
                        rgba(
                            74,
                            222,
                            128,
                            0.06
                        );

                }


                .venue-showtime.almost {

                    color: #f59e0b;

                    border:
                        1px solid
                        #8b621c;

                    background:
                        rgba(
                            245,
                            158,
                            11,
                            0.06
                        );

                }


                .venue-showtime.sold {

                    color: #777;

                    border:
                        1px solid
                        #555;

                    background:
                        rgba(
                            100,
                            100,
                            100,
                            0.05
                        );

                    cursor:
                        not-allowed;

                }


                .venue-showtime.selected {

                    color:
                        white !important;

                    background:
                        #ff5c5c !important;

                    border-color:
                        #ff5c5c !important;

                    box-shadow:
                        0 0 0 2px
                        rgba(
                            255,
                            92,
                            92,
                            0.18
                        );

                }


                .showtime-legend {

                    display: flex;

                    gap: 20px;

                    margin-top: 18px;

                    color: #aaa;

                    font-size: 12px;

                    flex-wrap: wrap;

                }


                .showtime-legend span {

                    display: flex;

                    align-items: center;

                    gap: 6px;

                }


                .legend-dot {

                    width: 8px;

                    height: 8px;

                    border-radius: 50%;

                    display: inline-block;

                }


                .available-dot {

                    background:
                        #4ade80;

                }


                .almost-dot {

                    background:
                        #f59e0b;

                }


                .sold-dot {

                    background:
                        #777;

                }


                #venue_continue_button {

                    display: none;

                    margin:
                        25px auto 0;

                    padding:
                        13px 25px;

                    border: none;

                    border-radius: 8px;

                    background:
                        #ff5c5c;

                    color: white;

                    font-weight: 600;

                    cursor: pointer;

                }


                #venue_continue_button:hover {

                    background:
                        #ff4141;

                }


                .seat-booking-top {

                    display: none;

                }


                .seat-booking-date {

                    display: none !important;

                }


                #seat_price_note {

                    text-align: center;

                    color: #aaa;

                    font-size: 13px;

                    margin-top: 8px;

                }


                #booking_total_price {

                    text-align: center;

                    margin-top: 20px;

                }


                #seat_showtime_list {

                    display: flex;

                    flex-wrap: wrap;

                    gap: 8px;

                    justify-content: flex-end;

                }


                .seat-showtime-button {

                    padding:
                        9px 16px;

                    border-radius: 8px;

                    background:
                        rgba(
                            74,
                            222,
                            128,
                            0.06
                        );

                    border:
                        1px solid
                        #347b51;

                    color:
                        #4ade80;

                    font-weight: 600;

                    cursor: pointer;

                }


                .seat-showtime-button.almost {

                    color:
                        #f59e0b;

                    border-color:
                        #8b621c;

                    background:
                        rgba(
                            245,
                            158,
                            11,
                            0.06
                        );

                }


                .seat-showtime-button.sold {

                    color:
                        #777;

                    border-color:
                        #555;

                    background:
                        rgba(
                            100,
                            100,
                            100,
                            0.05
                        );

                    cursor:
                        not-allowed;

                }


                .seat-showtime-button.selected {

                    color:
                        white !important;

                    background:
                        #ff5c5c !important;

                    border-color:
                        #ff5c5c !important;

                    box-shadow:
                        0 0 0 2px
                        rgba(
                            255,
                            92,
                            92,
                            0.18
                        );

                }


                @media screen and
                    (max-width: 900px) {

                    .venue-selection-inner {

                        padding: 22px;

                    }


                    .seat-booking-top {

                        flex-direction:
                            column;

                        align-items:
                            flex-start;

                    }


                    #seat_showtime_list {

                        justify-content:
                            flex-start;

                    }

                }

            `;


            document.head.appendChild(
                style
            );
        }


        return venueSelection;
    }


    // ========================================================
    // CREATE VENUE PAGE FIRST
    // ========================================================

    createVenueSelectionContainer();


    // ========================================================
    // NOW GET VENUE ELEMENTS
    // ========================================================

    const venueSelection =
        document.getElementById(
            "venue_selection"
        );

    const venueList =
        document.getElementById(
            "venue_list"
        );

    const venueContinueButton =
        document.getElementById(
            "venue_continue_button"
        );

    const selectedDateSummary =
        document.getElementById(
            "selected_date_summary"
        );


    // ========================================================
    // SEAT PAGE ELEMENTS
    // ========================================================

    const screen =
        document.querySelector(".screen");

    const chair =
        document.querySelector(".chair");

    const ticket =
        document.querySelector(".ticket");

    const details =
        document.getElementById("det");

    const bookButton =
        document.getElementById(
            "book_ticket"
        );

    const backButton =
        document.getElementById(
            "back_ticket"
        );

    const seatBookingTop =
        document.querySelector(
            ".seat-booking-top"
        );

    const seatBookingDate =
        document.querySelector(
            ".seat-booking-date"
        );

    const seatMovieTitle =
        document.getElementById(
            "seat_movie_title"
        );

    const seatShowType =
        document.getElementById(
            "seat_show_type"
        );

    const seatVenueName =
        document.getElementById(
            "seat_venue_name"
        );

    const seatShowtimeList =
        document.getElementById(
            "seat_showtime_list"
        );

    const bookingTotalPrice =
        document.getElementById(
            "booking_total_price"
        );


    // ========================================================
    // SHOWTIME DATA
    // ========================================================

    const showtimeList = [

        {
            type: "2D",
            time: "09:30",
            displayTime: "09:30 AM"
        },

        {
            type: "2D",
            time: "12:00",
            displayTime: "12:00 PM"
        },

        {
            type: "2D",
            time: "02:30",
            displayTime: "02:30 PM"
        },

        {
            type: "3D",
            time: "05:30",
            displayTime: "05:30 PM"
        },

        {
            type: "3D",
            time: "08:00",
            displayTime: "08:00 PM"
        },

        {
            type: "3D",
            time: "11:00",
            displayTime: "11:00 PM"
        },

        {
            type: "2D",
            time: "09:00",
            displayTime: "09:00 AM"
        },

        {
            type: "2D",
            time: "02:00",
            displayTime: "02:00 PM"
        },

        {
            type: "3D",
            time: "05:00",
            displayTime: "05:00 PM"
        },

        {
            type: "3D",
            time: "10:30",
            displayTime: "10:30 PM"
        },

        {
            type: "2D",
            time: "08:30",
            displayTime: "08:30 PM"
        }

    ];


    // ========================================================
    // UNIQUE SHOWTIMES
    // ========================================================

    function getUniqueShowtimes(
        type
    ) {

        const seen =
            new Set();

        return showtimeList.filter(
            function (show) {

                if (
                    show.type !== type
                ) {
                    return false;
                }

                const key =
                    show.type +
                    "|" +
                    show.time;

                if (
                    seen.has(key)
                ) {
                    return false;
                }

                seen.add(key);

                return true;
            }
        );
    }


    // ========================================================
    // GET BOOKING DATE
    // ========================================================

    function getBookingDate() {

        if (!selectedDate) {
            return "";
        }

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                selectedDate
            )
        ) {

            return selectedDate;
        }

        return (
            "2024-11-" +
            String(selectedDate)
                .padStart(2, "0")
        );
    }


    // ========================================================
    // FORMAT DATE
    // ========================================================

    function formatBookingDate(
        dateValue
    ) {

        if (!dateValue) {
            return "--";
        }

        let date;

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                dateValue
            )
        ) {

            date =
                new Date(
                    dateValue +
                    "T00:00:00"
                );

        } else {

            date =
                new Date(
                    "2024-11-" +
                    String(dateValue)
                        .padStart(2, "0") +
                    "T00:00:00"
                );
        }

        if (
            isNaN(
                date.getTime()
            )
        ) {

            return dateValue;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    // ========================================================
    // CONVERT 24 HOUR TO 12 HOUR
    // ========================================================

    function convertTo12Hour(
        time
    ) {

        if (!time) {
            return "--";
        }

        const parts =
            time.split(":");

        let hours =
            parseInt(
                parts[0],
                10
            );

        const minutes =
            parts[1] || "00";

        const ampm =
            hours >= 12
                ? "PM"
                : "AM";

        hours =
            hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        return (
            String(hours)
                .padStart(2, "0") +
            ":" +
            minutes +
            " " +
            ampm
        );
    }


    // ========================================================
    // AVAILABILITY STATUS
    // ========================================================

    function getStatus(
        availableSeats,
        totalSeats
    ) {

        availableSeats =
            Number(
                availableSeats
            );

        totalSeats =
            Number(
                totalSeats
            );

        if (
            availableSeats <= 0
        ) {

            return "sold";
        }

        if (
            totalSeats <= 0
        ) {

            return "available";
        }

        const percentage =
            (
                availableSeats /
                totalSeats
            ) * 100;

        if (
            percentage <= 40
        ) {

            return "almost";
        }

        return "available";
    }


    // ========================================================
    // NORMALIZE AVAILABILITY RESPONSE
    // ========================================================

    function normalizeAvailabilityResponse(
        responseData
    ) {

        if (
            Array.isArray(
                responseData
            )
        ) {

            return responseData;
        }

        if (
            responseData &&
            Array.isArray(
                responseData.availability
            )
        ) {

            return responseData.availability;
        }

        if (
            responseData &&
            Array.isArray(
                responseData.venues
            )
        ) {

            return responseData.venues;
        }

        if (
            responseData &&
            Array.isArray(
                responseData.data
            )
        ) {

            return responseData.data;
        }

        return [];
    }


    // ========================================================
    // FIND VENUE AVAILABILITY
    // ========================================================

    function findVenueAvailability(
        availability,
        venueId
    ) {

        return normalizeAvailabilityResponse(
            availability
        ).find(
            function (item) {

                if (!item) {
                    return false;
                }

                return (
                    Number(item.id) ===
                    Number(venueId)
                );
            }
        );
    }


    // ========================================================
    // HIDE SEAT PAGE
    // ========================================================

    function hideSeatSelection() {

        if (seatBookingTop) {

            seatBookingTop.style.display =
                "none";
        }

        if (seatBookingDate) {

            seatBookingDate.style.display =
                "none";
        }

        if (screen) {

            screen.style.display =
                "none";
        }

        if (chair) {

            chair.style.display =
                "none";
        }

        if (ticket) {

            ticket.style.display =
                "none";
        }

        if (details) {

            details.style.display =
                "none";
        }

        if (bookingTotalPrice) {

            bookingTotalPrice.style.display =
                "none";
        }

        if (bookButton) {

            bookButton.style.display =
                "none";
        }

        if (backButton) {

            backButton.style.display =
                "none";
        }

        const priceNote =
            document.getElementById(
                "seat_price_note"
            );

        if (priceNote) {

            priceNote.style.display =
                "none";
        }
    }


    // ========================================================
    // SHOW SEAT PAGE
    // ========================================================

    function showSeatSelection() {

        if (venueSelection) {

            venueSelection.style.display =
                "none";
        }

        if (seatBookingTop) {

            seatBookingTop.style.display =
                "flex";
        }

        if (seatBookingDate) {

            seatBookingDate.style.display =
                "none";
        }

        if (screen) {

            screen.style.display =
                "block";
        }

        if (chair) {

            chair.style.display =
                "block";
        }

        if (ticket) {

            ticket.style.display =
                "none";
        }

        if (details) {

            details.style.display =
                "flex";
        }

        if (bookingTotalPrice) {

            bookingTotalPrice.style.display =
                "block";
        }

        if (bookButton) {

            bookButton.style.display =
                "block";
        }

        if (backButton) {

            backButton.style.display =
                "block";
        }

        const priceNote =
            document.getElementById(
                "seat_price_note"
            );

        if (priceNote) {

            priceNote.style.display =
                "block";
        }

        updateSeatPageHeader();

        renderSeatShowtimes();

        updateTotalAmount();
    }


    // ========================================================
    // SHOW VENUE PAGE
    // ========================================================

    function showVenueSelection() {

        hideSeatSelection();

        if (venueSelection) {

            venueSelection.style.display =
                "block";
        }

        showContinueButton();
    }


    // ========================================================
    // UPDATE SEAT PAGE HEADER
    // ========================================================

    function updateSeatPageHeader() {

        if (seatMovieTitle) {

            seatMovieTitle.innerHTML =
                movieName +
                " " +
                "<span>" +
                "(" +
                (
                    selectedShowType ||
                    ""
                ) +
                ")" +
                "</span>";
        }

        if (seatVenueName) {

            seatVenueName.textContent =
                selectedVenue ||
                "Select a showtime";
        }
    }


    // ========================================================
    // CREATE PRICE NOTE
    // ========================================================

    function createSeatPriceNote() {

        let priceNote =
            document.getElementById(
                "seat_price_note"
            );

        if (!priceNote) {

            priceNote =
                document.createElement(
                    "div"
                );

            priceNote.id =
                "seat_price_note";

            priceNote.textContent =
                "₹" +
                pricePerSeat +
                " per ticket";

            if (details) {

                details.parentNode.insertBefore(
                    priceNote,
                    bookingTotalPrice
                );
            }
        }

        priceNote.style.display =
            "none";
    }


    // ========================================================
    // UPDATE TOTAL / SELECTED SEATS
    // ========================================================

    function updateTotalAmount() {

        if (!bookingTotalPrice) {
            return;
        }

        const count =
            selectedSeats.length;

        const selectedText =
            count > 0
                ? "Selected: " +
                  selectedSeats.join(", ")
                : "Selected: None";

        bookingTotalPrice.innerHTML = `

            <div style="
                font-size:16px;
                font-weight:600;
                color:#ffffff;
                margin-bottom:8px;
            ">

                ${selectedText}

            </div>


            <div style="
                font-size:20px;
                font-weight:700;
                color:#ff5c5c;
            ">

                Total:
                ${count}
                ${count === 1 ? "seat" : "seats"}

            </div>

        `;
    }


    // ========================================================
    // CLEAR SELECTED SEATS
    // ========================================================

    function clearSelectedSeats() {

        selectedSeats.length =
            0;

        if (chair) {

            chair
                .querySelectorAll(
                    "li"
                )
                .forEach(
                    function (seat) {

                        seat.classList.remove(
                            "selected"
                        );
                    }
                );
        }

        updateTotalAmount();
    }


    // ========================================================
    // SETUP SEAT MAP
    // ========================================================

    function setupSeats() {

        if (!chair) {
            return;
        }

        chair.innerHTML =
            "";

        const rows = [
            "J",
            "H",
            "G",
            "F",
            "D",
            "C",
            "B",
            "A"
        ];

        rows.forEach(
            function (rowName) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "row";

                const leftLabel =
                    document.createElement(
                        "span"
                    );

                leftLabel.textContent =
                    rowName;

                row.appendChild(
                    leftLabel
                );

                for (
                    let i = 1;
                    i <= 24;
                    i++
                ) {

                    const seat =
                        document.createElement(
                            "li"
                        );

                    const seatNumber =
                        rowName + i;

                    seat.className =
                        "seat";

                    seat.dataset.seat =
                        seatNumber;

                    seat.textContent =
                        seatNumber;

                    seat.addEventListener(
                        "click",
                        function () {

                            if (
                                seat.classList.contains(
                                    "booked"
                                )
                            ) {

                                return;
                            }

                            const index =
                                selectedSeats.indexOf(
                                    seatNumber
                                );

                            if (
                                index === -1
                            ) {

                                selectedSeats.push(
                                    seatNumber
                                );

                                seat.classList.add(
                                    "selected"
                                );

                            } else {

                                selectedSeats.splice(
                                    index,
                                    1
                                );

                                seat.classList.remove(
                                    "selected"
                                );
                            }

                            updateTotalAmount();
                        }
                    );

                    row.appendChild(
                        seat
                    );
                }

                const rightLabel =
                    document.createElement(
                        "span"
                    );

                rightLabel.textContent =
                    rowName;

                row.appendChild(
                    rightLabel
                );

                chair.appendChild(
                    row
                );
            }
        );
    }


    // ========================================================
    // LOAD BOOKED SEATS
    // ========================================================

    async function loadBookedSeats() {

        if (!chair) {
            return;
        }

        chair
            .querySelectorAll(
                "li"
            )
            .forEach(
                function (seat) {

                    seat.classList.remove(
                        "booked"
                    );

                    seat.classList.remove(
                        "selected"
                    );

                    seat.style.pointerEvents =
                        "";
                }
            );

        try {

            const params =
                new URLSearchParams({

                    movie_name:
                        movieName,

                    booking_date:
                        getBookingDate(),

                    show_time:
                        selectedTime,

                    venue:
                        selectedVenue
                });

            const response =
                await fetch(
                    "http://127.0.0.1:5000/" +
                    "booked-seats?" +
                    params.toString()
                );

            if (!response.ok) {

                console.error(
                    "Unable to load booked seats."
                );

                return;
            }

            const data =
                await response.json();

            const bookedSeats =
                Array.isArray(
                    data.booked_seats
                )
                    ? data.booked_seats
                    : [];

            chair
                .querySelectorAll(
                    "li"
                )
                .forEach(
                    function (seat) {

                        const seatNumber =
                            seat.dataset.seat;

                        if (
                            bookedSeats.includes(
                                seatNumber
                            )
                        ) {

                            seat.classList.add(
                                "booked"
                            );

                            seat.style.pointerEvents =
                                "none";
                        }
                    }
                );

        } catch (error) {

            console.error(
                "Booked seats error:",
                error
            );
        }
    }


    // ========================================================
    // LOAD VENUES
    // ========================================================

    async function loadVenues() {

        if (!venueList) {
            return;
        }

        venueList.innerHTML =
            "";

        selectedVenue =
            null;

        selectedVenueId =
            null;

        selectedTime =
            null;

        if (venueContinueButton) {

            venueContinueButton.style.display =
                "none";
        }

        if (!selectedShowType) {

            venueList.innerHTML =
                "<p style='color:#aaa;'>" +
                "No show format selected." +
                "</p>";

            return;
        }

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/venues"
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load venues."
                );
            }

            const venueResponse =
                await response.json();

            const venues =
                Array.isArray(
                    venueResponse
                )
                    ? venueResponse
                    : (
                        Array.isArray(
                            venueResponse.venues
                        )
                            ? venueResponse.venues
                            : []
                    );

            if (
                venues.length === 0
            ) {

                venueList.innerHTML =
                    "<p style='color:#aaa;'>" +
                    "No cinemas found." +
                    "</p>";

                return;
            }

            const filteredShows =
                getUniqueShowtimes(
                    selectedShowType
                );

            const availabilityMap =
                {};

            for (
                const show
                of filteredShows
            ) {

                const showKey =
                    show.type +
                    " " +
                    show.time;

                const params =
                    new URLSearchParams({

                        movie_name:
                            movieName,

                        booking_date:
                            getBookingDate(),

                        show_time:
                            showKey
                    });

                try {

                    const availabilityResponse =
                        await fetch(
                            "http://127.0.0.1:5000/" +
                            "venue-availability?" +
                            params.toString()
                        );

                    if (
                        availabilityResponse.ok
                    ) {

                        const responseData =
                            await availabilityResponse.json();

                        availabilityMap[
                            showKey
                        ] =
                            normalizeAvailabilityResponse(
                                responseData
                            );

                    } else {

                        availabilityMap[
                            showKey
                        ] = [];
                    }

                } catch (error) {

                    console.error(
                        "Availability error:",
                        error
                    );

                    availabilityMap[
                        showKey
                    ] = [];
                }
            }

            venues.forEach(
                function (venue) {

                    const venueShows =
                        [];

                    filteredShows.forEach(
                        function (show) {

                            const showKey =
                                show.type +
                                " " +
                                show.time;

                            const availability =
                                availabilityMap[
                                    showKey
                                ] || [];

                            const venueData =
                                findVenueAvailability(
                                    availability,
                                    venue.id
                                );

                            let availableSeats =
                                Number(
                                    venue.total_seats
                                );

                            if (
                                venueData &&
                                venueData.available_seats !==
                                undefined
                            ) {

                                availableSeats =
                                    Number(
                                        venueData.available_seats
                                    );
                            }

                            const status =
                                getStatus(
                                    availableSeats,
                                    Number(
                                        venue.total_seats
                                    )
                                );

                            venueShows.push({

                                type:
                                    show.type,

                                time:
                                    show.time,

                                displayTime:
                                    show.displayTime,

                                availableSeats:
                                    availableSeats,

                                status:
                                    status

                            });
                        }
                    );

                    const card =
                        createVenueCard(
                            venue,
                            venueShows
                        );

                    venueList.appendChild(
                        card
                    );
                }
            );

        } catch (error) {

            console.error(
                "Venue loading error:",
                error
            );

            venueList.innerHTML =
                "<p style='color:#ff5c5c;'>" +
                "Unable to display cinemas. " +
                "Please make sure Flask is running." +
                "</p>";
        }
    }


    // ========================================================
    // CREATE VENUE CARD
    // ========================================================

    function createVenueCard(
        venue,
        showtimes
    ) {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "cinema-card";

        const header =
            document.createElement(
                "div"
            );

        header.className =
            "cinema-header";

        const info =
            document.createElement(
                "div"
            );

        info.className =
            "cinema-info";

        const name =
            document.createElement(
                "h3"
            );

        name.textContent =
            venue.venue_name;

        const location =
            document.createElement(
                "p"
            );

        location.textContent =
            venue.location ||
            "Kolkata";

        info.appendChild(
            name
        );

        info.appendChild(
            location
        );

        header.appendChild(
            info
        );

        card.appendChild(
            header
        );

        const timeTitle =
            document.createElement(
                "div"
            );

        timeTitle.className =
            "showtime-title";

        timeTitle.textContent =
            "Showtimes";

        card.appendChild(
            timeTitle
        );

        const timeContainer =
            document.createElement(
                "div"
            );

        timeContainer.className =
            "showtime-container";

        showtimes.forEach(
            function (show) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "venue-showtime " +
                    show.status;

                button.textContent =
                    show.displayTime;

                if (
                    show.status ===
                    "sold"
                ) {

                    button.disabled =
                        true;

                    button.title =
                        "Sold Out";

                } else {

                    button.addEventListener(
                        "click",
                        function () {

                            document
                                .querySelectorAll(
                                    ".venue-showtime.selected"
                                )
                                .forEach(
                                    function (
                                        oldButton
                                    ) {

                                        oldButton.classList.remove(
                                            "selected"
                                        );
                                    }
                                );

                            button.classList.add(
                                "selected"
                            );

                            selectedVenue =
                                venue.venue_name;

                            selectedVenueId =
                                venue.id;

                            selectedTime =
                                selectedShowType +
                                " " +
                                show.time;

                            localStorage.setItem(
                                "selected_venue",
                                selectedVenue
                            );

                            localStorage.setItem(
                                "selected_venue_id",
                                selectedVenueId
                            );

                            localStorage.setItem(
                                "selected_show_time",
                                selectedTime
                            );

                            showContinueButton();
                        }
                    );
                }

                timeContainer.appendChild(
                    button
                );
            }
        );

        card.appendChild(
            timeContainer
        );

        const legend =
            document.createElement(
                "div"
            );

        legend.className =
            "showtime-legend";

        const availableLegend =
            document.createElement(
                "span"
            );

        availableLegend.innerHTML =
            '<span class="legend-dot available-dot"></span>' +
            "Available";

        const almostLegend =
            document.createElement(
                "span"
            );

        almostLegend.innerHTML =
            '<span class="legend-dot almost-dot"></span>' +
            "Almost Sold";

        const soldLegend =
            document.createElement(
                "span"
            );

        soldLegend.innerHTML =
            '<span class="legend-dot sold-dot"></span>' +
            "Sold Out";

        legend.appendChild(
            availableLegend
        );

        legend.appendChild(
            almostLegend
        );

        legend.appendChild(
            soldLegend
        );

        card.appendChild(
            legend
        );

        return card;
    }


    // ========================================================
    // SHOW CONTINUE BUTTON
    // ========================================================

    function showContinueButton() {

        if (
            !venueContinueButton
        ) {
            return;
        }

        if (
            selectedVenue &&
            selectedTime
        ) {

            venueContinueButton.style.display =
                "block";

        } else {

            venueContinueButton.style.display =
                "none";
        }
    }


    // ========================================================
    // GET VENUE ID FROM BACKEND
    // ========================================================

    async function getCurrentVenueId() {

        if (
            selectedVenueId
        ) {

            return selectedVenueId;
        }

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/venues"
                );

            if (!response.ok) {
                return null;
            }

            const data =
                await response.json();

            const venues =
                Array.isArray(data)
                    ? data
                    : (
                        Array.isArray(
                            data.venues
                        )
                            ? data.venues
                            : []
                    );

            const venue =
                venues.find(
                    function (item) {

                        return (
                            item.venue_name ===
                            selectedVenue
                        );
                    }
                );

            if (venue) {

                selectedVenueId =
                    venue.id;

                return venue.id;
            }

        } catch (error) {

            console.error(
                "Venue ID error:",
                error
            );
        }

        return null;
    }


    // ========================================================
    // RENDER SEAT PAGE SHOWTIMES
    // ========================================================

    async function renderSeatShowtimes() {

        if (!seatShowtimeList) {
            return;
        }

        seatShowtimeList.innerHTML =
            "";

        if (
            !selectedShowType ||
            !selectedVenue
        ) {

            return;
        }

        const shows =
            getUniqueShowtimes(
                selectedShowType
            );

        const venueId =
            await getCurrentVenueId();

        for (
            const show
            of shows
        ) {

            const showKey =
                show.type +
                " " +
                show.time;

            let status =
                "available";

            try {

                const params =
                    new URLSearchParams({

                        movie_name:
                            movieName,

                        booking_date:
                            getBookingDate(),

                        show_time:
                            showKey
                    });

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/" +
                        "venue-availability?" +
                        params.toString()
                    );

                if (
                    response.ok
                ) {

                    const data =
                        await response.json();

                    const availability =
                        normalizeAvailabilityResponse(
                            data
                        );

                    const venueData =
                        findVenueAvailability(
                            availability,
                            venueId
                        );

                    if (venueData) {

                        status =
                            getStatus(
                                venueData.available_seats,
                                venueData.total_seats ||
                                192
                            );
                    }
                }

            } catch (error) {

                console.error(
                    "Seat showtime availability error:",
                    error
                );
            }

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "seat-showtime-button " +
                status;

            button.textContent =
                show.displayTime;

            if (
                selectedTime ===
                showKey
            ) {

                button.classList.add(
                    "selected"
                );
            }

            if (
                status === "sold"
            ) {

                button.disabled =
                    true;

                button.title =
                    "Sold Out";

            } else {

                button.addEventListener(
                    "click",
                    async function () {

                        selectedTime =
                            showKey;

                        localStorage.setItem(
                            "selected_show_time",
                            selectedTime
                        );

                        clearSelectedSeats();

                        seatShowtimeList
                            .querySelectorAll(
                                ".seat-showtime-button"
                            )
                            .forEach(
                                function (
                                    item
                                ) {

                                    item.classList.remove(
                                        "selected"
                                    );
                                }
                            );

                        button.classList.add(
                            "selected"
                        );

                        updateSeatPageHeader();

                        await loadBookedSeats();
                    }
                );
            }

            seatShowtimeList.appendChild(
                button
            );
        }
    }


    // ========================================================
    // VENUE CONTINUE BUTTON
    // ========================================================

    if (
        venueContinueButton
    ) {

        venueContinueButton.addEventListener(
            "click",
            async function () {

                if (
                    !selectedVenue ||
                    !selectedTime
                ) {

                    alert(
                        "Please select a cinema and showtime."
                    );

                    return;
                }

                clearSelectedSeats();

                setupSeats();

                createSeatPriceNote();

                showSeatSelection();

                await loadBookedSeats();
            }
        );
    }


    // ========================================================
    // BACK BUTTON
    // ========================================================

    if (backButton) {

        backButton.addEventListener(
            "click",
            async function () {

                clearSelectedSeats();

                selectedVenue =
                    null;

                selectedVenueId =
                    null;

                selectedTime =
                    null;

                localStorage.removeItem(
                    "selected_venue"
                );

                localStorage.removeItem(
                    "selected_venue_id"
                );

                localStorage.removeItem(
                    "selected_show_time"
                );

                showVenueSelection();

                await loadVenues();
            }
        );
    }


    // ========================================================
    // GO TO CONFIRMATION PAGE
    // ========================================================

    if (bookButton) {

        bookButton.addEventListener(
            "click",
            function () {

                const userId =
                    localStorage.getItem(
                        "user_id"
                    );

                if (!userId) {

                    alert(
                        "Please login before booking."
                    );

                    return;
                }

                if (!selectedDate) {

                    alert(
                        "Please select a date."
                    );

                    return;
                }

                if (!selectedVenue) {

                    alert(
                        "Please select a cinema."
                    );

                    return;
                }

                if (!selectedTime) {

                    alert(
                        "Please select a showtime."
                    );

                    return;
                }

                if (!selectedShowType) {

                    alert(
                        "Please select a show format."
                    );

                    return;
                }

                if (
                    selectedSeats.length === 0
                ) {

                    alert(
                        "Please select at least one seat."
                    );

                    return;
                }

                const totalAmount =
                    selectedSeats.length *
                    pricePerSeat;

                const confirmationParams =
                    new URLSearchParams({

                        user_id:
                            userId,

                        movie_name:
                            movieName,

                        booking_date:
                            getBookingDate(),

                        show_time:
                            selectedTime,

                        show_type:
                            selectedShowType,

                        venue:
                            selectedVenue,

                        seats:
                            selectedSeats.join(","),

                        total_amount:
                            totalAmount.toString()
                    });

                window.location.href =
                    "confirmation.html?" +
                    confirmationParams.toString();
            }
        );
    }


    // ========================================================
    // LOAD DATE + FORMAT FROM URL
    // ========================================================

    function loadSelectionFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const urlDate =
            params.get("date");

        const urlType =
            params.get("type");


        if (urlDate) {

            selectedDate =
                urlDate;

            localStorage.setItem(
                "selected_booking_date",
                selectedDate
            );

        } else {

            selectedDate =
                localStorage.getItem(
                    "selected_booking_date"
                );
        }


        if (urlType) {

            selectedShowType =
                urlType;

            localStorage.setItem(
                "selected_show_type",
                selectedShowType
            );

        } else {

            selectedShowType =
                localStorage.getItem(
                    "selected_show_type"
                );
        }


        if (
            selectedDateSummary
        ) {

            selectedDateSummary.textContent =
                "Date: " +
                formatBookingDate(
                    selectedDate
                );
        }


        selectedVenue =
            null;

        selectedVenueId =
            null;

        selectedTime =
            null;


        localStorage.removeItem(
            "selected_venue"
        );

        localStorage.removeItem(
            "selected_venue_id"
        );

        localStorage.removeItem(
            "selected_show_time"
        );


        showVenueSelection();

        loadVenues();
    }


    // ========================================================
    // INITIALIZATION
    // ========================================================

    hideSeatSelection();


    if (
        venueContinueButton
    ) {

        venueContinueButton.style.display =
            "none";
    }


    createSeatPriceNote();

    setupSeats();

    loadSelectionFromURL();
}