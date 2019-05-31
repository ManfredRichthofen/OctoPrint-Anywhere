/*
 * View model for OctoPrint-Anywhere
 *
 * Author: Kenneth Jiang
 * License: AGPLv3
 */

(function () {
'use strict';

function AnywhereViewModel(parameters) {
    var self = this;

    self.regUrl = ko.observable('');
    self.registered = ko.observable(false);
    self.tokenReset = ko.observable(false);
    self.sending = ko.observable(false);

    var apiCommand = function(cmd, callback, errorCallback) {
        $.ajax('/api/plugin/anywhere', {
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify(cmd),
            success: callback,
            error: errorCallback
        });
    };

    var setConfigVars = function(configResp) {
        self.regUrl(configResp.reg_url);
        self.registered(configResp.registered);
        if (configResp.picamera_error) {
            new PNotify({
                title: "OctoPrint Anywhere",
                text: "Failed to detect and turn on Pi Camera. Please make sure it is plugged in properly.",
                type: "error",
                hide: false,
            });
        }
    };

    apiCommand({command: 'get_config'}, setConfigVars);

    self.resetButtonClicked = function(event) {
        self.sending(true);
        apiCommand({command: 'reset_config'}, function(result) {
            setTimeout(function() {
                self.regUrl(result.reg_url);
                self.registered(result.registered);
                self.tokenReset(true);
                self.sending(false);
            }, 500);
        });
    };
}


// view model class, parameters for constructor, container to bind to
OCTOPRINT_VIEWMODELS.push([
    AnywhereViewModel,

    // e.g. loginStateViewModel, settingsViewModel, ...
    [],

    // e.g. #settings_plugin_slicer, #tab_plugin_slicer, ...
    [ "#settings_plugin_anywhere", "#wizard_plugin_anywhere" ]
]);
}());
