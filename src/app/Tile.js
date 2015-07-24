export default class Tile {
    constructor(id, value, row, column) {
      this.value = value || '';
      this.row = row || -1;
      this.column = column || -1;
      this.id = id;
    }
}
