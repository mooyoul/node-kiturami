
class KituramiCommand {
  static forge(...args) {
    return new this(...args);
  }

  toString() {
    return `${this.id}${this.value}`;
  }

  toBuffer() {
    return new Buffer(this.toString(), 'utf8');
  }

  toJSON() {
    return {
      name: this.displayName,
      id: this.id,
      value: this.value
    };
  }
}

module.exports = exports = KituramiCommand;
