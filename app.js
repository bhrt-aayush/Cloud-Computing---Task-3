import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { Firestore, getFirestore, onSnapshot, query, collection, orderBy, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCILfKj4utXlYe4vZmtXbUZRmTqS5FfFyg",
    authDomain: "cs022-2331942-aayushbhattarai.firebaseapp.com",
    projectId: "cs022-2331942-aayushbhattarai",
    storageBucket: "cs022-2331942-aayushbhattarai.appspot.com",
    messagingSenderId: "825726939171",
    appId: "1:825726939171:web:1e0a347fdb8a8832f64196"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sort table based on selected criteria
const sortTable = (sortBy) => {
    let sortOrder;
    if (sortBy === 'sortMovieName') {
        sortOrder = { field: 'movie_name', direction: 'asc' };
    } else if (sortBy === 'sortDirector') {
        sortOrder = { field: 'director_name', direction: 'asc' };
    } else if (sortBy === 'sortReleaseDate') {
        sortOrder = { field: 'release_date', direction: 'asc' };
    } else if (sortBy === 'sortRating') {
        sortOrder = { field: 'movie_rating', direction: 'desc' };
    }

    // Get sorted data from Firestore based on selected criteria
    const sortedQuery = query(collection(db, "Movies"), orderBy(sortOrder.field, sortOrder.direction));
    onSnapshot(sortedQuery, (snapshot) => {
        // Empty HTML table
        $('#reviewList').empty();

        // Loop through snapshot data and add to HTML table
        snapshot.forEach((doc) => {
            const data = doc.data();
            const editButton = `<button class="editButton" data-id="${doc.id}">Edit</button>`;
            const deleteButton = `<button class="deleteButton" data-id="${doc.id}">Delete</button>`;
            // Convert movie name and director name to uppercase before displaying
            $('#reviewList').append(`<tr><td>${data.movie_name.toUpperCase()}</td><td>${data.director_name.toUpperCase()}</td><td>${data.release_date}</td><td>${data.movie_rating}/5</td><td>${editButton} ${deleteButton}</td></tr>`);
        });
    });
};

// Handle dropdown item click to sort table
$('#sortMovieName').click(() => sortTable('sortMovieName'));
$('#sortDirector').click(() => sortTable('sortDirector'));
$('#sortReleaseDate').click(() => sortTable('sortReleaseDate'));
$('#sortRating').click(() => sortTable('sortRating'));

// Function to add a new review
const addReview = () => {
    const movieName = $("#movieName").val().toUpperCase(); // Convert to uppercase
    const directorName = $("#directorName").val().toUpperCase(); // Convert to uppercase
    const releaseDate = $("#releaseDate").val();
    const movieRating = parseInt($("#movieRating").val());
    if (movieName && directorName && releaseDate && movieRating >= 0 && movieRating <= 5) {
        // Add review to Firestore collection
        addDoc(collection(db, "Movies"), { movie_name: movieName, director_name: directorName, release_date: releaseDate, movie_rating: movieRating });
        // Reset form
        $("#movieName").val('');
        $("#directorName").val('');
        $("#releaseDate").val('');
        $("#movieRating").val('0');
    }
};

// Function to handle editing a review
const editReview = (docId) => {
    const newMovieName = prompt("Enter new movie name:");
    const newDirectorName = prompt("Enter new director's name:");
    const newReleaseDate = prompt("Enter new release date:");
    const newMovieRating = parseInt(prompt("Enter new movie rating (0-5):"));
    if (newMovieName && newDirectorName && newReleaseDate && newMovieRating >= 0 && newMovieRating <= 5) {
        // Update document in Firestore
        updateDoc(doc(db, "Movies", docId), { movie_name: newMovieName, director_name: newDirectorName, release_date: newReleaseDate, movie_rating: newMovieRating });
    }
};

// Function to handle deleting a review
const deleteReview = (docId) => {
    if (confirm("Are you sure you want to delete this review?")) {
        // Delete document from Firestore
        deleteDoc(doc(db, "Movies", docId));
    }
};

// Get a live data snapshot (i.e. auto-refresh) of our Movies collection
const q = query(collection(db, "Movies"), orderBy("movie_name"));
const unsubscribe = onSnapshot(q, (snapshot) => {
    // Empty HTML table
    $('#reviewList').empty();

    // Loop through snapshot data and add to HTML table
    snapshot.forEach((doc) => {
        const data = doc.data();
        const editButton = `<button class="editButton" data-id="${doc.id}">Edit</button>`;
        const deleteButton = `<button class="deleteButton" data-id="${doc.id}">Delete</button>`;
        // Convert movie name and director name to uppercase before displaying
        $('#reviewList').append(`<tr><td>${data.movie_name.toUpperCase()}</td><td>${data.director_name.toUpperCase()}</td><td>${data.release_date}</td><td>${data.movie_rating}/5</td><td>${editButton} ${deleteButton}</td></tr>`);
    });

    // Display review count
    $('#mainTitle').html(snapshot.size + " movie reviews in the list");
});

// Add button pressed
$("#addButton").click(addReview);

// Handle edit button click
$(document).on('click', '.editButton', function() {
    const docId = $(this).data('id');
    editReview(docId);
});

// Handle delete button click
$(document).on('click', '.deleteButton', function() {
    const docId = $(this).data('id');
    deleteReview(docId);
});
