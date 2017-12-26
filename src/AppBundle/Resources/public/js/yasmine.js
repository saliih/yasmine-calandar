/**
 * Created by salah on 25/12/2017.
 */
window.files = [];
$(document).ready(function () {
    $('#upload-file-selector').on("change", function () {
        $('#uploadForm').submit();
    });
    $('#uploadForm').ajaxForm({
        dataType: "json",
        beforeSend: function () {
            progressBar(0);
            $('#progress-loader').show();
        },
        uploadProgress: function (event, position, total, percentComplete) {
            progressBar(percentComplete);
            if (percentComplete == 100) {
                $('.progressMessage').html('File parsing and importing in progress...');
            }
        },
        success: function (result) {
            progressBar(100);
            var html = "";
            var html2 = "";
            $.each(result.files, function (index, path) {
                window.files.push(path);
                html += '<div class="col-lg-4 col-md-4 col-xs-6">' +
                    '<a href="#" class="d-block mb-4 h-100">' +
                    '<img class="img-fluid img-thumbnail" src="' + path + '" alt="">' +
                    '</a>' +
                    '</div>';
                html2 += '<div class="col-lg-4 col-md-4 col-xs-6 height300" >' +
                    '<a href="#" class="d-block mb-4 h-100">' +
                    '<img class="img-fluid img-thumbnail" src="' + path + '" alt="">' +
                    '</a>' +
                    '</div>';
            });
            $('#listImages .row').html(html);
            $('#listMonth .row').html(html2);
        },
        complete: function (xhr) {
            $('#progressModal').modal('hide');
            //$('#progress-loader').hide();
        }
    });
});