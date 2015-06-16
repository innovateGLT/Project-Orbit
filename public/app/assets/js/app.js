$(document).ready(function() {
    $(".login-btn").click(function() {
        $("#modal-login").modal("show");
        // Ideally show the person from SSL and prepopulate
    });

    function centerModal() {
        $(this).css("display", "block");
        var $dialog = $(this).find(".modal-dialog");
        var offset = ($(window).height() - $dialog.height()) / 4;
        // Center modal vertically in window
        $dialog.css("margin-top", offset);
    }

    $(".modal").on("show.bs.modal", centerModal);
    $(".home").each(function() {
        $(this).click(function() {
            window.location.href = "/";
        });
    });
    $("#editProfile").click(function() {
        window.location.href = "./profileEdit.html";
    });
    $("#editProfileDone").click(function() {
        window.location.href = "./profile.html";
    });




    $(window).on("resize", function() {
        $(".modal:visible").each(centerModal);
    });

    // var index = 2;
    // var TOTAL_IMAGES = 3;
    // window.changeBG = window.setInterval(function(){
    //     // console.log("USER_LOCATION",USER_LOCATION);

    //     if ( (USER_LOCATION != "") && (USER_LOCATION != undefined)) {

    //         var image = $(".container-full");
    //         image.fadeOut(100, function () {
    //             var img  = "/app/assets/img/bg/"+USER_LOCATION+"/"+index+".jpg";
    //             image.css("background", "url('" + img + "')");
    //             image.fadeIn(100);
    //         });
    //         index += 1;

    //         if (index > TOTAL_IMAGES) {
    //             index = 1;
    //         }
    //     }
    // },5000)
});