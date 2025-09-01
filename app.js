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

/** Form to create a new puppy */
function CreatePuppyForm(){
    const form = document.createElement("form");
    form.innerHTML = `
    <h3>Add a New Puppy</h3>
    <label>Name: <input type="text" name="name" required> </label>
    <label>Breed: <input type="text" name="breed" required> </label>
    <button type="submit">Add Puppy</button>
    `;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newPuppy = {
            name: form.Data.get("name"),
            breed: formData.get("breed"),
        };
        await createPuppy(newPuppy);
        form.reset();
    });

    return form;
}

/** Puppy List Item */
function PuppyListItem(puppy) {
    const li = document.createElement("li");
    if (puppy.id === selectedPuppy?.id) li.classList.add("selected");

    li.innerHTML = `
        <img src="${puppy.imageUrl}" alt="${puppy.name}" width="100%">
        <p>${puppy.name}</p>
    `;

    li.addEventListener("click"), () => getPuppy(puppy.id));

    return li;
}