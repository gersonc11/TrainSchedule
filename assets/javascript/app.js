$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB9v-qq_Gret4lE0MxFalZ8Dk9kSnpbuNM",
        authDomain: "trainschedule-59128.firebaseapp.com",
        databaseURL: "https://trainschedule-59128.firebaseio.com",
        projectId: "trainschedule-59128",
        storageBucket: "trainschedule-59128.appspot.com",
        messagingSenderId: "45907649150"
    };
    firebase.initializeApp(config);

    var dataBase = firebase.database();

    // Button for adding trains
    $("#addTrain").on("click", function () {
        event.preventDefault();
        // Grabs user input
        var name = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var first = moment($("#firstTrain").val().trim(), "HH:mm").format("X");
        var frequency = $("#frequencyInput").val().trim();


        dataBase.ref().push({
            name: name,
            destination: destination,
            first: first,
            frequency: frequency
        })




        // Clears all of the text-boxes
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#firstTrain").val("");
        $("#frequencyInput").val("");
    });


    // Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
    dataBase.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        // Calculate the minutes until arrival using math
        // To calculate the minutes till arrival, take the current time in unix subtract the First time and find the modulus between the difference and the frequency  
        var remainingTime = moment().diff(moment.unix(childSnapshot.val().first), "minutes") % childSnapshot.val().frequency;
        var minutes = childSnapshot.val().frequency - remainingTime;

        // To calculate the arrival time, add the minutes to the currrent time
        var tArrival = moment().add(minutes, "m").format("hh:mm A");

        // Add each train's data into the table 
        $("#tableData").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td class='min'>" + childSnapshot.val().frequency + "</td><td class='min'>" + tArrival + "</td><td class='min'>" + minutes + "</td></tr>");

    });


    //auto refresh per 1 minute passed
    //updates the train data upon refresh
    setInterval("window.location.reload()", 60000);

});