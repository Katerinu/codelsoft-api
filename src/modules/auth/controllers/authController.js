const authCheck = (req, res) => {
    res.status(200).send("OK Auth Check");
}

module.exports = { authCheck };