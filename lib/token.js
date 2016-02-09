function make() {
    return Math.random().toString(36).substr(2);
}

module.exports = {
    make: make
};
