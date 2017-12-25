window.ModalList = [];
var modalProgressBar = '<p class="progressMessage">File uploading in progress...</p>' +
    '<div class="progress">'
    + '<div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
    + '  <span class="sr-only"></span>'
    + ' </div>'
    + ' </div>';

function showLoader(etat) {
    window.loaderCount = window.loaderCount || 0;
    window.loaderCount += etat ? 1 : -1;
    if (window.loaderCount < 0) {
        window.loaderCount = 0;
    }
    $('#page-loader').toggle(window.loaderCount > 0);
}

function initPopover() {
	if ($('[data-toggle="popover"]').length) {
		$('[data-toggle="popover"]').popover({trigger: "focus"});
	}
}

$(document).ready(function () {
    // select2
    if ($.fn.select2) {
        $('select:not(.per-page)')
            .not('#formimport select')
            .not('.selectbatch')
            .select2({width: '80%'});
    }
	initPopover();
	$(document).ajaxComplete(function () {
		initPopover();
	});
    $(".importhist").click(function () {
        $(".sidebar-right").toggle();
        if ($(".sidebar-right").hasClass('hidesidebar')) {
            $('#crosscontainer').removeClass('col-md-12').addClass('col-md-9');
            $(".sidebar-right").removeClass('hidesidebar');

        } else {
            $(".sidebar-right").addClass('hidesidebar');
            $('#crosscontainer').removeClass('col-md-9').addClass('col-md-12');
        }
    });
    $(".sidebar li a").mouseover(function (event) {
        var message = $(event.currentTarget).attr('data-message');
        var title = $(event.currentTarget).html();
        $(".infopop").html('<div class="helptitle">' + title + '</div>' + message).show();
    }).mouseout(function () {
        $(".infopop").hide();
    });
    $("button ").mouseover(function () {
        $(".statusbar p").show();
    }).mouseout(function () {
        $(".statusbar p").hide();
    });
    $("input[type='radio']").click(function () {
        // If the button is selected.
        if ($(this).hasClass("checked")) {
            // Remove the placeholder.
            $(this).removeClass("checked");
            // And remove the selection.
            $(this).removeAttr("checked");
            // If the button is not selected.
        } else {
            // Remove the placeholder from the other buttons.
            $("input[type='radio']").each(function () {
                $(this).removeClass("checked");
            });
            // And add the placeholder to the button.
            $(this).addClass("checked");
        }
    });
});

function successDialog(title, message, type, onshown, onclose) {
    BootstrapDialog.show({
        type: typeof(type) === "undefined" ? BootstrapDialog.TYPE_SUCCESS : type,
        title: title,
        message: message,
        buttons: [{
            label: Translator.trans("Close", {}, 'javascript'),
            cssClass: 'btn-up',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }],
        onhide: function () {
            window.bootstrapdialoghide = true;
            if (typeof(onclose) === "function") {
                onclose();
            }
        },
        onshown: onshown
    });
}

function errorDialog(title, message, transParams) {
    successDialog(title, message, BootstrapDialog.TYPE_DANGER, undefined, undefined, transParams);
}

function warningDialog(title, message, transParams) {
    successDialog(title, message, BootstrapDialog.TYPE_WARNING, undefined, undefined, transParams);
}
function resizeContent() {

    return $(window).height() - 180 ;
}
function getRequest(url, _data, success_function, params, extraParams) {
    params = params || {};
    var showloader = typeof(params.showloader) != "undefined" ? params.showloader : true;
    if (showloader) {
        showLoader(true);
    }
    var parameters = {
        async: true,
        url: url,
        type: params.type || "POST",
        data: _data,
        success: function (data) {
            if (data === "is_not_logged") {
                successDialog("Nyellow", Translator.trans("Session expired", {}, 'javascript')+"! "+Translator.trans("Please login again", {}, 'javascript')+".", BootstrapDialog.TYPE_WARNING, undefined, function () {
                    window.location.href = "login";
                });
            } else {
                if (typeof (success_function) == "function") {
                    success_function(data);
                }
            }
        },
        error: function (xhr) {
            errorDialog(Translator.trans("Error contacting server", {}, 'javascript'), Translator.trans("Error encountered", {}, 'javascript')+' : ' + xhr.responseText);
        },
        complete: function () {
            if (showloader) {
                showLoader(false);
            }
        }
    };
    if (typeof(extraParams) == "object") {
        $.extend(parameters, extraParams);
    }
    $.ajax(parameters);
}

function generateForm(url, data, method) {
    if (method == null) method = 'POST';
    if (data == null) data = {};
    var form = $('<form>').attr({
        method: method,
        action: url
    }).css({
        display: 'none'
    });
    var addData = function (name, data) {
        if ($.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                addData(name + '[]', value);
            }
        } else if (typeof data === 'object') {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    addData(name + '[' + key + ']', data[key]);
                }
            }
        } else if (data != null) {
            form.append($('<input>').attr({
                type: 'hidden',
                name: String(name),
                value: String(data)
            }));
        }
    };
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            addData(key, data[key]);
        }
    }
    form.appendTo('body');
    form.submit();
}

function baseName(str) {
    return str.substring(str.lastIndexOf('/') + 1);
}

function confirmDialog(message, callback, transParams) {
    BootstrapDialog.show({
        title: "Confirmation",
        message: message,
        buttons: [{
            label: 'Yes',
            cssClass: 'btn-up',
            autospin: true,
            action: function (dialogRef) {
                callback();
                dialogRef.close();
            }
        }, {
            label: 'No',
            cssClass: 'btn-danger',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }]
    });
}
function promptDialog(message, callback) {
    BootstrapDialog.show({
        title: message,
        message: function (dialogItself) {
            var $titleDrop = $('<input class="form-control" placeholder="Name" type="text" />');
            dialogItself.setData('field-title-drop', $titleDrop);
            return $titleDrop;
        },
        buttons: [{
            label: Translator.trans('OK') ,
            cssClass: 'btn-up',
            hotkey: 13,
            action: function (dialogItself) {
                callback(dialogItself);
            }
        }]
    });
}
function setWysiwyg(id, height) {
    var $textarea = $(id);
    $textarea.summernote({
        width: '500',
        disableDragAndDrop: true,
        shortcuts: false,
        toolbar: [
            [ 'style', [ 'style' ] ],
            [ 'font', [ 'bold', 'italic', 'underline', 'clear'] ],
            [ 'fontname', [ 'fontname' ] ],
            [ 'fontsize', [ 'fontsize' ] ],
            [ 'color', [ 'color' ] ],
            [ 'para', [ 'ol', 'ul', 'paragraph' ] ],
            [ 'table', [ 'table' ] ],
            [ 'insert', [ 'link'] ],
            [ 'view', [ 'undo', 'redo', 'fullscreen'] ]
        ],
        onChange: function (contents, $editable) {
            var $textarea = $(this);
            $textarea.val(contents);
        },
        onPaste: function (e) {
            var thisNote = $(this);
            var updatePastedText = function (someNote) {
                var original = someNote.code();
                var cleaned = cleanHTML(original); //this is where to call whatever clean function you want. I have mine in a different file, called CleanPastedHTML.
                someNote.html(cleaned); //this sets the displayed content editor to the cleaned pasted code.
                someNote.trigger("change");
            };
            setTimeout(function () {
                //this kinda sucks, but if you don't do a setTimeout,
                //the function is called before the text is really pasted.
                updatePastedText(thisNote);
            }, 10);
        },
        height: height || 200
    }).on("summernote.change", function (e1,e2) {
        var $textarea = $(e1.currentTarget);
        var $wisiwig = $(e2.currentTarget);
        $textarea.html($wisiwig.html());
        $textarea.trigger('change');

    });
}

function progressBar(value) {
    if(value == 0){

        var $newmodal = $('#modalDialog').clone().removeAttr("id");
        $newmodal.attr("id", "progressModal");
        $newmodal.appendTo("body");
        $('.modal-title', $newmodal).html( "Progress" );
       // $('.modal-footer', $newmodal).html('<button type="button" class="btn pull-right btn-up-close marginleft" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i> Close</button>');
        $('.modal-body', $newmodal).html(modalProgressBar);
        //if(window.page == "listImportType") {
            $('.close',$newmodal).remove();
            $newmodal.modal({
                backdrop: 'static',
                keyboard: false
            });
        /*}else{
            $newmodal.modal("show");
        }*/
        $newmodal.on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }
    $('.progress-bar').attr('aria-valuenow',value);
    $('.progress-bar').attr('style',"width: "+value+"%");

    if (value == 100) {
        $('.progress-bar').addClass('active');

    }
}

function ajaxModal(url ,data, title, footer, shown_callback,  width, id) {
    var $newmodal = $('#modalDialog');
    if (id) {
        window.ModalList.push(id);
        $newmodal = $('#modalDialog').clone().removeAttr("id");
        $newmodal.attr("id", id);
        $newmodal.appendTo("body");
    }else{
        window.ModalList.push("modalDialog");
    }
    getRequest(url, data, function(result) {
        $('.modal-title', $newmodal).html( title );
        $('.modal-body', $newmodal).html(result);
        $('.modal-footer', $newmodal).html('<button type="button" class="btn pull-right btn-up-close marginleft" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i> Close</button>');
        $('.modal-footer', $newmodal).append(footer);
        $('.modal-dialog', $newmodal).width(width || 1000);
        $newmodal.modal('show')/*.draggable()*/;
        if($('.sonata-ba-list-field-select', $newmodal).length) {
            $('.sonata-ba-list-field-select', $newmodal).remove();
        }
        $newmodal.on('hidden.bs.modal', function() {
            if (id) {
                removeElementFromModalList($(this).attr('id'))
                //window.ModalList.remove();
                $(this).remove();
            }
        });
        /*$newmodal.on('loaded.bs.modal', function () {
            shown_callback();
        });*/
        if (shown_callback) {
            shown_callback();
        }
    });

}

function array_values (input) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_values/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
    //   returns 1: [ 'Kevin', 'van Zonneveld' ]
    var tmpArr = []
    var key = ''
    for (key in input) {
        tmpArr[tmpArr.length] = input[key]
    }
    return tmpArr
}
function removeElementFromModalList(str) {
    $.each(window.ModalList,function (index,element) {
        if(element == str){
            delete window.ModalList[index];
            return false;
        }
    });
    array_values(window.ModalList)
}
function setAppData(key, val) {
    localStorage.setItem(key, typeof (val) == 'object' ? JSON.stringify(val) : val);
}

function getAppData(key, defaultValue, subkey) {
    var data = localStorage.getItem(key);
    if ((data != null) && (data.length != 0) && ((data[0] == "{") || (data[0] == "["))) {
        data = JSON.parse(data);
        if (typeof (subkey) != "undefined") {
            data = data[subkey];
        }
    }
    if ((data == null) && ( typeof (defaultValue) != 'undefined')) {
        return defaultValue;
    } else {
        return data;
    }
}

function notify(type, message) {
    $.notify(message, type);
    /*$.notify(message, {
        type: type,
        z_index: 50000,
        delay: 0,
        placement: {from: "top", align: "right"},
        animate: {exit: null}
    });*/
}
function delete_action(event, callback) {

    var url = $(event.currentTarget).attr('href');
    var button = '<button type="button" class="btn pull-right btn-danger marginleft"  id="delete_data"><i class="fa fa-trash" aria-hidden="true"></i> ' + Translator.trans("btn_delete", {}, 'SonataAdminBundle') + '</button>';
    ajaxModal(url, {}, Translator.trans("title_delete", {}, 'SonataAdminBundle')
        , button
        , function () {
            delete_data(callback);
        }, 1000, 'delete_tuple');
}
function delete_data(callback) {
    $('#delete_data').on('click', function (event) {
        $('#delete_tuple .modal-body form').submit();
    });
    $('#delete_tuple .modal-body form').on('submit', function (event) {
        var $form = $(this);
        var data = $form.serializeArray();
        getRequest($form.attr('action'), data, function (result) {
            notify("success", 'Data was deleted');
            $('.modal').modal('hide');
            if (typeof callback == "function") {
                callback();
            }
        });
        return false;
    });
}
function mailingListAction(id) {
    id = id || importType.id;
    var footer = '<button id="saveFormModal" type="button" class="btn pull-right btn-up-green marginleft"><i class="fa fa-floppy-o" aria-hidden="true"></i> Save</button>';
    ajaxModal(Routing.generate('admin_nyellow_importtype_edit', {id: id}),
        {},
        "Mailing List",
        footer,
        function () {
            if($('#mailinglistPopup .sonata-ba-form-actions').length){
                $('#mailinglistPopup .sonata-ba-form-actions').remove();
            }
            $('select[id$=_mailingList]').multiSelect();
            saveFormModal('#mailinglistPopup', id);
            $("#mailinglistPopup").on('click', '#addMailOption', function(event) {
                var new_mail = $('#new_mail').val() ;
                if(new_mail != ""){
                    var exists = false;
                    $('select[id$=_mailingList] option').each(function(){
                        if (this.value == new_mail) {
                            exists = true;
                            return false;
                        }
                    });
                    var $select = $('select[id$=_mailingList]')
                    if(!exists){
                        $select.append('<option value="' + new_mail + '" selected>' + new_mail + '</option>') ;
                        $select.multiSelect('refresh') ;
                        notify("success", 'The email address is added successfully');
                    }else{
                        notify("danger", 'Mail already exists');
                    }
                }else{
                    notify("danger", 'You must enter a mail');
                }
            });

        }
        ,580,"mailinglistPopup");
}

function submitModalForm(form,id,params, importTypeId) {
    params = params || {};
    importTypeId = importTypeId || importType.id;
    var data = form.serializeArray();
    data.push({name: "importTypeId", value: importTypeId});

    getRequest(form.attr('action'), data, function (result) {
        if(result.result == "ok"){
            if(typeof (params.showloader) == "undefined") {
                if(typeof id != "undefined") {
                    if(id.indexOf('#') == 0){
                        hideModal(id);
                    }else {
                        hideModal("#" + id);
                    }
                }
                notify("success", 'Data successfully saved')
            }
        }
    },params);
}

function hideModal(id) {
    $(id).modal('hide');
    window.ModalList = array_values(window.ModalList);
    if(window.ModalList.length ){
        var idModal = window.ModalList[0];
        $('#'+idModal).modal('hide');
        if(window.ModalList[0] == "columun_configuration") {
            $('#costum_configuration').trigger('click');
        }else if (window.ModalList[0] == "indexes"){
            $('#index_configuration').trigger('click');
        }
    }
}

function getLastModalId() {
    if((window.ModalList.length)) {
        return window.ModalList[(window.ModalList.length) - 1];
    }
    return null;
}

function updateFieldOrValue(selectTypeField) {
    var tds = $(selectTypeField).closest('tr').find('td');
    if($(selectTypeField).val() == 1){
        tds.eq(5).hide();
        tds.eq(4).show();
    }else{
        tds.eq(4).hide();
        tds.eq(5).show();
    }
}

function btn_delete() {
    $('.delete_index').off().on('click', function (e) {
        e.preventDefault();
        $(e.currentTarget).closest('tr').remove();
        return false;
    });
}


function addErrorClass(name, form, type) {
    var input = selectField(name, form);
    if (type) {
        if ($(input).closest('.form-group').length) {
            $(input).closest('.form-group').addClass("has-error");
            $(input).closest('.form-group').addClass("has-danger");
        } else {
            $(input).closest('.row').addClass("has-error");
            $(input).closest('.row').addClass("has-danger");
        }
    } else {
        if ($(input).closest('.form-group').length) {
            $(input).closest('.form-group').removeClass("has-error");
            $(input).closest('.form-group').removeClass("has-danger");
        } else {
            $(input).closest('.row').removeClass("has-error");
            $(input).closest('.row').removeClass("has-danger");
        }
    }
}

function removeSelectBt() {
    $('.sonata-ba-list-field-select').remove();
    $('.sonata-ba-list-field-batch').remove();
    $('.sonata-ba-list-field-header-batch').remove();
    $(modalLinkEvent).off().on('click', loadHtmlfromurl);
    $('.link_condition').off().on('click',conditionChecks)
}

function selectField(name, form) {
    var input = null;
    if ($(form).find("input[name='" + name + "']").length)
        input = $(form).find("input[name='" + name + "']");
    else if ($(form).find("select[name='" + name + "']").length)
        input = $(form).find("select[name='" + name + "']");
    else if ($(form).find("textarea[name='" + name + "']").length)
        input = $(form).find("textarea[name='" + name + "']");
    return input;
}

function saveFormModal(id, importTypeId) {
    importTypeId = importTypeId || importType.id;
    $(id+" .modal-footer #saveFormModal, "+id+" button[type=submit]").off().on('click',function (event) {
        $(id+' .modal-body form').submit();
    });
    $(id+" .modal-body form").off().on('submit', function (event) {
        event.preventDefault();
        submitModalForm($(this),id, {}, importTypeId);
        return false;
    });
}

