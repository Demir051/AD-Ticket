exports.login_get = async (req, res, next) => {
    res.render("auth/login",{
        title: "Login"
    });
}

exports.register_get = async (req, res, next) => {
    res.render("auth/register" ,{
        title: "Register"
    });
}