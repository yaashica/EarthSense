/* =====================================================
   EARTHSENSE WEB APPLICATION
===================================================== */


/* =====================================================
   AUTHENTICATION
===================================================== */


/*
    DEMO AUTHENTICATION

    User account is stored in browser localStorage.

    For a real production system, replace this
    with AWS Cognito / backend authentication.
*/


function showSignup() {

    document.getElementById("loginForm")
        .classList.add("hidden");

    document.getElementById("signupForm")
        .classList.remove("hidden");

}


function showLogin() {

    document.getElementById("signupForm")
        .classList.add("hidden");

    document.getElementById("loginForm")
        .classList.remove("hidden");

}


/* =====================================================
   PASSWORD VALIDATION
===================================================== */

function validatePassword(password) {

    return {

        length:
            password.length >= 16,

        uppercase:
            /[A-Z]/.test(password),

        number:
            /[0-9]/.test(password),

        symbol:
            /[^A-Za-z0-9]/.test(password)

    };

}


function checkPassword() {

    const password =
        document.getElementById("signupPassword").value;

    const rules =
        validatePassword(password);


    updatePasswordRule(
        "ruleLength",
        rules.length
    );


    updatePasswordRule(
        "ruleUpper",
        rules.uppercase
    );


    updatePasswordRule(
        "ruleNumber",
        rules.number
    );


    updatePasswordRule(
        "ruleSymbol",
        rules.symbol
    );

}


function updatePasswordRule(id, valid) {

    const element =
        document.getElementById(id);

    const icon =
        element.querySelector("i");


    if (valid) {

        element.classList.add("valid");

        icon.className =
            "fa-solid fa-circle-check";

    }

    else {

        element.classList.remove("valid");

        icon.className =
            "fa-solid fa-circle";

    }

}


/* =====================================================
   SIGN UP
===================================================== */

function signup() {

    const email =
        document.getElementById("signupEmail")
        .value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById("signupPassword")
        .value;


    const confirmPassword =
        document.getElementById("confirmPassword")
        .value;


    const message =
        document.getElementById("signupMessage");


    /* Gmail validation */

    if (!email.endsWith("@gmail.com")) {

        showMessage(
            message,
            "Please enter a valid Gmail ID.",
            "error"
        );

        return;

    }


    /* Password rules */

    const rules =
        validatePassword(password);


    if (
        !rules.length ||
        !rules.uppercase ||
        !rules.number ||
        !rules.symbol
    ) {

        showMessage(
            message,
            "Password does not meet all requirements.",
            "error"
        );

        return;

    }


    /* Confirm password */

    if (password !== confirmPassword) {

        showMessage(
            message,
            "Passwords do not match.",
            "error"
        );

        return;

    }


    /* Save account */

    const user = {

        email: email,

        password: password

    };


    localStorage.setItem(
        "earthsenseUser",
        JSON.stringify(user)
    );


    showMessage(
        message,
        "Account created successfully.",
        "success"
    );


    setTimeout(() => {

        showLogin();

        document.getElementById("loginEmail")
            .value = email;

    }, 1000);

}


/* =====================================================
   LOGIN
===================================================== */

function login() {

    const email =
        document.getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById("loginPassword")
        .value;


    const message =
        document.getElementById("loginMessage");


    const storedUser =
        localStorage.getItem(
            "earthsenseUser"
        );


    if (!storedUser) {

        showMessage(
            message,
            "No account found. Please create an account first.",
            "error"
        );

        return;

    }


    const user =
        JSON.parse(storedUser);


    if (
        email === user.email &&
        password === user.password
    ) {

        localStorage.setItem(
            "earthsenseLoggedIn",
            "true"
        );


        localStorage.setItem(
            "earthsenseCurrentUser",
            email
        );


        openDashboard();

    }

    else {

        showMessage(
            message,
            "Incorrect Gmail ID or password.",
            "error"
        );

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    element,
    message,
    type
) {

    element.textContent =
        message;

    element.className =
        "auth-message " + type;

}


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function togglePassword(
    inputId,
    icon
) {

    const input =
        document.getElementById(inputId);


    if (input.type === "password") {

        input.type = "text";

        icon.className =
            "fa-regular fa-eye-slash password-eye";

    }

    else {

        input.type = "password";

        icon.className =
            "fa-regular fa-eye password-eye";

    }

}


/* =====================================================
   OPEN DASHBOARD
===================================================== */

function openDashboard() {

    document
        .getElementById("authScreen")
        .classList.add("hidden");


    document
        .getElementById("dashboardApp")
        .classList.remove("hidden");


    const userEmail =
        localStorage.getItem(
            "earthsenseCurrentUser"
        );


    document
        .getElementById("userEmail")
        .textContent =
        userEmail || "User";


    showPage("dashboard");

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "earthsenseLoggedIn"
    );

    localStorage.removeItem(
        "earthsenseCurrentUser"
    );


    document
        .getElementById("dashboardApp")
        .classList.add("hidden");


    document
        .getElementById("authScreen")
        .classList.remove("hidden");


    document
        .getElementById("loginPassword")
        .value = "";

}


/* =====================================================
   CHECK LOGIN ON PAGE LOAD
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const loggedIn =
            localStorage.getItem(
                "earthsenseLoggedIn"
            );


        if (loggedIn === "true") {

            openDashboard();

        }

        else {

            document
                .getElementById("authScreen")
                .classList.remove("hidden");

        }

    }
);


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(
    page,
    clickedItem = null
) {

    /* Prevent anchor jump */

    if (event) {

        event.preventDefault();

    }


    /* Active sidebar item */

    if (clickedItem) {

        document
            .querySelectorAll(".nav-item")
            .forEach(item => {

                item.classList.remove("active");

            });


        clickedItem.classList.add("active");

    }


    const pageContent =
        document.getElementById(
            "pageContent"
        );


    if (page === "dashboard") {

        setPageHeader(
            "Earth Pit Monitoring",
            "Real-time insights for reliable earthing systems"
        );


        pageContent.innerHTML =
            dashboardPage();


        createDashboardCharts();

    }


    else if (page === "live") {

        setPageHeader(
            "Live Sensor Data",
            "Real-time EarthSense parameter monitoring"
        );


        pageContent.innerHTML =
            liveDataPage();

    }


    else if (page === "trends") {

        setPageHeader(
            "Parameter Trends",
            "Historical behaviour of monitored parameters"
        );


        pageContent.innerHTML =
            trendsPage();


        createTrendCharts();

    }


    else if (page === "alerts") {

        setPageHeader(
            "Alerts & Notifications",
            "Monitor abnormal and critical conditions"
        );


        pageContent.innerHTML =
            alertsPage();

    }


    else if (page === "reports") {

        setPageHeader(
            "Reports",
            "EarthSense monitoring and prediction reports"
        );


        pageContent.innerHTML =
            reportsPage();

    }


    else if (page === "settings") {

        setPageHeader(
            "System Settings",
            "Configure EarthSense monitoring parameters"
        );


        pageContent.innerHTML =
            settingsPage();

    }

}


/* =====================================================
   PAGE HEADER
===================================================== */

function setPageHeader(
    title,
    subtitle
) {

    document.getElementById(
        "pageTitle"
    ).innerHTML =
        title;


    document.getElementById(
        "pageSubtitle"
    ).textContent =
        subtitle;

}


/* =====================================================
   DASHBOARD PAGE
===================================================== */

function dashboardPage() {

    return `

    <section class="pit-status card">

        <div class="pit-information">

            <div class="pit-icon">
                <i class="fa-solid fa-leaf"></i>
            </div>

            <div>

                <h2>Earth Pit EP-01</h2>

                <p>Lab Setup (MVP)</p>

                <small>Node ID: N-01</small>

            </div>

        </div>


        <div class="overall-status">

            <div class="section-label">
                Overall Status
            </div>

            <div class="status-pill normal">

                <span class="status-dot"></span>

                NORMAL

            </div>

            <p>
                All monitored parameters
                are within configured limits.
            </p>

        </div>


        ${systemItem(
            "microchip",
            "Device",
            "ESP32",
            "Online"
        )}


        ${systemItem(
            "wifi",
            "Sensors",
            "3 / 3",
            "Connected"
        )}


        ${systemItem(
            "wifi",
            "Wi-Fi",
            "Connected",
            "Connected"
        )}


        ${systemItem(
            "cloud",
            "AWS IoT",
            "Connected",
            "Connected"
        )}


        <div class="last-updated">

            <i class="fa-regular fa-clock"></i>

            <div>

                <span>Last Updated</span>

                <strong>
                    Live
                </strong>

                <label>
                    <i class="fa-solid fa-circle"></i>
                    Live Data
                </label>

            </div>

        </div>

    </section>


    <section class="sensor-grid">

        ${sensorCard(
            "yellow",
            "bolt",
            "Leakage Current",
            "0.50",
            "mA",
            "Within expected range"
        )}


        ${sensorCard(
            "blue",
            "droplet",
            "Soil Moisture",
            "32",
            "%",
            "Adequate moisture level"
        )}


        ${sensorCard(
            "red",
            "temperature-three-quarters",
            "Soil Temperature",
            "28",
            "°C",
            "Within expected range"
        )}

    </section>


    <section class="charts-grid">

        ${chartCard(
            "leakageChart",
            "bolt",
            "yellow-text",
            "Leakage Current Trend"
        )}

        ${chartCard(
            "moistureChart",
            "droplet",
            "blue-text",
            "Soil Moisture Trend"
        )}

        ${chartCard(
            "temperatureChart",
            "temperature-three-quarters",
            "red-text",
            "Soil Temperature Trend"
        )}

    </section>


    <section class="bottom-grid">

        <div class="bottom-card">

            <div class="bottom-title">

                <i class="fa-solid fa-gear"></i>

                <h3>
                    System & Data Status
                </h3>

            </div>


            <div class="status-list">

                <div>
                    <span>
                        ESP32 Device
                    </span>

                    <strong class="online">
                        ● Online
                    </strong>
                </div>

                <div>
                    <span>
                        AWS IoT (MQTT)
                    </span>

                    <strong class="online">
                        ● Connected
                    </strong>
                </div>

                <div>
                    <span>
                        Sensors (3/3)
                    </span>

                    <strong class="online">
                        ● Connected
                    </strong>
                </div>

                <div>
                    <span>
                        Last Data Packet
                    </span>

                    <strong>
                        Live
                    </strong>
                </div>

                <div>
                    <span>
                        Wi-Fi
                    </span>

                    <strong class="online">
                        ● Connected
                    </strong>
                </div>

                <div>
                    <span>
                        Data Logging
                    </span>

                    <strong class="online">
                        ● Active
                    </strong>
                </div>

            </div>

        </div>


        <div class="bottom-card">

            <div class="bottom-title">

                <i class="fa-solid fa-bell"></i>

                <h3>
                    Active Alerts
                    <span>(0)</span>
                </h3>

            </div>


            <div class="no-alerts">

                <div class="success-circle">

                    <i class="fa-solid fa-check"></i>

                </div>

                <strong>
                    No active alerts
                </strong>

                <p>
                    All parameters are within
                    configured limits.
                </p>

            </div>

        </div>


        <div class="bottom-card">

            <div class="bottom-title">

                <i class="fa-solid fa-wrench"></i>

                <h3>
                    Engineer Actions
                </h3>

            </div>


            <div class="action-buttons">

                <button onclick="refreshData()">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    Refresh Data
                </button>

                <button onclick="showPage('trends')">
                    <i class="fa-solid fa-chart-column"></i>
                    View History
                </button>

                <button onclick="downloadCSV()">
                    <i class="fa-solid fa-download"></i>
                    Export Data
                </button>

                <button onclick="showPage('alerts')">
                    <i class="fa-solid fa-bell"></i>
                    View Alerts
                </button>

            </div>

        </div>

    </section>

    `;

}


/* =====================================================
   HELPER - SYSTEM ITEM
===================================================== */

function systemItem(
    icon,
    title,
    value,
    status
) {

    return `

    <div class="system-item">

        <div class="system-icon">

            <i class="fa-solid fa-${icon}"></i>

        </div>

        <div>

            <span>${title}</span>

            <strong>${value}</strong>

            <small class="connected">

                <span></span>

                ${status}

            </small>

        </div>

    </div>

    `;

}


/* =====================================================
   HELPER - SENSOR CARD
===================================================== */

function sensorCard(
    color,
    icon,
    name,
    value,
    unit,
    description
) {

    return `

    <div class="sensor-card">

        <div class="sensor-heading">

            <div class="sensor-name">

                <div class="sensor-icon ${color}">

                    <i class="fa-solid fa-${icon}"></i>

                </div>

                <h3>${name}</h3>

                <i class="fa-solid fa-circle-info info"></i>

            </div>

        </div>


        <div class="sensor-main">

            <div class="sensor-value">

                <strong>${value}</strong>

                <span>${unit}</span>

            </div>


            <div class="status-badge normal">

                Normal

            </div>


            <p>
                ${description}
            </p>


            <div class="update-time">

                <i class="fa-regular fa-clock"></i>

                Live data

            </div>

        </div>

    </div>

    `;

}


/* =====================================================
   HELPER - CHART CARD
===================================================== */

function chartCard(
    id,
    icon,
    color,
    title
) {

    return `

    <div class="chart-card">

        <div class="chart-header">

            <div>

                <h3>

                    <i class="fa-solid fa-${icon} ${color}"></i>

                    ${title}

                </h3>

                <span>
                    (Last 24 Hours)
                </span>

            </div>


            <select>

                <option>
                    Last 24 Hours
                </option>

                <option>
                    Last 7 Days
                </option>

                <option>
                    Last 30 Days
                </option>

            </select>

        </div>


        <div class="chart-container">

            <canvas id="${id}"></canvas>

        </div>

    </div>

    `;

}


/* =====================================================
   LIVE DATA PAGE
===================================================== */

function liveDataPage() {

    return `

    <div class="page-container">

        <div class="page-heading">

            <h2>
                Live Sensor Data
            </h2>

            <p>
                Real-time readings received from Earth Pit EP-01
            </p>

        </div>


        <div class="live-grid">

            ${liveCard(
                "bolt",
                "Leakage Current",
                "0.50",
                "mA"
            )}

            ${liveCard(
                "droplet",
                "Soil Moisture",
                "32",
                "%"
            )}

            ${liveCard(
                "temperature-three-quarters",
                "Soil Temperature",
                "28",
                "°C"
            )}

            ${liveCard(
                "plug",
                "ESP32 Device",
                "ONLINE",
                ""
            )}

            ${liveCard(
                "wifi",
                "Wi-Fi",
                "CONNECTED",
                ""
            )}

            ${liveCard(
                "cloud",
                "AWS IoT",
                "CONNECTED",
                ""
            )}

        </div>

    </div>

    `;

}


function liveCard(
    icon,
    title,
    value,
    unit
) {

    return `

    <div class="live-card">

        <h3>

            <i class="fa-solid fa-${icon}"></i>

            ${title}

        </h3>


        <div class="live-value">

            ${value}

            <span class="live-unit">
                ${unit}
            </span>

        </div>


        <div class="data-status">

            <i class="fa-solid fa-circle"></i>

            Live / Connected

        </div>

    </div>

    `;

}


/* =====================================================
   TRENDS PAGE
===================================================== */

function trendsPage() {

    return `

    <div class="page-container">

        <div class="page-heading">

            <h2>
                Historical Trends
            </h2>

            <p>
                Monitor how each parameter changes over time.
            </p>

        </div>


        <div class="trend-page-grid">

            <div class="large-chart-card">

                <h3>
                    Leakage Current
                </h3>

                <div class="large-chart">

                    <canvas id="trendLeakage"></canvas>

                </div>

            </div>


            <div class="large-chart-card">

                <h3>
                    Soil Moisture
                </h3>

                <div class="large-chart">

                    <canvas id="trendMoisture"></canvas>

                </div>

            </div>


            <div class="large-chart-card">

                <h3>
                    Soil Temperature
                </h3>

                <div class="large-chart">

                    <canvas id="trendTemperature"></canvas>

                </div>

            </div>


            <div class="large-chart-card">

                <h3>
                    Predictive Trend
                </h3>

                <div class="large-chart">

                    <canvas id="predictionChart"></canvas>

                </div>

            </div>

        </div>

    </div>

    `;

}


/* =====================================================
   ALERTS PAGE
===================================================== */

function alertsPage() {

    return `

    <div class="page-container">

        <div class="page-heading">

            <h2>
                Alerts & Notifications
            </h2>

            <p>
                Abnormal conditions detected by the monitoring system.
            </p>

        </div>


        <div class="alert-page-card">

            <div class="alert-item">

                <div class="alert-icon warning">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                </div>

                <div class="alert-item-content">

                    <strong>
                        Leakage Current Monitoring
                    </strong>

                    <span>
                        Monitoring is active. Current value:
                        0.50 mA
                    </span>

                </div>

                <span class="mini-status normal">
                    Normal
                </span>

            </div>


            <div class="alert-item">

                <div class="alert-icon warning">

                    <i class="fa-solid fa-droplet"></i>

                </div>

                <div class="alert-item-content">

                    <strong>
                        Soil Moisture
                    </strong>

                    <span>
                        Current moisture level:
                        32%
                    </span>

                </div>

                <span class="mini-status normal">
                    Normal
                </span>

            </div>


            <div class="alert-item">

                <div class="alert-icon warning">

                    <i class="fa-solid fa-temperature-half"></i>

                </div>

                <div class="alert-item-content">

                    <strong>
                        Soil Temperature
                    </strong>

                    <span>
                        Current temperature:
                        28°C
                    </span>

                </div>

                <span class="mini-status normal">
                    Normal
                </span>

            </div>


            <div class="alert-item">

                <div class="alert-icon warning">

                    <i class="fa-solid fa-wifi"></i>

                </div>

                <div class="alert-item-content">

                    <strong>
                        Connectivity
                    </strong>

                    <span>
                        ESP32, Wi-Fi and AWS IoT are connected.
                    </span>

                </div>

                <span class="mini-status normal">
                    Normal
                </span>

            </div>

        </div>

    </div>

    `;

}


/* =====================================================
   REPORTS PAGE
===================================================== */

function reportsPage() {

    return `

    <div class="page-container">

        <div class="page-heading">

            <h2>
                EarthSense Reports
            </h2>

            <p>
                Monitoring and predictive analysis reports.
            </p>

        </div>


        <div class="alert-page-card">

            <table class="report-table">

                <thead>

                    <tr>

                        <th>
                            Report
                        </th>

                        <th>
                            Earth Pit
                        </th>

                        <th>
                            Period
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td>
                            Sensor Monitoring Report
                        </td>

                        <td>
                            EP-01
                        </td>

                        <td>
                            Last 24 Hours
                        </td>

                        <td>
                            <span class="mini-status normal">
                                Available
                            </span>
                        </td>

                        <td>
                            <button
                                class="download-button"
                                onclick="downloadCSV()">
                                Export
                            </button>
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Parameter Trend Report
                        </td>

                        <td>
                            EP-01
                        </td>

                        <td>
                            Last 7 Days
                        </td>

                        <td>
                            <span class="mini-status normal">
                                Available
                            </span>
                        </td>

                        <td>
                            <button
                                class="download-button"
                                onclick="downloadCSV()">
                                Export
                            </button>
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Predictive Maintenance Report
                        </td>

                        <td>
                            EP-01
                        </td>

                        <td>
                            Current
                        </td>

                        <td>
                            <span class="mini-status normal">
                                Available
                            </span>
                        </td>

                        <td>
                            <button
                                class="download-button"
                                onclick="downloadCSV()">
                                Export
                            </button>
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

    `;

}


/* =====================================================
   SETTINGS PAGE
===================================================== */

function settingsPage() {

    return `

    <div class="page-container">

        <div class="page-heading">

            <h2>
                System Settings
            </h2>

            <p>
                Configure monitoring and dashboard preferences.
            </p>

        </div>


        <div class="settings-grid">


            <div class="settings-card">

                <h3>
                    Monitoring Configuration
                </h3>


                <div class="setting-row">

                    <span>
                        Earth Pit
                    </span>

                    <strong>
                        EP-01
                    </strong>

                </div>


                <div class="setting-row">

                    <span>
                        Data Sampling
                    </span>

                    <select>

                        <option>
                            1 Minute
                        </option>

                        <option>
                            5 Minutes
                        </option>

                        <option>
                            10 Minutes
                        </option>

                    </select>

                </div>


                <div class="setting-row">

                    <span>
                        Connectivity
                    </span>

                    <strong class="online">
                        Wi-Fi
                    </strong>

                </div>


                <div class="setting-row">

                    <span>
                        Cloud Platform
                    </span>

                    <strong>
                        AWS IoT
                    </strong>

                </div>

            </div>



            <div class="settings-card">

                <h3>
                    Alert Thresholds
                </h3>


                <div class="setting-row">

                    <span>
                        Leakage Current
                    </span>

                    <input
                        type="number"
                        value="1.20"
                    >

                </div>


                <div class="setting-row">

                    <span>
                        Soil Moisture
                    </span>

                    <input
                        type="number"
                        value="30"
                    >

                </div>


                <div class="setting-row">

                    <span>
                        Soil Temperature
                    </span>

                    <input
                        type="number"
                        value="40"
                    >

                </div>


                <div class="setting-row">

                    <span>
                        Alert Notification
                    </span>

                    <select>

                        <option>
                            Enabled
                        </option>

                        <option>
                            Disabled
                        </option>

                    </select>

                </div>

            </div>


        </div>

    </div>

    `;

}


/* =====================================================
   DASHBOARD CHARTS
===================================================== */

function createDashboardCharts() {

    const labels = [
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "00:00",
        "02:00",
        "04:00",
        "06:00"
    ];


    const leakage = [
        0.46, 0.47, 0.48,
        0.49, 0.50, 0.51,
        0.50, 0.51, 0.52,
        0.51, 0.52, 0.50
    ];


    const moisture = [
        34, 35, 34,
        33, 34, 33,
        32, 32, 31,
        32, 31, 32
    ];


    const temperature = [
        24, 25, 26,
        28, 30, 29,
        27, 25, 24,
        25, 27, 28
    ];


    createLineChart(
        "leakageChart",
        labels,
        leakage,
        "#f1aa00"
    );


    createLineChart(
        "moistureChart",
        labels,
        moisture,
        "#159c55"
    );


    createLineChart(
        "temperatureChart",
        labels,
        temperature,
        "#e53935"
    );

}


/* =====================================================
   TREND CHARTS
===================================================== */

function createTrendCharts() {

    const labels = [
        "Day 1",
        "Day 5",
        "Day 10",
        "Day 15",
        "Day 20",
        "Day 25",
        "Day 30"
    ];


    createLineChart(
        "trendLeakage",
        labels,
        [0.35, 0.38, 0.41, 0.43, 0.46, 0.48, 0.50],
        "#f1aa00"
    );


    createLineChart(
        "trendMoisture",
        labels,
        [38, 37, 36, 35, 34, 33, 32],
        "#159c55"
    );


    createLineChart(
        "trendTemperature",
        labels,
        [25, 25.5, 26, 27, 27, 28, 28],
        "#e53935"
    );


    createLineChart(
        "predictionChart",
        labels,
        [0.40, 0.42, 0.45, 0.48, 0.51, 0.54, 0.57],
        "#087ec9"
    );

}


/* =====================================================
   GENERIC LINE CHART
===================================================== */

function createLineChart(
    canvasId,
    labels,
    data,
    color
) {

    const canvas =
        document.getElementById(canvasId);


    if (!canvas) return;


    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        data: data,

                        borderColor: color,

                        backgroundColor:
                            color + "18",

                        fill: true,

                        borderWidth: 2,

                        pointRadius: 3,

                        tension: 0.35

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    x: {

                        grid: {
                            color: "#edf1f5"
                        }

                    },

                    y: {

                        grid: {
                            color: "#edf1f5"
                        }

                    }

                }

            }

        }
    );

}


/* =====================================================
   REFRESH DATA
===================================================== */

function refreshData() {

    alert(
        "EarthSense data refreshed successfully."
    );

}


/* =====================================================
   EXPORT CSV
===================================================== */

function downloadCSV() {

    const csv =

`Earth Pit,Parameter,Value,Unit,Status
EP-01,Leakage Current,0.50,mA,Normal
EP-01,Soil Moisture,32,%,Normal
EP-01,Soil Temperature,28,°C,Normal`;


    const blob =
        new Blob(
            [csv],
            { type: "text/csv" }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "EarthSense_Report.csv";


    link.click();


    URL.revokeObjectURL(url);

}