/**
 * Created by salah on 25/12/2017.
 */
window.files = [];
$(document).ready(function () {
    $('.limitHeight2').on('submit', function () {


        var form = $(this);
        var url = form.attr('action');
        var type = form.attr('method');
        var data = form.serializeArray();
        var html = "";
        $.each(window.files,function (endex,element) {
            html += "#" + element;
        });
        data.push({name:'files',value:window.files});
        getRequest(url, data, function (response) {
            $('#modalconfirm2').modal();
        }, {type: type, _xml_http_request: true, dataType: 'JSON'});
        return false;
    });
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
                var path2 = path
                /*if(path.indexOf('pdf') != -1){
                    path2 = pdfimage;
                }*/
                window.files.push(path);
                html += '<div class="col-lg-4 col-md-4 col-xs-6">' +
                    '<a href="#" class="d-block mb-4 h-100">' +
                    '<img class="img-fluid img-thumbnail" src="' + path2 + '" alt="">' +
                    '</a>' +
                    '</div>';
                html2 += '<div class="col-lg-4 col-md-4 col-xs-6 height300" >' +
                    '<a href="#" class="d-block mb-4 h-100">' +
                    '<img class="img-fluid img-thumbnail" src="' + path2 + '" alt="">' +
                    '</a>' +
                    '</div>';
            });
            $('#listImages .row').append(html);
            $('#listMonth .row').append(html2);
        },
        complete: function (xhr) {
            $('#progressModal').modal('hide');
            //$('#progress-loader').hide();
        }
    });
});