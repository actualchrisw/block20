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

  li.addEventListener("click", () => getPuppy(puppy.id));

    return li;
}

/** List of all puppies */
function PuppyList(){
    const ul = document.createElement("ul");
    ul.classList.add("puppies");
    const listItems = puppies.map(PuppyListItem);
    ul.replaceChildren(...listItems);
    return ul;
}

/** Details for selected puppy */
function SelectedPuppy() {
    const section = document.createElement("section");

    if (!selectedPuppy) {
        section.textContent = "Please select a puppy to see details.";
        return section;
    }

    section.innerHTML = `
    <h3>${selectedPuppy.name} #${selectedPuppy.id}</h3>
    <img src="${selectedPuppy.imageUrl}" alt="${selectedPuppy.name}" width="200">
    <p><strong>Breed:</strong> ${selectedPuppy.breed}</p>
    <p><strong>Status:</strong> ${selectedPuppy.status}</p>
    <p><strong>Team:</strong> ${selectedPuppy.team?.name || "Unassigned"}</p>
    <button class="delete-btn">Remove from roster</button>
  `;

  section.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to remove this puppy?")) {
      deletePuppy(selectedPuppy.id);
    }
  });

  return section;
}

// === RENDER ===
function render() {
    const app = document.querySelector("#app");

   app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section id="form-section"></section>
      <section>
        <h2>Roster</h2>
        <PuppyList></PuppyList>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <SelectedPuppy></SelectedPuppy>
      </section>
    </main>
  `;

  app.querySelector("#form-section").appendChild(CreatePuppyForm());
  app.querySelector("PuppyList").replaceWith(PuppyList());
  app.querySelector("SelectedPuppy").replaceWith(SelectedPuppy());
}

// === INIT ===
async function init() {
  await getPuppies();
  render();
}

init();