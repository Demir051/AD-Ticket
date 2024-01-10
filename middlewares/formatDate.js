function formatDateCustom(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function fullformatDateMiddleware(req, res, next) {
    res.locals.formatDate = formatDateCustom;
    next();
}

module.exports = fullformatDateMiddleware;
