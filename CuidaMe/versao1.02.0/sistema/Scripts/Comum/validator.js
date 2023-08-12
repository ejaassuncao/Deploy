$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest(".form-group").addClass("position-relative");
        $(element).addClass("is-invalid");
    },
    unhighlight: function (element) {
        $(element).closest(".form-group").removeClass("position-relative");
        $(element).removeClass("is-invalid");
    },
    ignore: ":hidden:not(.boolean-validation)",
    errorElement: "div",
    errorClass: "invalid-tooltip",
    errorPlacement: function (error, element) {
        if (element.parent(".input-group").length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});
/*
$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    ignore: ":hidden:not(.boolean-validation)",
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function () {
    }
});
*/