const ISODate = (args) => {
    try {
        const date = new Date(args);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }
        return date.toISOString();
    } catch (error) {
        throw new Error("Error converting date to ISO string: " + error.message);
    }
}

module.exports = ISODate;
