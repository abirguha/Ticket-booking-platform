// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1")
        ? "http://127.0.0.1:5000"
        : "https://ticket-booking-platform-j8bm.onrender.com";

// ============================================================
// CUSTOM ALERT POPUP
// ============================================================

function showAppAlert(message, type = "info", onClose = null) {

    const existing = document.getElementById("app-alert-overlay");

    if (existing) {
        existing.remove();
    }

    const config = {
        success: {
            icon: "bx-check-circle",
            title: "Success",
            accent: "#4ade80"
        },
        error: {
            icon: "bx-x-circle",
            title: "Something went wrong",
            accent: "#ff5c5c"
        },
        warning: {
            icon: "bx-error-circle",
            title: "Please check",
            accent: "#f59e0b"
        },
        info: {
            icon: "bx-info-circle",
            title: "Notice",
            accent: "#60a5fa"
        }
    };

    const selected = config[type] || config.info;

    const style = document.createElement("style");

    style.id = "app-alert-style";

    style.textContent = `
        #app-alert-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.72);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            animation: appAlertFadeIn 0.2s ease;
        }

        #app-alert-box {
            width: min(420px, 92vw);
            padding: 32px 28px 26px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 22px;
            background: linear-gradient(
                145deg,
                rgba(35, 35, 35, 0.98),
                rgba(15, 15, 15, 0.98)
            );
            box-shadow:
                0 25px 80px rgba(0, 0, 0, 0.55),
                0 0 35px ${selected.accent}22;
            text-align: center;
            transform: scale(0.88);
            animation: appAlertPop 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        #app-alert-icon {
            width: 76px;
            height: 76px;
            margin: 0 auto 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: ${selected.accent}18;
            border: 1px solid ${selected.accent}55;
            box-shadow: 0 0 28px ${selected.accent}22;
        }

        #app-alert-icon i {
            font-size: 42px;
            color: ${selected.accent};
        }

        #app-alert-title {
            margin: 0 0 10px;
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
        }

        #app-alert-message {
            margin: 0 auto 24px;
            max-width: 340px;
            color: rgba(255, 255, 255, 0.72);
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-line;
        }

        #app-alert-ok {
            min-width: 110px;
            padding: 11px 24px;
            border: none;
            border-radius: 10px;
            background: ${selected.accent};
            color: #111111;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s ease;
        }

        #app-alert-ok:hover {
            transform: translateY(-2px);
            filter: brightness(1.08);
            box-shadow: 0 8px 22px ${selected.accent}35;
        }

        @keyframes appAlertFadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes appAlertPop {
            to {
                transform: scale(1);
            }
        }
    `;

    document.head.appendChild(style);

    const overlay = document.createElement("div");

    overlay.id = "app-alert-overlay";

    overlay.innerHTML =
        '<div id="app-alert-box">' +
            '<div id="app-alert-icon">' +
                '<i class="bx ' + selected.icon + '"></i>' +
            '</div>' +
            '<h2 id="app-alert-title">' +
                selected.title +
            '</h2>' +
            '<p id="app-alert-message">' +
                message +
            '</p>' +
            '<button id="app-alert-ok" type="button">' +
                'OK' +
            '</button>' +
        '</div>';

    document.body.appendChild(overlay);

    const closePopup = function () {

        overlay.style.animation =
            "appAlertFadeIn 0.15s ease reverse";

        setTimeout(function () {

            overlay.remove();

            if (style.parentNode) {
                style.remove();
            }

            if (typeof onClose === "function") {
                onClose();
            }

        }, 120);

    };

    document
        .getElementById("app-alert-ok")
        .addEventListener("click", closePopup);

    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {
            closePopup();
        }

    });

    document.addEventListener(
        "keydown",
        function handleAlertEnter(event) {

            if (
                event.key === "Enter" &&
                document.getElementById("app-alert-overlay")
            ) {

                // Only close the popup if the popup itself
                // currently has focus.
                if (
                    document.activeElement &&
                    document.activeElement.id === "app-alert-ok"
                ) {

                    event.preventDefault();

                    closePopup();

                    document.removeEventListener(
                        "keydown",
                        handleAlertEnter
                    );
                }
            }

        }
    );

    setTimeout(function () {

        const okButton =
            document.getElementById("app-alert-ok");

        if (okButton) {
            okButton.focus();
        }

    }, 50);
}

// ============================================================
// LOGIN / REGISTER UI
// ============================================================

var a =
    document.getElementById("loginBtn");

var b =
    document.getElementById("registerBtn");

var x =
    document.getElementById("login");

var y =
    document.getElementById("register");


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

        menu.className +=
            " responsive";

    } else {

        menu.className =
            "nav-menu";
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


    if (!email && !password) {

        showAppAlert(
            "Please enter email and password.",
            "warning"
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

            showAppAlert(
                "Wrong credentials.",
                "error"
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


        showAppAlert(
            "Welcome back! You have been successfully logged in.",
            "success",
            function () {
                window.location.href =
                    "home.html";
            }
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showAppAlert(
            "Unable to connect to the server.\n" +
            "Please make sure Flask is running.",
            "error"
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

        showAppAlert(
            "Please fill all fields.",
            "warning"
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

            showAppAlert(
                data.message ||
                "Signup failed.",
                "error"
            );

            return;
        }


        showAppAlert(
            "Your account has been created successfully. Please login.",
            "success",
            function () {
                login();
            }
        );


    } catch (error) {

        console.error(
            "Signup error:",
            error
        );


        showAppAlert(
            "Unable to connect to the server.\n" +
            "Please make sure Flask is running.",
            "error"
        );
    }
}


// ============================================================
// BOOKING SYSTEM
// ============================================================

const bookingPage =
    document.querySelector(".booking");


if (bookingPage) {


    // ========================================================
    // VARIABLES
    // ========================================================

    const bookingPageParams =
        new URLSearchParams(
            window.location.search
        );

    const movieName =
        bookingPageParams.get("movie") ||
        bookingPageParams.get("movie_name") ||
        "Venom: The Last Dance";

    const pricePerSeat =
        560;


    let selectedDate =
        null;

    let selectedShowType =
        null;

    let selectedVenue =
        null;

    let selectedVenueId =
        null;

    let selectedTime =
        null;


    const selectedSeats = [];


    // ========================================================
    // VENUE PAGE ELEMENTS
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

    const seatBookingTop =
        document.querySelector(
            ".seat-booking-top"
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


    const seatDateDisplay =
        document.getElementById(
            "seat_date_display"
        );


    const screen =
        document.querySelector(
            ".screen"
        );


    const chair =
        document.querySelector(
            ".chair"
        );


    const details =
        document.getElementById(
            "det"
        );


    const bookButton =
        document.getElementById(
            "book_ticket"
        );


    const backButton =
        document.getElementById(
            "back_ticket"
        );


    const bookingTotalPrice =
        document.getElementById(
            "booking_total_price"
        );


    const selectedSeatsDisplay =
        document.getElementById(
            "selected_seats_display"
        );


    // ========================================================
    // PAGE DETECTION
    // ========================================================

    const isVenuePage =
        !!venueSelection;


    const isSeatPage =
        !!seatBookingTop;


    // ========================================================
    // VENUE PAGE VISUAL LAYOUT
    // ========================================================

    function applyVenuePageLayout() {

        if (!isVenuePage) {
            return;
        }


        const existingStyle =
            document.getElementById(
                "venue-page-layout-style"
            );


        if (existingStyle) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "venue-page-layout-style";


        style.textContent = `

            /* ====================================================
               MAIN VENUE PAGE
               ==================================================== */

            #venue_selection {

                min-height: 100vh !important;

                padding:
                    28px 32px 24px !important;

                box-sizing: border-box;

                overflow: hidden;

            }


            .venue-selection-inner {

                position: relative;

                max-width: 1320px !important;

                min-height:
                    calc(100vh - 52px);

                margin:
                    0 auto !important;

                padding:
                    28px 30px 24px !important;

                box-sizing: border-box;

            }


            /* ====================================================
               HEADING
               ==================================================== */

            .venue-selection-inner h1 {

                text-align: left !important;

                margin: 0 !important;

                padding-right: 300px;

                font-size: 32px !important;

                line-height: 1.2;

                display: flex;

                align-items: center;

                gap: 12px;

            }


            .venue-selection-inner h1 .venue-heading-icon {

                width: 42px;

                height: 42px;

                flex: 0 0 42px;

                display: inline-flex;

                align-items: center;

                justify-content: center;

                border-radius: 12px;

                background:
                    rgba(255,92,92,0.12);

                border:
                    1px solid
                    rgba(255,92,92,0.30);

                font-size: 22px;

                box-shadow:
                    0 0 18px
                    rgba(255,92,92,0.10);

            }


            .venue-selection-inner > p {

                text-align: left !important;

                margin:
                    8px 300px 18px 0 !important;

                color:
                    rgba(255,255,255,0.62) !important;

                font-size: 14px;

            }


            /* ====================================================
               SELECTED DATE - TOP RIGHT
               ==================================================== */

            .venue-selection-inner
            .booking-info-pill {

                position: absolute;

                top: 30px;

                right: 30px;

                margin: 0 !important;

                padding:
                    10px 16px !important;

                border-radius: 12px !important;

                border:
                    1px solid
                    rgba(255,255,255,0.14) !important;

                background:
                    rgba(255,255,255,0.055) !important;

                color:
                    rgba(255,255,255,0.90) !important;

                font-size: 13px !important;

                white-space: nowrap;

                box-shadow:
                    0 8px 24px
                    rgba(0,0,0,0.16);

            }


            /* ====================================================
               CINEMA LIST - USE MORE OF THE SCREEN
               ==================================================== */

            .venue-list {

                max-height:
                    calc(100vh - 230px) !important;

                gap:
                    12px !important;

                padding-right:
                    6px !important;

                overflow-y: auto;

            }


            /* ====================================================
               CINEMA CARDS
               Keep cards compact so MORE cards are visible.
               ==================================================== */

            .cinema-card {

                padding:
                    17px 20px !important;

                border-radius:
                    14px !important;

            }


            .cinema-header {

                margin-bottom:
                    10px !important;

            }


            .cinema-info h3 {

                font-size:
                    20px !important;

                line-height:
                    1.25;

            }


            .cinema-info p {

                margin:
                    4px 0 0 !important;

                font-size:
                    13px;

            }


            .showtime-title {

                margin-bottom:
                    7px !important;

                font-size:
                    13px !important;

            }


            .showtime-container {

                gap:
                    8px !important;

            }


            .venue-showtime {

                padding:
                    8px 15px !important;

                border-radius:
                    8px !important;

                font-size:
                    13px;

            }


            /* ====================================================
               CLEAN SCROLLBAR
               ==================================================== */

            .venue-list::-webkit-scrollbar {

                width: 7px;

            }


            .venue-list::-webkit-scrollbar-track {

                background:
                    rgba(255,255,255,0.035);

                border-radius:
                    10px;

            }


            .venue-list::-webkit-scrollbar-thumb {

                background:
                    rgba(255,255,255,0.20);

                border-radius:
                    10px;

            }


            /* ====================================================
               MOBILE
               ==================================================== */

            @media (max-width: 700px) {

                #venue_selection {

                    padding:
                        18px 12px !important;

                    overflow: auto;

                }


                .venue-selection-inner {

                    min-height: auto;

                    padding:
                        22px 18px !important;

                }


                .venue-selection-inner h1 {

                    padding-right: 0;

                    font-size:
                        25px !important;

                }


                .venue-selection-inner > p {

                    margin:
                        8px 0 15px !important;

                    padding-right: 0;

                }


                .venue-selection-inner
                .booking-info-pill {

                    position: static;

                    display: inline-block;

                    margin-bottom:
                        15px !important;

                }


                .venue-list {

                    max-height:
                        none !important;

                    overflow: visible;

                }

            }

        `;


        document.head.appendChild(style);
    }


    // ========================================================
    // SHOWTIME DATA
    // ========================================================

    const showtimeList = [

        {
            type: "2D",
            time: "09:00",
            displayTime: "09:00 AM"
        },

        {
            type: "3D",
            time: "10:00",
            displayTime: "10:00 AM"
        },

        {
            type: "2D",
            time: "12:00",
            displayTime: "12:00 PM"
        },

        {
            type: "3D",
            time: "13:00",
            displayTime: "01:00 PM"
        },

        {
            type: "2D",
            time: "15:00",
            displayTime: "03:00 PM"
        },

        {
            type: "3D",
            time: "16:00",
            displayTime: "04:00 PM"
        },

        {
            type: "2D",
            time: "18:00",
            displayTime: "06:00 PM"
        },

        {
            type: "3D",
            time: "19:00",
            displayTime: "07:00 PM"
        },

        {
            type: "2D",
            time: "21:00",
            displayTime: "09:00 PM"
        },

        {
            type: "3D",
            time: "22:00",
            displayTime: "10:00 PM"
        }

    ];


    // ========================================================
    // UNIQUE SHOWTIMES
    // ========================================================

    function getUniqueShowtimes(type) {

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


        const parts =
            String(dateValue).split("-");


        if (
            parts.length !== 3
        ) {

            return dateValue;
        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);


        const months = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];


        if (
            month < 1 ||
            month > 12
        ) {

            return dateValue;
        }


        return (
            String(day) +
            " " +
            months[month - 1] +
            ", " +
            String(year)
        );
    }


    // ========================================================
    // SHOW / HIDE SEAT PAGE
    // ========================================================

    function hideSeatPage() {

        if (seatBookingTop) {

            seatBookingTop.style.display =
                "none";
        }


        if (seatDateDisplay) {

            const dateContainer =
                seatDateDisplay.closest(
                    ".seat-booking-date"
                );

            if (dateContainer) {

                dateContainer.style.display =
                    "none";
            }
        }


        if (screen) {

            screen.style.display =
                "none";
        }


        if (chair) {

            chair.style.display =
                "none";
        }


        if (details) {

            details.style.display =
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


        if (bookingTotalPrice) {

            bookingTotalPrice.style.display =
                "none";
        }


        if (selectedSeatsDisplay) {

            selectedSeatsDisplay.style.display =
                "none";
        }
    }


    function showSeatPage() {

        if (seatBookingTop) {

            seatBookingTop.style.display =
                "";
        }


        if (seatDateDisplay) {

            const dateContainer =
                seatDateDisplay.closest(
                    ".seat-booking-date"
                );

            if (dateContainer) {

                dateContainer.style.display =
                    "";
            }
        }


        if (screen) {

            screen.style.display =
                "";
        }


        if (chair) {

            chair.style.display =
                "";
        }


        if (details) {

            details.style.display =
                "";
        }


        if (bookButton) {

            bookButton.style.display =
                "flex";
        }


        if (backButton) {

            backButton.style.display =
                "flex";
        }


        if (bookingTotalPrice) {

            bookingTotalPrice.style.display =
                "";
        }


        if (selectedSeatsDisplay) {

            selectedSeatsDisplay.style.display =
                "";
        }
    }


    // ========================================================
    // VENUE AVAILABILITY
    // ========================================================

    async function getVenueAvailability(
        showTime
    ) {

        try {

            const url =
                "http://127.0.0.1:5000/venue-availability" +
                "?movie_name=" +
                encodeURIComponent(
                    movieName
                ) +
                "&booking_date=" +
                encodeURIComponent(
                    getBookingDate()
                ) +
                "&show_time=" +
                encodeURIComponent(
                    showTime
                );


            const response =
                await fetch(url);


            if (!response.ok) {

                return [];
            }


            const data =
                await response.json();


            if (
                Array.isArray(data)
            ) {

                return data;
            }


            if (
                Array.isArray(
                    data.venues
                )
            ) {

                return data.venues;
            }


            return [];


        } catch (error) {

            console.error(
                "Venue availability error:",
                error
            );

            return [];
        }
    }


    // ========================================================
    // FIND VENUE AVAILABILITY
    // ========================================================

    function findVenueAvailability(
        availability,
        venueId
    ) {

        if (
            !Array.isArray(
                availability
            )
        ) {

            return null;
        }


        return availability.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(venueId)
                );
            }
        );
    }


    // ========================================================
    // AVAILABILITY STATUS
    // ========================================================

    function getAvailabilityStatus(
        availableSeats,
        totalSeats
    ) {

        const available =
            Number(
                availableSeats
            );


        const total =
            Number(
                totalSeats
            );


        if (
            available <= 0
        ) {

            return "sold";
        }


        if (
            available <=
            Math.max(
                10,
                Math.ceil(
                    total * 0.15
                )
            )
        ) {

            return "almost";
        }


        return "available";
    }


    // ========================================================
    // CREATE VENUE CARD
    // ========================================================

    function createVenueCard(
        venue,
        showtimeAvailability
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


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            venue.venue_name;


        const location =
            document.createElement(
                "p"
            );


        location.textContent =
            venue.location ||
            "";


        info.appendChild(
            title
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


        const titleLabel =
            document.createElement(
                "div"
            );


        titleLabel.className =
            "showtime-title";


        titleLabel.textContent =
            "Showtimes";


        card.appendChild(
            titleLabel
        );


        const timeContainer =
            document.createElement(
                "div"
            );


        timeContainer.className =
            "showtime-container";


        const shows =
            getUniqueShowtimes(
                selectedShowType
            );


        shows.forEach(
            function (show) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "venue-showtime";


                const showKey =
                    show.type +
                    " " +
                    show.time;


                button.textContent =
                    show.displayTime;


                const availability =
                    findVenueAvailability(
                        showtimeAvailability[
                            showKey
                        ],
                        venue.id
                    );


                let availableSeats =
                    Number(
                        venue.total_seats
                    );


                if (
                    availability &&
                    availability.available_seats !==
                    undefined
                ) {

                    availableSeats =
                        Number(
                            availability.available_seats
                        );
                }


                const status =
                    getAvailabilityStatus(
                        availableSeats,
                        venue.total_seats
                    );


                button.classList.add(
                    status
                );


                if (
                    status === "sold"
                ) {

                    button.disabled =
                        true;

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
                                showKey;


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


        legend.innerHTML =
            '<span>' +
            '<span class="legend-dot available-dot"></span>' +
            'Available' +
            '</span>' +

            '<span>' +
            '<span class="legend-dot almost-dot"></span>' +
            'Almost Sold' +
            '</span>' +

            '<span>' +
            '<span class="legend-dot sold-dot"></span>' +
            'Sold Out' +
            '</span>';


        card.appendChild(
            legend
        );


        return card;
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


        const loading =
            document.createElement(
                "div"
            );


        loading.className =
            "venue-loading";


        loading.textContent =
            "Loading cinemas...";


        venueList.appendChild(
            loading
        );


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


            venueList.innerHTML =
                "";


            if (
                venues.length === 0
            ) {

                venueList.innerHTML =
                    "<p>No cinemas available.</p>";

                return;
            }


            const availabilityMap =
                {};


            const shows =
                getUniqueShowtimes(
                    selectedShowType
                );


            for (
                const show
                of shows
            ) {

                const showKey =
                    show.type +
                    " " +
                    show.time;


                availabilityMap[
                    showKey
                ] =
                    await getVenueAvailability(
                        showKey
                    );
            }


            venues.forEach(
                function (venue) {

                    venueList.appendChild(
                        createVenueCard(
                            venue,
                            availabilityMap
                        )
                    );
                }
            );


        } catch (error) {

            console.error(
                "Load venues error:",
                error
            );


            venueList.innerHTML =
                "<p>Unable to load cinemas. " +
                "Please make sure Flask is running.</p>";
        }
    }


    // ========================================================
    // CONTINUE BUTTON
    // ========================================================

    function showContinueButton() {

        if (!venueContinueButton) {
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
    // VENUE → SEAT SELECTION
    // ========================================================

    if (
        venueContinueButton
    ) {

        venueContinueButton.addEventListener(
            "click",
            function () {

                if (!selectedVenue) {

                    showAppAlert(
                        "Please select a cinema.",
                        "warning"
                    );

                    return;
                }


                if (!selectedTime) {

                    showAppAlert(
                        "Please select a showtime.",
                        "warning"
                    );

                    return;
                }


                const params =
                    new URLSearchParams();


                params.set(
                    "date",
                    getBookingDate()
                );


                params.set(
                    "type",
                    selectedShowType
                );


                params.set(
                    "movie",
                    movieName
                );


                params.set(
                    "venue",
                    selectedVenue
                );


                params.set(
                    "venue_id",
                    selectedVenueId
                );


                params.set(
                    "show_time",
                    selectedTime
                );


                window.location.href =
                    "seat_selection.html?" +
                    params.toString();
            }
        );
    }


    // ========================================================
    // SEAT MAP
    // ========================================================

    function setupSeats() {

        if (
            !chair ||
            !isSeatPage
        ) {

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
            function (rowLetter) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "row";


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
                        rowLetter +
                        i;


                    seat.textContent =
                        seatNumber;


                    seat.dataset.seat =
                        seatNumber;


                    seat.className =
                        "chair-seat";


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


                            toggleSeat(
                                seat,
                                seatNumber
                            );
                        }
                    );


                    row.appendChild(
                        seat
                    );
                }


                chair.appendChild(
                    row
                );
            }
        );
    }


    // ========================================================
    // TOGGLE SEAT
    // ========================================================

    function toggleSeat(
        seat,
        seatNumber
    ) {

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


        updateSeatSummary();
    }


    // ========================================================
    // UPDATE SEAT SUMMARY
    // ========================================================

    function updateSeatSummary() {

        const count =
            selectedSeats.length;


        const total =
            count *
            pricePerSeat;


        if (bookingTotalPrice) {

            bookingTotalPrice.textContent =
                "Total: " +
                count +
                " seats";
        }


        if (selectedSeatsDisplay) {

            if (count === 0) {

                selectedSeatsDisplay.textContent =
                    "Selected: --";

            } else {

                selectedSeatsDisplay.textContent =
                    "Selected: " +
                    selectedSeats.join(
                        ", "
                    );
            }
        }


        const priceNote =
            document.getElementById(
                "seat_price_note"
            );


        if (priceNote) {

            priceNote.textContent =
                "₹" +
                pricePerSeat +
                " per seat • Total ₹" +
                total;
        }
    }


    // ========================================================
    // LOAD BOOKED SEATS
    // ========================================================

    async function loadBookedSeats() {

        if (
            !chair ||
            !selectedVenue ||
            !selectedTime
        ) {

            return;
        }


        document
            .querySelectorAll(
                ".chair-seat"
            )
            .forEach(
                function (seat) {

                    seat.classList.remove(
                        "booked"
                    );
                }
            );


        try {

            const url =
                "http://127.0.0.1:5000/booked-seats" +
                "?movie_name=" +
                encodeURIComponent(
                    movieName
                ) +
                "&booking_date=" +
                encodeURIComponent(
                    getBookingDate()
                ) +
                "&show_time=" +
                encodeURIComponent(
                    selectedTime
                ) +
                "&venue=" +
                encodeURIComponent(
                    selectedVenue
                );


            const response =
                await fetch(url);


            if (!response.ok) {

                return;
            }


            const data =
                await response.json();


            let bookedSeats =
                [];


            if (
                Array.isArray(data)
            ) {

                bookedSeats =
                    data;

            } else if (
                Array.isArray(
                    data.booked_seats
                )
            ) {

                bookedSeats =
                    data.booked_seats;

            } else if (
                Array.isArray(
                    data.seats
                )
            ) {

                bookedSeats =
                    data.seats;
            }


            bookedSeats.forEach(
                function (seatNumber) {

                    const seat =
                        document.querySelector(
                            '[data-seat="' +
                            seatNumber +
                            '"]'
                        );


                    if (seat) {

                        seat.classList.add(
                            "booked"
                        );
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
    // RENDER SEAT PAGE SHOWTIMES
    // ========================================================

    async function renderSeatShowtimes() {

        if (!seatShowtimeList) {
            return;
        }


        seatShowtimeList.innerHTML =
            "";


        const shows =
            getUniqueShowtimes(
                selectedShowType
            );


        for (
            const show
            of shows
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "seat-showtime-button";


            button.textContent =
                show.displayTime;


            const showKey =
                show.type +
                " " +
                show.time;


            if (
                showKey ===
                selectedTime
            ) {

                button.classList.add(
                    "selected"
                );
            }


            try {

                const availability =
                    await getVenueAvailability(
                        showKey
                    );


                const venueAvailability =
                    findVenueAvailability(
                        availability,
                        selectedVenueId
                    );


                let availableSeats =
                    0;


                let totalSeats =
                    192;


                if (
                    venueAvailability
                ) {

                    availableSeats =
                        Number(
                            venueAvailability.available_seats
                        );


                    if (
                        venueAvailability.total_seats
                    ) {

                        totalSeats =
                            Number(
                                venueAvailability.total_seats
                            );
                    }
                }


                const status =
                    getAvailabilityStatus(
                        availableSeats,
                        totalSeats
                    );


                button.classList.add(
                    status
                );


                if (
                    status === "sold" &&
                    showKey !== selectedTime
                ) {

                    button.disabled =
                        true;
                }


            } catch (error) {

                console.error(
                    "Showtime availability error:",
                    error
                );
            }


            button.addEventListener(
                "click",
                async function () {

                    if (
                        button.disabled
                    ) {

                        return;
                    }


                    selectedTime =
                        showKey;


                    localStorage.setItem(
                        "selected_show_time",
                        selectedTime
                    );


                    document
                        .querySelectorAll(
                            ".seat-showtime-button"
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


                    clearSelectedSeats();


                    await loadBookedSeats();
                }
            );


            seatShowtimeList.appendChild(
                button
            );
        }
    }


    // ========================================================
    // CLEAR SELECTED SEATS
    // ========================================================

    function clearSelectedSeats() {

        selectedSeats.length =
            0;


        document
            .querySelectorAll(
                ".chair-seat.selected"
            )
            .forEach(
                function (seat) {

                    seat.classList.remove(
                        "selected"
                    );
                }
            );


        updateSeatSummary();
    }


    // ========================================================
    // BACK TO VENUE PAGE
    // ========================================================

    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                const params =
                    new URLSearchParams();


                params.set(
                    "date",
                    getBookingDate()
                );


                params.set(
                    "type",
                    selectedShowType
                );


                window.location.href =
                    "booking.html?" +
                    params.toString();
            }
        );
    }


    // ========================================================
    // PROCEED TO CONFIRMATION
    // ========================================================

    if (bookButton) {

        bookButton.addEventListener(
            "click",
            function () {

                if (!selectedDate) {

                    showAppAlert(
                        "Please select a date.",
                        "warning"
                    );

                    return;
                }


                if (!selectedVenue) {

                    showAppAlert(
                        "Please select a cinema.",
                        "warning"
                    );

                    return;
                }


                if (!selectedTime) {

                    showAppAlert(
                        "Please select a showtime.",
                        "warning"
                    );

                    return;
                }


                if (!selectedShowType) {

                    showAppAlert(
                        "Please select 2D or 3D.",
                        "warning"
                    );

                    return;
                }


                if (
                    selectedSeats.length === 0
                ) {

                    showAppAlert(
                        "Please select at least one seat.",
                        "warning"
                    );

                    return;
                }


                const totalAmount =
                    selectedSeats.length *
                    pricePerSeat;


                const userId =
                    localStorage.getItem(
                        "user_id"
                    );


                if (!userId) {

                    showAppAlert(
                        "Please login before booking a ticket.",
                        "warning"
                    );

                    return;
                }


                const params =
                    new URLSearchParams();


                params.set(
                    "user_id",
                    userId
                );


                params.set(
                    "movie_name",
                    movieName
                );


                params.set(
                    "booking_date",
                    getBookingDate()
                );


                params.set(
                    "show_time",
                    selectedTime
                );


                params.set(
                    "show_type",
                    selectedShowType
                );


                params.set(
                    "venue",
                    selectedVenue
                );


                params.set(
                    "seats",
                    selectedSeats.join(
                        ", "
                    )
                );


                params.set(
                    "total_amount",
                    totalAmount
                );


                window.location.href =
                    "confirmation.html?" +
                    params.toString();
            }
        );
    }


    // ========================================================
    // LOAD SEAT PAGE DATA FROM URL
    // ========================================================

    function loadSeatPageFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        selectedDate =
            params.get("date") ||
            localStorage.getItem(
                "selected_booking_date"
            );


        selectedShowType =
            params.get("type") ||
            localStorage.getItem(
                "selected_show_type"
            );


        selectedVenue =
            params.get("venue") ||
            localStorage.getItem(
                "selected_venue"
            );


        selectedVenueId =
            params.get("venue_id") ||
            localStorage.getItem(
                "selected_venue_id"
            );


        selectedTime =
            params.get("show_time") ||
            localStorage.getItem(
                "selected_show_time"
            );


        if (selectedDate) {

            localStorage.setItem(
                "selected_booking_date",
                selectedDate
            );
        }


        if (selectedShowType) {

            localStorage.setItem(
                "selected_show_type",
                selectedShowType
            );
        }


        if (selectedVenue) {

            localStorage.setItem(
                "selected_venue",
                selectedVenue
            );
        }


        if (selectedVenueId) {

            localStorage.setItem(
                "selected_venue_id",
                selectedVenueId
            );
        }


        if (selectedTime) {

            localStorage.setItem(
                "selected_show_time",
                selectedTime
            );
        }


        if (seatMovieTitle) {

            seatMovieTitle.innerHTML =
                movieName +
                " <span>(" +
                selectedShowType +
                ")</span>";
        }


        if (seatShowType) {

            seatShowType.textContent =
                "";
        }


        if (seatVenueName) {

            seatVenueName.textContent =
                selectedVenue ||
                "";
        }


        if (seatDateDisplay) {

            seatDateDisplay.textContent =
                "Date: " +
                formatBookingDate(
                    selectedDate
                );
        }


        showSeatPage();


        setupSeats();


        renderSeatShowtimes();


        loadBookedSeats();


        updateSeatSummary();
    }


    // ========================================================
    // LOAD VENUE PAGE DATA FROM URL
    // ========================================================

    function loadVenuePageFromURL() {

        applyVenuePageLayout();


        const venueHeading =
            document.querySelector(
                "#venue_selection .venue-selection-inner h1"
            );


        if (
            venueHeading &&
            !venueHeading.querySelector(
                ".venue-heading-icon"
            )
        ) {

            venueHeading.innerHTML =
                '<span class="venue-heading-icon">🎬</span>' +
                'Select Cinema & Showtime';

        }


        const params =
            new URLSearchParams(
                window.location.search
            );


        selectedDate =
            params.get("date") ||
            localStorage.getItem(
                "selected_booking_date"
            );


        selectedShowType =
            params.get("type") ||
            localStorage.getItem(
                "selected_show_type"
            );


        localStorage.setItem(
            "selected_booking_date",
            selectedDate || ""
        );


        localStorage.setItem(
            "selected_show_type",
            selectedShowType || ""
        );


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


        if (selectedDateSummary) {

            selectedDateSummary.textContent =
                "Date: " +
                formatBookingDate(
                    selectedDate
                );
        }


        if (venueContinueButton) {

            venueContinueButton.style.display =
                "none";
        }


        hideSeatPage();


        loadVenues();
    }


    // ========================================================
    // INITIALIZATION
    // ========================================================

    if (isVenuePage) {

        loadVenuePageFromURL();
    }


    if (isSeatPage) {

        loadSeatPageFromURL();
    }

}