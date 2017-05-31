module.exports = function () {
    this.req.getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                this.req.flash('errors', result.array());
                this.req.flash('form', this.req.body);
                console.log("Hoi");
                this.res.render('createPokemon.hbs',{errors:result.array()})

            }
            else {
                this.callback();
            }

        });
};