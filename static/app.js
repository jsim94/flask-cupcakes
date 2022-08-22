const $CUPCAKE_LIST = $("#cupcake-list");
const $CUPCAKE_FORM = $("#cupcake-form");
const $TXT_FLAVOR = $("#flavor");
const $TXT_SIZE = $("#size");
const $TXT_RATING = $("#rating");
const $TXT_IMAGE = $("#image");
const API_URL = "http://localhost:5000/api";

class CupcakeList {
  constructor(cupcakeList) {
    this.refreshCupcakeList(cupcakeList);
    this.displayCupcakes();

    $CUPCAKE_FORM.on("submit", this.addCupcake.bind(this));
    $CUPCAKE_LIST.on("click", ".btn-edit", this.updateCupcake.bind(this));
    $CUPCAKE_LIST.on("click", ".btn-delete", this.deleteCupcake.bind(this));
  }

  static async _init() {
    const cupcakes = await CupcakeList.getCupcakeList();
    const cupcakeApp = new CupcakeList(cupcakes);
    return cupcakeApp;
  }

  static async getCupcakeList() {
    const res = await axios.get(API_URL + "/cupcakes");
    return res.data.cupcakes;
  }

  async refreshCupcakeList(_cupcakeList) {
    this.cupcakeList = [];
    const cupcakeList = _cupcakeList ? _cupcakeList : await CupcakeList.getCupcakeList();

    for (let cupcake of cupcakeList) {
      console.log(cupcake);
      const newCupcake = new Cupcake(cupcake.id, cupcake.flavor, cupcake.size, cupcake.rating, cupcake.image);
      this.cupcakeList.push(newCupcake);
    }
  }

  displayCupcakes() {
    $CUPCAKE_LIST.empty();

    for (let cupcake of this.cupcakeList) {
      console.log("click");
      const $cupcake = this.generateListElement(cupcake);
      $CUPCAKE_LIST.append($cupcake);
    }
  }

  generateListElement(cupcake) {
    return $(`
    <div id="${cupcake.id}" class="cupcake-row row justify-content-start my-3">
      <div class="col-auto">
        <img src="${cupcake.image}" alt="${cupcake.name}" class="preview-image">
      </div>
      <div class="col">
        <h3>${cupcake.flavor}</h3>
        <p>Size: ${cupcake.size}</p>
        <p>Rating: ${cupcake.rating}</p>
        <button class="btn-edit btn btn-primary btn-sm">Edit</button>
        <button class="btn-delete btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
    `);
  }

  async addCupcake(e) {
    e.preventDefault();
    const flavor = $TXT_FLAVOR.val();
    const size = $TXT_SIZE.val();
    const rating = $TXT_RATING.val();
    const image = $TXT_IMAGE.val();

    const newCupcake = await Cupcake.newCupcake(flavor, size, rating, image);

    await this.refreshCupcakeList();
    this.displayCupcakes();
    return newCupcake;
  }

  async updateCupcake(e) {
    // must build ui for updating cupcake
    const cupcakeId = parseInt($(e.target).closest("div.cupcake-row").attr("id"));
    const cupcake = this.cupcakeList.find((val) => val.id === cupcakeId);

    /*

      get update values through form that doesnt exist yet

    */

    //cupcake.update(flavor, size, rating, image);

    await this.refreshCupcakeList();
    this.displayCupcakes();

    console.log("Feature not added");
  }

  async deleteCupcake(e) {
    const cupcakeId = parseInt($(e.target).closest("div.cupcake-row").attr("id"));
    const cupcake = this.cupcakeList.find((val) => val.id === cupcakeId);

    await cupcake.delete();

    await this.refreshCupcakeList();
    this.displayCupcakes();
  }
}

class Cupcake {
  constructor(id, flavor, size, rating, image) {
    this.id = id;
    this.flavor = flavor;
    this.size = size;
    this.rating = rating;
    this.image = image;
  }

  static async newCupcake(flavor, size, rating, image) {
    const data = { flavor, size, rating, image };
    const res = await axios.post(`${API_URL}/cupcakes`, data);
    const json = res.data.cupcake;
    const newCupcake = new Cupcake(json.id, json.flavor, json.size, json.rating, json.image);
    return newCupcake;
  }

  async update(flavor, size, rating, image) {
    const data = { flavor, size, rating, image };
    const res = await axios.patch(`${API_URL}/cupcakes/${this.id}$`, data);
    return res.data.cupcake;
  }

  async delete() {
    const res = await axios.delete(`${API_URL}/cupcakes/${this.id}`);
    return res.data.message;
  }
}

$(document).ready(CupcakeList._init());
