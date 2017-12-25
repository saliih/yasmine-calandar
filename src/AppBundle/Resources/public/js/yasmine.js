/**
 * Created by salah on 25/12/2017.
 */

$(document).ready(function () {
    $('#upload-file-selector').on("change",function () {
        $('#uploadForm').submit();
    });
    $('#uploadForm').ajaxForm({
        dataType : "json",
        beforeSend: function() {
            progressBar(0);
            $('#progress-loader').show();
        },
        uploadProgress: function(event, position, total, percentComplete) {
            progressBar(percentComplete);
            if (percentComplete == 100) {
                $('.progressMessage').html('File parsing and importing in progress...');
            }
        },
        success: function(result) {
            progressBar(100);
            if(window.page == "listImportType"){
                var object = {date: ""};
                object.filename = result.file;
                generateForm(Routing.generate('nyellow_report', {id: result.importType.id}), object);
            }else{
                getResults(result);
            }


        },
        complete: function(xhr) {
            $('#progressModal').modal('hide');
            //$('#progress-loader').hide();
        }
    });
});