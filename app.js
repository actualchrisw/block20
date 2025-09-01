// === CONSTANTS ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2506-ct-web-pt"; 
const API = BASE + COHORT;

// === STATE ===
let puppies = [];
let selectedPuppy = null;

// === API Functions ===

// Fetch all puppies from the API
async function getPuppies() {
  try {
    const response = await fetch(API + "/players"); // make request
    const result = await response.json(); // convert response to JSON
    puppies = result.data.players; // save list of puppies into state
    render(); // render the UI
  } catch (e) {
    console.error(e); // log any errors
  }
}

/** Get single puppy by ID */
async function getPuppy(id) {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPuppy = result.data.player;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Create a new puppy */
async function createPuppy(puppyData) {
  try {
    const response = await fetch(API + "/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(puppyData),
    });
    if (!response.ok) throw new Error("Failed to create puppy");
    await getPuppies();
  } catch (e) {
    console.error(e);
  }
}

/** Delete the selected puppy */
async function deletePuppy(id) {
  try {
    const response = await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete puppy");
    selectedPuppy = null;
    await getPuppies();
  } catch (e) {
    console.error(e);
  }
}

// === COMPONENTS ===

